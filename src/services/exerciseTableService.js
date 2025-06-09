const ExerciseTable = require('../models/ExerciseTable');
const Exercise = require('../models/Exercise');
const {getImagesBase64ByFilenames} =  require('../services/fileService');
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
    const allExercises = await Exercise.find({ requiredGym });

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

    const daysOfWeek = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
    const usedExerciseIds = new Set();
    const exercisesByDay = [];

    daysOfWeek.forEach(day => {
      const dayExercises = [];

      for (const group in exercisesByGroup) {
        const availableExercises = exercisesByGroup[group].filter(
          id => !usedExerciseIds.has(id)
        );

        if (availableExercises.length > 0) {
          const randomIndex = Math.floor(Math.random() * availableExercises.length);
          const selectedId = availableExercises[randomIndex];

          dayExercises.push(selectedId);
          usedExerciseIds.add(selectedId);
        }
      }

      exercisesByDay.push({
        day,
        exercises: dayExercises
      });
    });

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
  const allExercises = await Exercise.find({ requiredGym });

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

  const days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
  const usedExerciseIds = new Set();

  const exercisesByDay = [];

  for (const day of days) {
    let dayExercises = [];

    let primaryMuscle = muscleGroups.find(
      m => exercisesByMuscle[m]?.length > 0
    );

    if (!primaryMuscle) break;

    switch (primaryMuscle) {
      case 'Bíceps':
        dayExercises.push(
          ...exercisesByMuscle['Bíceps'].splice(0, 3).map(e => e._id)
        );
        dayExercises.push(
          ...exercisesByMuscle['Tríceps'].splice(0, 3).map(e => e._id)
        );
        break;

      case 'Piernas':
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
        dayExercises.push(
          ...exercisesByMuscle[primaryMuscle].splice(0, 6).map(e => e._id)
        );
        break;
    }

    if (primaryMuscle === 'Hombros' && exercisesByMuscle['Abdominales'].length > 0) {
      const abExercise = exercisesByMuscle['Abdominales'].shift();
      dayExercises.push(abExercise._id);
    }
    if (primaryMuscle === 'Piernas' && exercisesByMuscle['Abdominales'].length > 0) {
      const abExercise = exercisesByMuscle['Abdominales'].shift();
      dayExercises.push(abExercise._id);
    }

    dayExercises = dayExercises.filter(id => !usedExerciseIds.has(id));
    dayExercises.forEach(id => usedExerciseIds.add(id));

    exercisesByDay.push({
      day,
      exercises: dayExercises
    });
  }
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