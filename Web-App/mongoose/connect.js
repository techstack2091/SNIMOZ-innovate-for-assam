const mongoose = require('mongoose');

const uri = 'mongo db url';
mongoose.connect(uri, {  useNewUrlParser: true,  useUnifiedTopology: true, useCreateIndex:true, });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
  console.log("connected")
});

module.exports={mongoose}