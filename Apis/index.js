const bodyParser = require("body-parser");
const express = require("express");
const app = express();

var ObjectID = require('mongodb').ObjectID;
var {journeyRegistration} = require('./mongoose/models/journeyReg');
var {restrictedZone} = require('./mongoose/models/restrictedZone');
var {entryExitPoints} = require('./mongoose/models/entryExit');
var {speedViolations} = require('./mongoose/models/speedViolation');
var {zoneViolations} = require('./mongoose/models/zoneViolation');

const { json } = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.post('/journeyRegistration', function(req,res){
  console.log(req.body);
  let newJourney = new journeyRegistration({
    _id: new ObjectID(),
    name: req.body.name,
    mob: req.body.mob,
    vehicleReg:req.body.vehicleReg,
    vehicleType: req.body.vehicleType,
    time:req.body.time,
    realtimeLocation:req.body.realtimeLocation
  });

  newJourney.save().then((data)=>{
    return res.send(data);
  })
  .catch((err)=>{
    return res.send(err);
  })
});

app.get("/getUser/:id", function (req, res) {
  journeyRegistration.findOne({ "_id": req.params.id }, (error, result) => {
    if(error) {
        return res.send(error);
    }
    if(!result) return res.send("No data found");
    return res.send(result);
  });
});

app.get("/getRestrictedZone", function(req,res){
  restrictedZone.find((err,data)=>{
    if(err) return res.send(err);
    res.send(data);
  });
})

app.get("/getEntryExitPoint", function(req,res){
  entryExitPoints.find((err,data)=>{
    if(err) return res.send(err);
    res.send(data);
  });
})

app.post('/postSpeedViolation', function(req,res){
  arr=[];
  arr.push([req.body.violationTime,req.body.violationPoint]);
  speedViolations.findOneAndUpdate({_id:req.body.id}, 
    { _id: req.body.id,
      name: req.body.name,
      mob: req.body.mob,
      time:req.body.time,
      vehicleReg:req.body.vehicleReg,
      vehicleType: req.body.vehicleType,
      $push:{violations:[[req.body.violationTime,req.body.violationPoint]]}
    }, 
    {upsert: true},
    (err, data) => {
      if (err)
        return res.send(err);
      res.sendStatus(200);
    });
});

app.post('/postZoneViolation', function(req,res){
  arr=[];
  arr.push([req.body.violationTime,req.body.violationPoint]);
  zoneViolations.findOneAndUpdate({_id:req.body.id}, 
    { _id: req.body.id,
      name: req.body.name,
      mob: req.body.mob,
      time:req.body.time,
      vehicleReg:req.body.vehicleReg,
      vehicleType: req.body.vehicleType,
      $push:{violations:[[req.body.violationTime,req.body.violationPoint]]}
    }, 
    {upsert: true},
    (err, data) => {
      if (err)
        return res.send(err);
      res.sendStatus(200);
    });
});

app.delete('/journeyDelete/:id', function(req,res){
  journeyRegistration.findByIdAndDelete(req.params.id, function (err) {
    if(err) return res.send(err)
    return res.send("Sucessfull deletion");
  });
})

app.post('/updateRealtimeLocation', function(req,res){
  journeyRegistration.findOneAndUpdate({_id:req.body.id}, 
    { realtimeLocation:req.body.realtimeLocation
    }, 
    (err, data) => {
      if (err)
        return res.sendStatus(400);
      res.sendStatus(200);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on Port:${PORT}`);
});
