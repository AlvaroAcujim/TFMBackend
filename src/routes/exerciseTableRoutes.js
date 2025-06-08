const express = require('express');
const router = express.Router();
const tableController = require('../controllers/exerciseTableController');
const {verifyToken} = require('../middlewares/authMiddleware');

router.post('/', verifyToken(['user', 'admin']), tableController.createTable);
router.post('/auto', verifyToken(['user', 'admin']), tableController.createAutoTable);
router.post('/autoFullBody', verifyToken(['user', 'admin']), tableController.createAutoFullBodyTable);
router.get('/user', verifyToken(['user', 'admin']), tableController.getExerciseTablesByUser);
router.get('/search', verifyToken(['user', 'admin']), tableController.getExerciseTableByName);
router.get('/:id', verifyToken(['user', 'admin']), tableController.getExerciseTableById);
router.put('/', verifyToken(['user', 'admin']), tableController.updateExerciseTable);
router.delete('/:id', verifyToken(['user', 'admin']), tableController.deleteExerciseTable);



module.exports = router;
