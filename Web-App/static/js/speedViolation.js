$(function(){

  var dataSet = [];
  var pro = new Promise((resolve, reject) => {
    dataset.forEach((item, index, array) => {
        dataSet.push([item.name,item.mob,item.vehicleReg,item.vehicleType,item.time,item.violations.length,
          `<form id=${item._id} onsubmit="mapfunction()"><input name="id" type="text" value=${item._id} style="display: none;"/><input type="submit" name="button" value="view in map" class="map-btn" style="background-color:#4e73df;!important"/></form>`
          ,item._id]);
        if (index === array.length -1) resolve();
    });
  });

  pro.then(() => {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();  
    $("#lastupdated").html(`Last updated on: ${time}`)
    $('#dataTable').DataTable({data: dataSet,destroy: true,dom: 'lBfrtip',buttons: ['excelHtml5']});
    $('#dataTable').DataTable({data: dataSet,destroy: true,dom: 'lBfrtip',buttons: ['excelHtml5']});
  });

});

var map = L.map('map');

function mapfunction() {
  event.preventDefault(); // prevents the form from reloading the page
  const form = event.currentTarget;
  var modal = document.getElementById("myModal");
  var span = document.getElementsByClassName("map-close")[0];
  modal.style.display = "block";
  span.onclick = function() {
  modal.style.display = "none";
  }
  var redIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
 
  map.setView([10.8505,76.2711],8);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  fetch(`https://snimoz.herokuapp.com/speedViolation/${form.id.value}`)
    .then(response => response.json())
    .then(data => {
      $("#vcount").html(data.length);
      for(i=0;i<data.length;i++){
        points=JSON.parse(data[i][1]);
        L.marker([points[0],points[1]],{icon:redIcon}).addTo(map).bindPopup(data[i][0]).openPopup();
      }
    })
    .catch((err)=>{console.log(err)})

}



