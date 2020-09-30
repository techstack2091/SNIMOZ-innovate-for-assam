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
map.addControl(drawControl);
map.on('draw:created', function (e) {
    var type = e.layerType,
        layer = e.layer;
    drawnItems.addLayer(layer);
    var shape = layer.toGeoJSON()
    var shape_for_db = JSON.stringify(shape);
    var pointArray=JSON.parse(shape_for_db).geometry.coordinates;
    document.getElementById("co").value = JSON.stringify(pointArray);
});


$("input[type='text']").on("keyup", function(){
    if($(this).val() != ""){
        $("#az").removeAttr("disabled");
    } else {
        $("#az").attr("disabled", "disabled");
    }
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