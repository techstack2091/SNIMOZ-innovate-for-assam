var map = L.map('map').locate({setView: true, zoom:16});

var    realtime = L.realtime({
        url: 'https://snimoz.herokuapp.com/realtimeLocation',
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
                icon: L.divIcon({
                    className:'aeroplane-visible',
                    iconSize: [13,13]
                }),
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