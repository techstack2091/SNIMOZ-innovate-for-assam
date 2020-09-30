var {mongoose} = require('../connect');

const dbSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    type: {
        type:String,
        required:[true,'ERROR Zone Type is not provided']
    },
    name:{
        unique:true,
        type:String,
        required:[true,'ERROR Zone Name is not provided']
    },
    coordinates:{
        type:[],
        0:[],
        required:[true,'ERROR Zone is not provided']
    }
  },{ collection: 'restrictedZone' });
  
const restrictedZone = mongoose.model('restrictedZone', dbSchema);
module.exports={restrictedZone}