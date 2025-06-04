const { insertExercise, getAllExercises, getExerciseById, getExerciseByName, deleteExerciseById, updateExerciseById, insertManyExercises} = require('../services/exerciseService');

const exerciseController = {
  createExercise:[ 
    async (req, res) => {
    try {
      const exercise = await insertExercise(req.body);
      res.status(201).json(exercise);
    } catch (err) {
      console.log('Ha ocurrido un error: ', err)
      res.status(500).json({ error: err.message });
    }
  }],
  insertManyExercises:[
    async(req, res) => {
      try {
      const exercise = await insertManyExercises(req.body);
      res.status(201).json(exercise);
    } catch (err) {
      console.log('Ha ocurrido un error: ', err)
      res.status(500).json({ error: err.message });
    }
    }
  ],

  getExercises: [
  async (req, res) => {
    try {
      const exercises = await getAllExercises();
      res.status(200).json(exercises);
    } catch (err) {
      console.log('Ha ocurrido un error: ', err)
      res.status(500).json({ error: err.message });
    }
  }],

  getExerciseById: [
    async (req, res) => {
    try {
      const exercise = await getExerciseById(req.params.id);
      res.status(200).json(exercise);
    } catch (err) {
      console.log('Ha ocurrido un error: ', err)
      res.status(404).json({ error: err.message });
    }
  }],
  getExerciseByName: [
    async (req, res) => {
      try{
        const {name} = req.params;
        const exercise = await getExerciseByName(name);
        res.status(200).json(exercise);
      }catch(err){
        console.log('Ha ocurrido un error: ', err)
        res.status(404).json({error: err.message});
      }
    }
  ],
  deleteExerciseById: [
    async (req, res) => {
      try{
        const {id} = req.params;
        const exercise = await deleteExerciseById(id);
        res.status(200).json({message: 'Exercise eliminado'});
      }catch(err){
        console.log('Ha ocurrido un error: ', err)
        res.status(404).json({error: err.message});
      }
    }
  ],
  updateExerciseById: [
    async(req, res) => {
      try{
        const {id} = req.params;
        const data = req.body;
        const updatedExercise = await updateExerciseById(id, data);
        res.status(200).json({updatedExercise});
      }catch(err){
        console.log('Ha ocurrido un error: ', err)
        res.status(404).json({error: err.message});
      }
    }
  ]

};

module.exports = exerciseController;