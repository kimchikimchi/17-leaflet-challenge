/*
    Create a map using Leaflet that plots all of the earthquakes from your data set based on their longitude and latitude.
*/

// Define a map object
const myMap = L.map('map', {
    center: [37, -100],
    zoom: 5
});


// Create tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: 'light-v10',
    accessToken: API_KEY
}).addTo(myMap);


const json_url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';


const chooseColor = function (num) {
    // Make sure num is a number;
    num = +num;
    let color;
    switch (true) {
        case (num >= 90):
            color = 'red';
            break;
        case (num >= 70):
            color = 'orange';
            break;
        case (num >= 50):
            color = 'lightsalmon';
            break;
        case (num >= 30):
            color = 'yellow';
            break;
        case (num >= 10):
            color = 'greenyellow';
        default:
            color = 'lightgreen';
    }

    return color;
};

// Get earthquake data JSON from USGS site.
d3.json(json_url, quakeData => {
    // Creating a geoJSON layer with the retrieved data
    // Earthquakes with higher magnitudes should appear larger and earthquakes with greater depth should appear darker in color.

    // See https://leafletjs.com/examples/geojson/ for geoJson option details 

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
            layer.bindPopup(`${feature.properties.title}<hr>Coord: ${feature.geometry.coordinates}`);
        }
    }).addTo(myMap);
    

    // Create a legend that will provide context for your map data
});
