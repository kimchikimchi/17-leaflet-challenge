/*
    Create a map using Leaflet that plots all of the earthquakes from your data set based on their longitude and latitude.
*/



// Create tile layer
const lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: 'light-v10',
    accessToken: API_KEY
});

const layerGroup = L.layerGroup();

// Define a map object
const myMap = L.map('map', {
    center: [37, -100],
    zoom: 5,
    layers: [lightMap, layerGroup]
});


const json_url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';


const chooseColor = function (num) {
    // Make sure num is a number;
    num = +num;
    let color;
    switch (true) {
        case num >= 90:
            color = 'red';
            break;
        case num >= 70:
            color = 'orange';
            break;
        case num >= 50:
            color = 'lightsalmon';
            break;
        case num >= 30:
            color = 'yellow';
            break;
        case num >= 10:
            color = 'lightgreen';
            break;
        default:
            color = 'yellowgreen';
    }

    return color;
};

// Get earthquake data JSON from USGS site.
d3.json(json_url, quakeData => {
    // Creating a geoJSON layer with the retrieved data
    // Earthquakes with higher magnitudes should appear larger and earthquakes with greater depth should appear darker in color.

    // See https://leafletjs.com/examples/geojson/ for geoJson option details 
    // console.log(quakeData);

    L.geoJson(quakeData, { 
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius:  feature.properties.mag * 4,        
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                color: 'black',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        // Include popups that provide additional information about the earthquake when a marker is clicked.
        onEachFeature: function(feature, layer) {
            const place = feature.properties.place;
            const magnitude = feature.properties.mag;
            const longitude = feature.geometry.coordinates[0].toPrecision(4);
            const latitude = feature.geometry.coordinates[1].toPrecision(4);
            const depth = feature.geometry.coordinates[2].toPrecision(3);
            layer.bindPopup(`${place}<hr><b>Magnitude: ${magnitude}</b><br>Lon: ${longitude}<br>Lat: ${latitude}<br>Depth: ${depth}`);
        }
    }).addTo(layerGroup);
    // Add the earthquake layer
    layerGroup.addTo(myMap);

    // Create a legend that will provide context for your map data
    const legend = L.control({position: 'bottomright'});

    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");

        const depth = [-10, 10, 30, 50, 70, 90];
        div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"
        for (var i =0; i < depth.length; i++) {
            div.innerHTML += 
            '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' +
             depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
        return div;
    };

    legend.addTo(myMap);
});
