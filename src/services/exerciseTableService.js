const ExerciseTable = require('../models/ExerciseTable');

const createExerciseTable = async (data) => {
  try {
    const { name, exercises, user } = data;
    if (!name || !Array.isArray(exercises) || exercises.length === 0 || !user) {
      throw new Error('Faltan datos para crear la tabla');
    }

    const newTable = new ExerciseTable({ name, exercises, user });
    await newTable.save();
    return newTable;
  } catch (err) {
    console.error('Error al crear ExerciseTable:', err);
    throw err;
  }
};

const getExerciseTablesByUser = async (userId) => {
  try {
    return await ExerciseTable.find({ user: userId }).populate('exercises');
  } catch (err) {
    console.error('Error al obtener tablas de usuario:', err);
    throw err;
  }
};

const getExerciseTableById = async (id) => {
  try {
    const table = await ExerciseTable.findById(id).populate('exercises');
    if (!table) throw new Error('Tabla no encontrada');
    return table;
  } catch (err) {
    throw err;
  }
};
const updateExerciseTable = async(id, data) => {
  try{
    const {name, exercises, user} = data;
    if(!name || !exercises || !user) throw new Error('Rellene todos los campos');
    const updatedTable = await ExerciseTable.findByIdAndUpdate({_id: id}, {name, exercises, user},{new: true});
    if(!updatedTable) throw new Error('exerciseTable no encontrada');
    return updatedTable;
  }catch(err){
    throw err;
  }
}
const getExerciseTableByName = async(id, name) => {
  try{
    const exerciseTable = await ExerciseTable.findOne({
      user: id,
      name: name
    }).populate('exercises');
    if(!exerciseTable) throw new Error('No se ha encontrado el exerciseTable');
    return exerciseTable;
  }catch(err){
    throw err;
  }
}
const deleteExerciseTable = async(tableId) => {
  try{
    const exerciseTable = await ExerciseTable.findByIdAndDelete({_id: tableId});
    if(!exerciseTable) throw new Error('No se ha encontrado el exerciseTable');
  }catch(err){
    throw err;
  }
}

module.exports = { createExerciseTable, getExerciseTablesByUser, getExerciseTableById, updateExerciseTable, getExerciseTableByName, deleteExerciseTable };