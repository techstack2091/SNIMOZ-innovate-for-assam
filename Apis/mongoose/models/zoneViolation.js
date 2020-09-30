var {mongoose} = require('../connect');

const dbSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    mob:String,
    vehicleReg:String,
    vehicleType:String,
    time:String,
    violations:{type:[]}
  },{ collection: 'zoneViolations' });
  
const zoneViolations = mongoose.model('zoneViolations', dbSchema);

module.exports={zoneViolations}