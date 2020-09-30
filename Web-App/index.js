const bodyParser = require("body-parser");
const express = require("express");
const ejs = require("ejs");
const path = require('path');
const app = express();

var ObjectID = require('mongodb').ObjectID;
var {journeyRegistration} = require('./mongoose/models/journeyReg');
var {restrictedZone} = require('./mongoose/models/restrictedZone');
var {entryExitPoints} = require('./mongoose/models/entryExit');
var {speedViolationsmodel} = require('./mongoose/models/speedViolation');
var {zoneViolationsmodel} = require('./mongoose/models/zoneViolation');

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname + '/static')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function (req, res) {
    Promise.all([
      journeyRegistration.count().exec(),
      zoneViolationsmodel.count().exec(),
      speedViolationsmodel.count().exec(),
      restrictedZone.count().exec()
    ]).then(function(counts) {
      console.log(counts)
      res.render("index.ejs",{counts});
    });
});

app.get('/addZone', function(req,res){
  res.render("addZone.ejs");
});

app.post('/add', function(req,res){
  console.log(req.body);
  let newZone = new restrictedZone({
    _id: new ObjectID(),
    name: req.body.zoneName,
    type: req.body.zoneType,
    coordinates: JSON.parse(req.body.coordinates)
  });

  newZone.save().then(()=>{
    res.send("SUCESSYULLY added new zone");
  })
  .catch((err)=>{
    if(err.code===11000)
      return res.send('UNSUCESSFUL. Zone with the same name already exist');
    res.send('UNSUCESSFUL in adding zone. Please try again');
  })
});

app.get('/viewZone', function(req,res){
  restrictedZone.find((err,data)=>{
    if(err) return console.log(err);
    let pointsArray=[]; let namesArray=[]; let typesArray=[];
    data.forEach((item)=>{
      namesArray.push(item.name);
      typesArray.push(item.type);
      let u=[];
      item.coordinates.map((points)=>{
        try {
          u.push(points.reverse());
        } catch (error) {
          //nothing inside
        }
      })
      pointsArray.push(u);
    });
    res.render("viewZone.ejs",{namesArray,pointsArray,typesArray});
  });
});

app.post('/delete', function(req,res){
  restrictedZone.deleteOne().where('name').equals(req.body.zoneName).exec((err,data)=>{
    if(err) return res.send(err)
    return res.send('SUCESSFULL deletion');
  });
});

app.get('/addEntryExit', function(req,res){
  res.render("addEntryExit.ejs");
});

app.post('/addPoints', function(req,res){
  console.log(req.body);
  var point1=JSON.parse(req.body.Point1);
  var point2=JSON.parse(req.body.Point2);

  entryExitPoints.findOneAndUpdate({_id:"5f5d2dbc987b7b0a202583d9"}, 
    { 
      entryPointName:req.body.Point1Name,
      exitPointName: req.body.Point2Name,
      entryPointLat:point1[1],
      entryPointLng:point1[0],
      exitPointLat:point2[1],
      exitPointLng:point2[0]},
      {upsert: true},
      (err, data) => {
      if (err)
        return res.send("Error occured while adding Points");
      entryExitPoints.findOneAndUpdate({_id:"5f5d2dbc987b7b0a202583d8"}, 
        { 
          entryPointName:req.body.Point2Name,
          exitPointName: req.body.Point1Name,
          entryPointLat:point2[1],
          entryPointLng:point2[0],
          exitPointLat:point1[1],
          exitPointLng:point1[0]},
          {upsert: true},
          (err, data) => {
          if (err)
            return res.send("Error occured while adding Points");
          return res.send("Sucessfully added Points")
        });
    });
});

app.get('/speedViolation', function(req,res){
  speedViolationsmodel.find().exec((err,data)=>{
    if(err) return console.log(err);
    var dataset=data;
    res.render('speedViolation.ejs',{dataset});
  })
});

app.get('/zoneViolation', function(req,res){
  zoneViolationsmodel.find().exec((err,data)=>{
    if(err) return console.log(err);
    var dataset=data;
    res.render('zoneViolation.ejs',{dataset});
  })
});

app.get('/currentlyMoving', function(req,res){
  journeyRegistration.find().exec((err,data)=>{
    if(err) return console.log(err);
    var dataset=data;
    res.render('currentlyMoving.ejs',{dataset});
  })
});

app.get('/speedViolation/:id', function(req,res){
  speedViolationsmodel.findOne({"_id": req.params.id }, (error, result) => {
    if(error) {
        return res.send(error);
    }
    if(!result) return res.send("No data found");
    let data=result.violations;
    return res.send(data);
  });
})

app.get('/zoneViolation/:id', function(req,res){
  zoneViolationsmodel.findOne({"_id": req.params.id }, (error, result) => {
    if(error) {
        return res.send(error);
    }
    if(!result) return res.send("No data found");
    let data=result.violations;
    return res.send(data);
  });
})

app.get('/publishAlert',function(req,res){
  res.render('publishAlert.ejs');
})

app.get('/complaints',function(req,res){
  res.send("We are working on this. This section will be available soon.")
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});


// get realtime location apis

app.get('/realtimeLocation', function(req,res){
  journeyRegistration.find().select('name mob realtimeLocation _id').exec((err,data)=>{
    if(err) return console.log(err);

    var geojson = {
      "type":"FeatureCollection",
      "features":[]
    };
    
    for(index=0;index<data.length;index++){
      let geojsondata={
        "id":"",
        "type":"Feature",
        "geometry":{
            "type":"Point",
            "coordinates":[]
        },
        "properties":{
          "name":"",
          "mob":""
        }
      }
      geojsondata.id=`id${index}`;
      geojsondata.properties.name=data[index].name;
      geojsondata.properties.mob=data[index].mob;
      geojsondata.geometry.coordinates=JSON.parse(data[index].realtimeLocation).reverse();
      geojson.features.push(geojsondata);
    }
    res.send(geojson);
  })
})


app.get('/realtimeLocation/:id', function(req,res){
  journeyRegistration.findOne({"_id": req.params.id }, (error, data) => {
    if(error) {
        return res.send(error);
    }
    if(!data) return res.send("No data found");
    var geojson = {
      "type":"FeatureCollection",
      "features":[]
    };
    
      let geojsondata={
        "id":"",
        "type":"Feature",
        "geometry":{
            "type":"Point",
            "coordinates":[]
        },
        "properties":{
          "name":"",
          "mob":""
        }
      }
      geojsondata.id=`id0`;
      geojsondata.properties.name=data.name;
      geojsondata.properties.mob=data.mob;
      geojsondata.geometry.coordinates=JSON.parse(data.realtimeLocation).reverse();
      geojson.features.push(geojsondata);
    console.log("runnung")
      res.send(geojson);
  })
});