const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: 
  { 
    type: String, 
    required: true 
  },
  muscle: 
  { 
    type: String, 
    required: true 
  },
  musclesInvolved:
  {
    type: [String],
    required: true
  },
  position: 
  {
    type: String,
    required: true
  },
  execution: 
  {
    type: [String],
    required: true
  },
  equipment: 
  {
    type: [String],
    required: false,
    default: []
  },
  requiredGym: 
  {
    type: Boolean,
    required: true
  },
  image: 
  { 
    type: String,
    required: false
  }, 
}, { timestamps: true });
const exercise =  mongoose.model('Exercise', exerciseSchema);
module.exports = exercise;