var map = L.map('map').locate({setView: true, maxZoom: 16});
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
var drawControl = new L.Control.Draw({
    position:"topright",
    edit: {
        featureGroup: drawnItems
    }
});
var flag=0;
map.addControl(drawControl);
map.on('draw:created', function (e) {
    var type = e.layerType,
        layer = e.layer;
    drawnItems.addLayer(layer);
    var shape = layer.toGeoJSON()
    var shape_for_db = JSON.stringify(shape);
    var pointArray=JSON.parse(shape_for_db).geometry.coordinates;
    if(flag%2==0)
        document.getElementById("co1").value = JSON.stringify(pointArray);
    else
        {document.getElementById("co2").value = JSON.stringify(pointArray); }
    flag++;  
});


function func(){
    event.preventDefault();
    var form=$("#mapform");
    $.ajax({
      type: 'POST',
      url: form.attr('action'),
      data:form.serialize(),
    })
    .done(function(data){
      alert(data);
      // window.location.reload();
    })
    .fail(function(err){
    alert("Error occured while connecting to database");
  })
}

$("input[type='text']").on("keyup", function(){
  if($("#co3").val() != "" && $("#co4").val() != "" && $("#co1").val() != "" && $("#co2").val() != ""){
      $("#submitpoints").removeAttr("disabled");
  } else {
      $("#submitpoints").attr("disabled", "disabled");
  }
});