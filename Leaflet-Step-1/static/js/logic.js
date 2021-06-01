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

/*
 Your data markers should reflect the magnitude of the earthquake by their size and and depth of the earth quake by color. Earthquakes with higher magnitudes should appear larger and earthquakes with greater depth should appear darker in color.
    HINT the depth of the earth can be found as the third coordinate for each earthquake.
    Include popups that provide additional information about the earthquake when a marker is clicked.
    Create a legend that will provide context for your map data.
*/

// Get earthquake data JSON from USGS site.
d3.json(json_url, quakedata => {

    // Creating a geoJSON layer with the retrieved data
    // Earthquakes with higher magnitudes should appear larger and earthquakes with greater depth should appear darker in color.
    L.geoJson(quakedata, feature => { 
        style: feature => {
            return {
                color: "white",      
                fillColor: "pink",  // dynamically set color based on depth
                fillOpacity: 0.5,
                weight: 10.0
            };
        }
    }).addTo(myMap);
});
