var {mongoose} = require('../connect');

const dbSchema = new mongoose.Schema({
    entryPointName:String,
    exitPointName:String,
    entryPointLat:String,
    entryPointLng:String,
    exitPointLat:String,
    exitPointLng:String
  },{ collection: 'entryExitPoints' });
  
const entryExitPoints = mongoose.model('entryExitPoints', dbSchema);

module.exports={entryExitPoints}