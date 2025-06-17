const ExerciseTable = require('../models/ExerciseTable');
const Exercise = require('../models/Exercise');
const {getImagesBase64ByFilenames} =  require('../services/fileService');
const axios = require('axios');
//const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

const createExerciseTable = async (user, data) => {
  try {
    const { name, exercisesByDay } = data;

    if (
      !name || 
      !Array.isArray(exercisesByDay) || 
      exercisesByDay.length === 0 || 
      !user
    ) {
      throw new Error('Faltan datos para crear la tabla');
    }

    exercisesByDay.forEach(dayObj => {
      if (!dayObj.day ) throw new Error('Cada día debe tener un nombre y una lista de ejercicios (puede estar vacía)');
    });

    const newTable = new ExerciseTable({ name, exercisesByDay, user })
    await newTable.save();
    const table = ExerciseTable.find({name: name, user:user}).populate({
    path: 'exercisesByDay.exercises',
    model: 'Exercise'
  });
    return table;
  } catch (err) {
    console.error('Error al crear ExerciseTable:', err);
    throw err;
  }
};

const getExerciseTablesByUser = async (userId) => {
  try {
    return await ExerciseTable.find({ user: userId }).populate({
    path: 'exercisesByDay.exercises',
    model: 'Exercise'
  });
  } catch (err) {
    console.error('Error al obtener tablas de usuario:', err);
    throw err;
  }
};

const getExerciseTableById = async (id) => {
  try {
    const table = await ExerciseTable.findById(id)
       .populate({
    path: 'exercisesByDay.exercises',
    model: 'Exercise'
  });
    if (!table) throw new Error('Tabla no encontrada');
    return table;
  } catch (err) {
    throw err;
  }
};

const updateExerciseTable = async (id, data) => {
  try {
    const { name, exercisesByDay} = data;

    if (
      !name || 
      !exercisesByDay 
    ) {
      throw new Error('Rellene todos los campos');
    }

    exercisesByDay.forEach(dayObj => {
      if (
        !dayObj.day ||
        !Array.isArray(dayObj.exercises)
      ) {
        throw new Error('Cada día debe tener un nombre y una lista de ejercicios (puede estar vacía)');
      }
    });

    const updatedTable = await ExerciseTable.findByIdAndUpdate({ _id: id },{ name, exercisesByDay },{ new: true });

    if (!updatedTable) throw new Error('exerciseTable no encontrada');
    return updatedTable;
  } catch (err) {
    throw err;
  }
};

const getExerciseTableByName = async (userId, name) => {
  try {
    const exerciseTable = await ExerciseTable.findOne({
      user: userId,
      name: name
    }) .populate({
    path: 'exercisesByDay.exercises',
    model: 'Exercise'
  });

    if (!exerciseTable) throw new Error('No se ha encontrado el exerciseTable');
    return exerciseTable;
  } catch (err) {
    throw err;
  }
};

const deleteExerciseTable = async (tableId) => {
  try {
    const exerciseTable = await ExerciseTable.findByIdAndDelete({ _id: tableId });
    if (!exerciseTable) throw new Error('No se ha encontrado el exerciseTable');
  } catch (err) {
    throw err;
  }
};
const cleanJSONfromText = (text) => {
  const first = text.indexOf('[');
  const last = text.lastIndexOf(']');
  if (first === -1 || last === -1) return null;
  return text.substring(first, last + 1);
};

async function callTogetherAI(prompt, options = {}) {
  const { timeout = 30000 } = options;
  const response = await axios.post(
    'https://api.together.xyz/v1/chat/completions',
    {
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1', // o meta-llama/Llama-3-8b-Instruct
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024,
      temperature: 0.4,
      stop: ['```', '\n\n'] // evita respuestas demasiado largas o código extra
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout,
    }
  );
  return response.data.choices[0].message.content;
}

const createAutoFullBodyTable = async (userId, requiredGym) => {
  try {
    if (!process.env.API_KEY) throw new Error('TOGETHER_API_KEY no definida');

    const allExercises = await Exercise.find({ requiredGym });
    if (!allExercises.length) throw new Error('No se encontraron ejercicios');

    const exercisesListStr = allExercises.map(e => `${e._id.toString()}: ${e.name}`).join('\n');

   const prompt = `
Eres un entrenador personal experto. Crea una rutina semanal full body para principiantes, 5 días (Lunes a Viernes).
Cada día debe incluir **estrictamente entre 6 y 8 ejercicios** variados, sin repetir ejercicios en la semana.
Distribuye los ejercicios de forma que cada día incluya ejercicios de diferentes grupos musculares,
y que ningún grupo muscular tenga más de 1 o 2 ejercicios por día para evitar concentración excesiva en un solo grupo.
Usa solo los ejercicios listados, sin inventar.
Devuelve **SOLO un JSON válido y EXACTO** con este formato:

[
  { "day": "Lunes", "exercises": ["id1", "id2", "id3", "id4", "id5", "id6"] },
  ...
]

Lista de ejercicios con id y nombre:
${exercisesListStr}
`;

    const content = await callTogetherAI(prompt, { timeout: 60000 });
    const jsonStr = cleanJSONfromText(content);
    if (!jsonStr) throw new Error('No se encontró JSON válido en la respuesta');

    let exercisesByDay;
    try {
      exercisesByDay = JSON.parse(jsonStr);

    } catch {
      throw new Error('JSON inválido tras limpiar la respuesta');
    }
    exercisesByDay = exercisesByDay.map(dayEntry => {
  let day = dayEntry.day;
  if (day.toLowerCase() === 'miércoles') {
    day = 'Miercoles';
  }
  return { ...dayEntry, day };
});

    if (!Array.isArray(exercisesByDay) || exercisesByDay.length !== 5)
      throw new Error('JSON no tiene 5 días');

    const table = new ExerciseTable({
      name: 'Full Body 5 Días',
      exercisesByDay,
      user: userId
    });
    await table.save();

    return table;

  } catch (error) {
    console.error('Error en createAutoFullBodyTable:', error);
    throw new Error(`Error generando tabla full body: ${error.message}`);
  }
};
const muscleGroupsByDay = {
  Lunes: ['Pectorales'],
  Martes: ['Hombros'],
  Miercoles: ['Piernas', 'Gemelos'],
  Jueves: ['Bíceps', 'Tríceps'],
  Viernes: ['Espalda'],
};
function groupExercisesByDay(allExercises) {
  const result = {};

  for (const [day, muscles] of Object.entries(muscleGroupsByDay)) {
    result[day] = allExercises.filter(ex =>
      muscles.some(muscle => muscle.toLowerCase() === ex.muscle.toLowerCase())
    );
  }

  return result;
}
const createAutoTable = async (userId, requiredGym) => {
       try {
    if (!process.env.API_KEY) throw new Error('API_KEY no definida');

    const allExercises = await Exercise.find({ requiredGym });
    if (!allExercises.length) throw new Error('No se encontraron ejercicios');

    const exercisesByDayFiltered = groupExercisesByDay(allExercises);

    const exercisesListStr = Object.entries(exercisesByDayFiltered)
      .map(([day, exercises]) => {
        const entries = exercises
          .map(e => `${e._id.toString()}: ${e.name}`)
          .join('\n');
        return `Ejercicios para ${day}:\n${entries}`;
      })
      .join('\n\n');

    const prompt = `
Eres un entrenador experto que crea tablas para usuarios avanzados.
Genera una rutina semanal (Lunes a Viernes), enfocando cada día en uno o varios grupos musculares diferentes.
Cada día debe contener al menos 4 y como máximo 7 ejercicios, sin repetir ninguno.
Usa SOLO los ejercicios listados para cada día.

**Distribución de grupos musculares:**
Lunes: Pectorales  
Martes: Hombros  
Miércoles: Piernas y Gemelos  
Jueves: Bíceps y Tríceps  
Viernes: Espalda

⚠️ IMPORTANTE: 
- El jueves, asegúrate de que haya al menos 2 a 3 ejercicios para bíceps y al menos 2 a 3 ejercicios para tríceps (el resto puede ser de cualquiera de los dos).
- No inventes ningún ID. Usa solo IDs válidos.

Devuelve SOLO un JSON válido con este formato:

[
  { "day": "Lunes", "exercises": ["id1", "id2", "id3", "id4", "id5"] },
  { "day": "Martes", "exercises": ["id6", "id7", "id8", "id9", "id10"] },
  { "day": "Miercoles", "exercises": ["id11", "id12", "id13", "id14", "id15"] },
  { "day": "Jueves", "exercises": ["id16", "id17", "id18", "id19", "id20"] },
  { "day": "Viernes", "exercises": ["id21", "id22", "id23", "id24", "id25"] }
]

${exercisesListStr}
`;

    const content = await callTogetherAI(prompt, { timeout: 60000 });

    const jsonStr = cleanJSONfromText(content);
    if (!jsonStr) throw new Error('No se encontró JSON válido en la respuesta');

    let exercisesByDay;
    try {
      exercisesByDay = JSON.parse(jsonStr);
    } catch {
      throw new Error('JSON inválido tras limpiar la respuesta');
    }

    exercisesByDay = exercisesByDay.map(dayEntry => {
      let day = dayEntry.day;
      if (day.toLowerCase() === 'miércoles') {
        day = 'Miercoles';
      }
      return { ...dayEntry, day };
    });

    if (!Array.isArray(exercisesByDay) || exercisesByDay.length !== 5)
      throw new Error('JSON no tiene 5 días');

    for (const dayEntry of exercisesByDay) {
      const validMuscles = muscleGroupsByDay[dayEntry.day];
      if (!validMuscles) throw new Error(`Día inválido: ${dayEntry.day}`);

      if (
        !Array.isArray(dayEntry.exercises) ||
        dayEntry.exercises.length < 5 ||
        dayEntry.exercises.length > 8
      ) {
        throw new Error(
          `El día ${dayEntry.day} debe tener entre 5 y 8 ejercicios. Tiene ${dayEntry.exercises.length}.`
        );
      }

      for (const exerciseId of dayEntry.exercises) {
        const exercise = allExercises.find(e => e._id.toString() === exerciseId);
        if (!exercise) throw new Error(`Ejercicio con id ${exerciseId} no encontrado.`);

        if (
          !validMuscles.some(
            muscle => muscle.toLowerCase() === exercise.muscle.toLowerCase()
          )
        ) {
          throw new Error(
            `Ejercicio ${exercise.name} (id ${exerciseId}) del día ${dayEntry.day} no pertenece a los grupos musculares asignados (${validMuscles.join(
              ', '
            )}).`
          );
        }
      }
    }

    const table = new ExerciseTable({
      name: `Tabla automática - ${requiredGym ? 'Gimnasio' : 'Casa'}`,
      exercisesByDay,
      user: userId,
    });

    await table.save();
    return table;
  } catch (error) {
    console.error('Error en createAutoTable:', error);
    throw new Error(`Error generando tabla avanzada: ${error.message}`);
  }
};
const getImagesForExerciseTable = async (tableId) => {
   const table = await ExerciseTable.findById(tableId)
    .populate({
      path: 'exercisesByDay.exercises',
    });

  if (!table) throw new Error('Tabla no encontrada');

  const exercises = [];
  table.exercisesByDay.forEach((day) => {
    day.exercises.forEach((exercise) => {
      if (exercise && exercise.image) {
        exercises.push({ name: exercise.name, image: exercise.image });
      }
    });
  });


  const filenames = exercises.map((ex) => ex.image);
  const images = await getImagesBase64ByFilenames(filenames);

  return images.map((img, index) => ({
    name: exercises[index].name,
    image: img.base64Image
  }));
};

module.exports = { createExerciseTable, getExerciseTablesByUser, getExerciseTableById, updateExerciseTable, getExerciseTableByName, deleteExerciseTable, createAutoTable, createAutoFullBodyTable, getImagesForExerciseTable };