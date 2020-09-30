$(function(){

    var dataSet = [];
    var pro = new Promise((resolve, reject) => {
      dataset.forEach((item, index, array) => {
          dataSet.push([item.name,item.mob,item.vehicleReg,item.vehicleType,item.time,
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
    });
  
});
  
  
function mapfunction() {
    event.preventDefault(); // prevents the form from reloading the page
    const form = event.currentTarget;
    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("map-close")[0];
    modal.style.display = "block";
    span.onclick = function() {
    modal.style.display = "none";
    
    }
   
    var map = L.map('map').locate({setView: true, zoom:16});

    var greenIcon = new L.Icon({
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    var realtime = L.realtime({
            url: `https://snimoz.herokuapp.com/realtimeLocation/${form.id.value}`,
            crossOrigin: true,
            type: 'json'
        }, {
            interval: 3 * 1000,
            getFeatureId: function(feature) {
                // required for L.Realtime to track which feature is which
                // over consecutive data requests.
                return feature.id;
            }
            ,
            pointToLayer: function(feature, latlng) {
                // style the aeroplane loction markers with L.DivIcons
                var marker = L.marker(latlng, {
                    icon: greenIcon,
                    riseOnHover: true
                }).bindPopup(
                    // and as we're already here, bind a tooltip based on feature
                    // property values
                    
                    `<b>Name: ${feature.properties.name}<br>Mob: ${feature.properties.mob}`,

                    {permanent: false, opacity: 0.7}
                );
                return marker;
            }

        }).addTo(map);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}
  
  
  
  