const Exercise = require('../models/Exercise');

const insertExercise = async (exerciseData) => {
  try {
    const { name, muscle, musclesInvolved, position, execution, equipment, requiredGym, image } = exerciseData;
    if (!name || !muscle || !musclesInvolved || !position || !execution || !requiredGym) {
      throw new Error('Faltan campos obligatorios o reps');
    }
    if(!image) image = '';
    const newExercise = new Exercise({ name, muscle, musclesInvolved, position, execution, equipment, requiredGym, image });
    await newExercise.save();
    return newExercise;
  } catch (err) {
    console.error('Error al insertar ejercicio:', err);
    throw err;
  }
};
const insertManyExercises = async (exerciseData) => {
   try {
    const exercises = exerciseData;
    if (!Array.isArray(exercises)) {
      throw new Error('Debes enviar un array de ejercicios');
    }
    const newExercise = await Exercise.insertMany(exercises);
    return newExercise;
  } catch (err) {
    console.error('Error al insertar ejercicio:', err);
    throw err;
  }
}

const getAllExercises = async () => {
  try {
    return await Exercise.find();
  } catch (err) {
    console.error('Error al obtener ejercicios:', err);
    throw err;
  }
};

const getExerciseById = async (id) => {
  try {
    const exercise = await Exercise.findById(id);
    if (!exercise) throw new Error('Ejercicio no encontrado');
    return exercise;
  } catch (err) {
    throw err;
  }
};
const getExerciseByName = async (name) => {
  try{
    const exercise = await Exercise.find({name: name})
    if (!exercise) throw new Error('Ejercicio no encontrado');
    return exercise;
  }catch(err){
    throw err;
  }
}
const deleteExerciseById = async (id) => {
  try{
    const exercise = await Exercise.findByIdAndDelete({_id: id});
    if(!exercise) throw new Error('Exercise no encontrado')
  }catch(err){
    throw err;
  }
}
const updateExerciseById = async (id, data) => {
  try{
    const {name, muscle, musclesInvolved, position, execution, equipment, requiredGym, image} = data;
    if(!name || !muscle || !musclesInvolved || !position || !execution || !equipment ||!requiredGym) throw new Error('Rellene todos los campos');
    if(!id) throw new Error('Error en el id');
    if(!image) image = await Exercise.findById({_id:id}).select('image');
    const exercise = await Exercise.findByIdAndUpdate({_id: id}, {name, muscle, musclesInvolved, position, execution, equipment, requiredGym, image}, {new: true});
    if(!exercise) throw new Error('Exercise no encontrado');
    return exercise
  }catch(err){
    throw err;
  }
}

module.exports = { insertExercise, getAllExercises, getExerciseById, getExerciseByName, deleteExerciseById, updateExerciseById, insertManyExercises };