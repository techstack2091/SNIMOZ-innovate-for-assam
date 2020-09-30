var {mongoose} = require('../connect');

const dbSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    mob:String,
    vehicleReg:String,
    vehicleType:String,
    time:String,
    violations:{type:[]}
  },{ collection: 'speedViolations' });
  
const speedViolationsmodel = mongoose.model('speedViolations', dbSchema);

module.exports={speedViolationsmodel}