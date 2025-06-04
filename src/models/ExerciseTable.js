const mongoose = require('mongoose');

const exerciseTableSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
}, // Por ejemplo: "Rutina de pecho"
  exercises: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const exerciseTable = mongoose.model('ExerciseTable', exerciseTableSchema);
module.exports = exerciseTable;