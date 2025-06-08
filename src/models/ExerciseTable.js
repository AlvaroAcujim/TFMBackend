const mongoose = require('mongoose');

const exerciseTableSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
}, // Por ejemplo: "Rutina de pecho"
  exercisesByDay: [{
    day: { 
      type: String, 
      required: true,
      enum: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'] // o puedes usar abreviaturas
    },
    exercises: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise'
    }]
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const exerciseTable = mongoose.model('ExerciseTable', exerciseTableSchema);
module.exports = exerciseTable;