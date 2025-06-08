const ExerciseTable = require('../models/ExerciseTable');
const Exercise = require('../models/Exercise');
const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

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
    const { name, exercisesByDay, user } = data;

    if (
      !name || 
      !exercisesByDay || 
      !user
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

    const updatedTable = await ExerciseTable.findByIdAndUpdate({ _id: id },{ name, exercisesByDay, user },{ new: true });

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
const createAutoFullBodyTable = async (userId, requiredGym) => {
try {
    // 1️⃣ Traer todos los ejercicios con requiredGym
    const allExercises = await Exercise.find({ requiredGym });

    // 2️⃣ Agrupar ejercicios por grupo muscular
    const exercisesByGroup = {
      'Piernas': [],
      'Pectorales': [],
      'Espalda': [],
      'Hombros': [],
      'Bíceps-Tríceps': [],
      'Abdominales': []
    };

    allExercises.forEach(exercise => {
      const muscle = exercise.muscle;
      if (muscle === 'Piernas' || muscle === 'Gemelos') {
        exercisesByGroup['Piernas'].push(exercise._id);
      } else if (muscle === 'Bíceps' || muscle === 'Tríceps') {
        exercisesByGroup['Bíceps-Tríceps'].push(exercise._id);
      } else if (exercisesByGroup[muscle]) {
        exercisesByGroup[muscle].push(exercise._id);
      }
    });

    // 3️⃣ Preparar 3 días
    const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    const usedExerciseIds = new Set();
    const exercisesByDay = [];

    daysOfWeek.forEach(day => {
      const dayExercises = [];

      for (const group in exercisesByGroup) {
        const availableExercises = exercisesByGroup[group].filter(
          id => !usedExerciseIds.has(id)
        );

        if (availableExercises.length > 0) {
          // Elegir aleatoriamente
          const randomIndex = Math.floor(Math.random() * availableExercises.length);
          const selectedId = availableExercises[randomIndex];

          // Añadir al día y marcar como usado
          dayExercises.push(selectedId);
          usedExerciseIds.add(selectedId);
        }
      }

      exercisesByDay.push({
        day,
        exercises: dayExercises
      });
    });

    // 4️⃣ Crear y guardar la tabla
    const table = new ExerciseTable({
      name: 'Full Body 3 Días',
      exercisesByDay,
      user: userId
    });

    await table.save();

    return table;
  } catch (error) {
    console.error(error);
    throw new Error('Error generando la tabla full body');
  }
}
const createAutoTable = async (userId, requiredGym) => {
  try{
  // 1️⃣ Traemos todos los ejercicios filtrados por requiredGym
  const allExercises = await Exercise.find({ requiredGym });

  // 2️⃣ Agrupamos por grupo muscular
  const muscleGroups = [
    'Piernas',
    'Pectorales',
    'Espalda',
    'Hombros',
    'Bíceps',
    'Tríceps',
    'Abdominales',
    'Gemelos'
  ];

  const exercisesByMuscle = {};
  muscleGroups.forEach(muscle => {
    exercisesByMuscle[muscle] = shuffleArray(
      allExercises.filter(e => e.muscle === muscle)
    );
  });

  // 3️⃣ Definimos días de la semana
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  const usedExerciseIds = new Set();

  // 4️⃣ Planificamos cada día
  const exercisesByDay = [];

  for (const day of days) {
    let dayExercises = [];

    // 5️⃣ Elegimos un grupo muscular principal que aún tenga ejercicios
    let primaryMuscle = muscleGroups.find(
      m => exercisesByMuscle[m]?.length > 0
    );

    // 6️⃣ Si no quedan grupos, salimos
    if (!primaryMuscle) break;

    switch (primaryMuscle) {
      case 'Bíceps':
        // 3 de Bíceps + 3 de Tríceps
        dayExercises.push(
          ...exercisesByMuscle['Bíceps'].splice(0, 3).map(e => e._id)
        );
        dayExercises.push(
          ...exercisesByMuscle['Tríceps'].splice(0, 3).map(e => e._id)
        );
        break;

      case 'Piernas':
        // 5 de Piernas + 1 de Gemelos (si hay)
        dayExercises.push(
          ...exercisesByMuscle['Piernas'].splice(0, 5).map(e => e._id)
        );
        if (exercisesByMuscle['Gemelos'].length > 0) {
          dayExercises.push(
            exercisesByMuscle['Gemelos'].splice(0, 1)[0]._id
          );
        }
        break;

      default:
        // 6 de ese grupo
        dayExercises.push(
          ...exercisesByMuscle[primaryMuscle].splice(0, 6).map(e => e._id)
        );
        break;
    }

    // 7️⃣ Si hay abdominales, añadir preferiblemente con Hombros
    if (primaryMuscle === 'Hombros' && exercisesByMuscle['Abdominales'].length > 0) {
      const abExercise = exercisesByMuscle['Abdominales'].shift();
      dayExercises.push(abExercise._id);
    }
    if (primaryMuscle === 'Piernas' && exercisesByMuscle['Abdominales'].length > 0) {
      const abExercise = exercisesByMuscle['Abdominales'].shift();
      dayExercises.push(abExercise._id);
    }

    // 8️⃣ Evitamos duplicados en toda la tabla
    dayExercises = dayExercises.filter(id => !usedExerciseIds.has(id));
    dayExercises.forEach(id => usedExerciseIds.add(id));

    // 9️⃣ Guardamos el día
    exercisesByDay.push({
      day,
      exercises: dayExercises
    });
  }

  // 10️⃣ Creamos la tabla
  const exerciseTable = new ExerciseTable({
    name: `Tabla automática - ${requiredGym ? 'Gimnasio' : 'Casa'}`,
    exercisesByDay,
    user: userId
  });

  await exerciseTable.save();
  return exerciseTable;
  }catch(err){
    console.error(err);
    throw new Error('Error generando la tabla automátizada');
  }
};

module.exports = { createExerciseTable, getExerciseTablesByUser, getExerciseTableById, updateExerciseTable, getExerciseTableByName, deleteExerciseTable, createAutoTable, createAutoFullBodyTable };