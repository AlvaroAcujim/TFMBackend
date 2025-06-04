const { createExerciseTable, getExerciseTablesByUser, getExerciseTableById, updateExerciseTable, getExerciseTableByName, deleteExerciseTable } = require('../services/exerciseTableService');

const exerciseTableController = {
  createTable: [
    async (req, res) => {
    try {
      const table = await createExerciseTable(req.body);
      res.status(201).json(table);
    } catch (err) {
      console.log('Ha ocurrido un error: ', err)
      res.status(500).json({ error: err.message });
    }
  }],

  getExerciseTablesByUser: [
    async (req, res) => {
    try {
      const userId = req.user.id;
      const tables = await getExerciseTablesByUser(userId);
      res.status(200).json(tables);
    } catch (err) {
      console.log('Ha ocurrido un error: ', err)
      res.status(500).json({ error: err.message });
    }
  }],

  getExerciseTableById: [
    async (req, res) => {
    try {
      const table = await getExerciseTableById(req.params.id);
      res.status(200).json(table);
    } catch (err) {
      console.log('Ha ocurrido un error: ', err)
        res.status(404).json({error: err.message});
    }
  }],
  updateExerciseTable: [
    async(req, res) => {
      try{
        const idUser = req.user.id;
        const data = req.body;
        const exerciseTable = await updateExerciseTable(idUser, data);
        res.status(200).json(exerciseTable);
      }catch(err){
        console.log('Ha ocurrido un error: ', err)
        res.status(404).json({error: err.message});
      }
    }
  ],
  getExerciseTableByName: [
    async(req, res) => {
      try{
        const idUser = req.user.id;
        const name = req.query.name;
        const exerciseTable = await getExerciseTableByName(idUser, name);
        res.status(200).json({exerciseTable});
      }catch(err){
        console.log('Ha ocurrido un error: ', err)
        res.status(404).json({error: err.message});
      }
    }
  ],
  deleteExerciseTable: [
    async(req, res) => {
      try{
        const id = req.params;
        const exerciseTable =  await deleteExerciseTable(id);
        res.status(200).json({message: 'tanla eliminada'});
      }catch(err){
        console.log('Ha ocurrido un error: ', err);
        res.status(404).json({error: err.message});
      }
    }
  ]

};

module.exports = exerciseTableController;