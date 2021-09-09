//Basemap - Center point is South Korea
var map = L.map('mymap', {
    center: [36.2085086,127.6936944],//South Korea
    zoom: 8//16
});

//Tile layer - Carto
L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    attribution: '@ <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
    minZoom: 4
}).addTo(map);

//Add color - netural break
function getColor(value) {
    return value > 81.5 ? '#b30000':
            value > 70.9  ? '#e34a33':
            value > 61.2  ? '#fc8d59':
            value > 51.5  ? '#fdcc8a':
                        '#fef0d9';
}

//Set style--start
function setStyle(feature){
    return {
        fillColor: getColor(feature.properties.HWD),
        weight: 1,
        opacity: 1,
        color: 'gray',
        fillOpacity: 0.9
    };
}
//Set style--end

//Add mouseover effects--start
function highlightFeature(e) {
    // Get access to the feature that was hovered through e.target
    var feature = e.target;

    // Set a thick grey border on the feature as mouseover effect
    // Adjust the values below to change the highlighting styles of features on mouseover
    // Check out https://leafletjs.com/reference-1.3.4.html#path for more options for changing style
    feature.setStyle({
        weight: 4,
        color: '#666',
        fillOpacity: 0.7
    });

    // Bring the highlighted feature to front so that the border doesn’t clash with nearby states
    // But not for IE, Opera or Edge, since they have problems doing bringToFront on mouseover
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        feature.bringToFront();
    }
}
var geojson; // define a variable to make the geojson layer accessible for the funtion to use   
    
function setOnEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature, // Do what defined by the highlightFeature function on mouseover
        mouseout: resetHighlight,    // Do what defined by the resetHighlight function on mouseout
    });
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
}
//Add mouseover effects--end

//GeoJSON layer - South Korea--start
geojson = L.geoJsgeojson = L.geoJson(data, {
    style:setStyle,
    onEachFeature: setOnEachFeature
}).bindPopup(function (layer){
    return layer.feature.properties.adminNam 
        + '<p style="color:purple">' + layer.feature.properties.HWD.toString() + ' (day) </p>';       
}).addTo(map);
//GeoJSON layer - South Korea--end

//Setting legend--start
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'legend'),
        grades = [35.8, 51.5, 61.2, 70.9, 81.5]; 

    div.innerHTML = '<b>RCP 8.5 <br> Heat Wave Days <br> 2100 <br></b>';

    // Loop through our the classes and generate a label with a color box for each interval.
    // If you are creating a choropleth map, you DO NOT need to change lines below.
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
        '<i style="background:' + getColor(grades[i] + 1) + '"></i>' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);
//Setting legend--end