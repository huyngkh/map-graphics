import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

import Draw from 'ol/interaction/Draw.js';
import {Vector as VectorLayer} from 'ol/layer.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';

import MapBoxGL from 'mapbox-gl';
const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiaHV5dm5uIiwiYSI6ImNqazB5aHJ1YjAxemszb3J3cjFiN2l5bGEifQ.mmwjuLqUODvJzh3DsL1qiA";
const layers = [];

// Mapbox
var mapBox = new MapBoxGL.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v10'
});

// Open street map
const OpenStreetMapLayer = new TileLayer({
    source: new XYZ({
      url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    })
  });
// layers.push(OpenStreetMapLayer);

// Draw layer
var raster = new TileLayer({
    source: new OSM()
});
layers.push(raster);

var source = new VectorSource({wrapX: false});
var vector = new VectorLayer({
    source: source
 });
layers.push(vector);

// MAIN: Render the entire map
var map = new Map({
    target: 'map',
    layers: layers,
    view: new View({
        center: [-11000000, 4600000],
        zoom: 11
    })
});

var typeSelect = document.getElementById('type');
var draw; // global so we can remove it later
function addInteraction() {
    var value = typeSelect.value;
    if (value !== 'None') {
        draw = new Draw({
        source: source,
        type: typeSelect.value
        });
        map.addInteraction(draw);
    }
}

/**
 * Handle change event.
 */
typeSelect.onchange = function() {
    map.removeInteraction(draw);
    addInteraction();
};

addInteraction();