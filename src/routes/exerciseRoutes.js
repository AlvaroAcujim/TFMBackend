const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');

router.post('/', exerciseController.createExercise);
router.post('/bulk', exerciseController.insertManyExercises);
router.delete('/', exerciseController.deleteExerciseById);
router.put('/', exerciseController.updateExerciseById);
router.get('/', exerciseController.getExercises);
router.get('/:id', exerciseController.getExerciseById);
router.get('/search/:name', exerciseController.getExerciseByName);

module.exports = router;
