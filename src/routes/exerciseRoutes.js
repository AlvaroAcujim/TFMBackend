const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');

router.post('/', exerciseController.createExercise);
router.post('/bulk', exerciseController.insertManyExercises);
router.delete('/', exerciseController.deleteExerciseById);
router.put('/', exerciseController.updateExerciseById);
router.get('/gymRequirement/:requiredGym', exerciseController.getExercisesByRequiredGym)
router.get('/', exerciseController.getExercises);
router.get('/exercisesImages', exerciseController.getAllExercisesWithImages);
router.get('/search/:name', exerciseController.getExerciseByName);
router.get('/:id', exerciseController.getExerciseById);

module.exports = router;
