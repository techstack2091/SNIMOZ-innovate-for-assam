var {mongoose} = require('../connect');

const dbSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    mob:String,
    vehicleReg:String,
    vehicleType:String,
    time:String,
    realtimeLocation:String
  },{ collection: 'journeyRegistration' });
  
const journeyRegistration = mongoose.model('journeyRegistartion', dbSchema);

module.exports={journeyRegistration}