$(function (){
  var map = L.map('map').locate({setView: true, maxZoom: 16});
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>contributors'
  }).addTo(map);

  for(var i=0;i<pointsArray.length;i++){
      console.log(pointsArray.length);
      let colorVal='red'
      if(typesArray[i]==='Type 2')colorVal='blue'
      else if(typesArray[i]==='Type 3')colorVal='green'
      var polygon=L.polygon(pointsArray[i],{
        color: colorVal,
        fillColor: colorVal,
        fillOpacity: 0.5,
      }).addTo(map)
      .bindPopup(namesArray[i])
      .openPopup();
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
    window.location.reload();
  })
  .fail(function(err){
  alert("Error occured while connecting to database");
})
}

$("#zn").on("keyup", function(){
  if($(this).val() != ""){
      $("#az").removeAttr("disabled");
  } else {
      $("#az").attr("disabled", "disabled");
  }
});