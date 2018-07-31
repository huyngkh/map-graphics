import React, {Component} from 'react';

import _ol, {Map, View, Projection, Collection} from 'ol';
import {XYZ, TileImage} from 'ol/source';
import {Zoom, Rotate, Attribution, ZoomSlider, MousePosition, ScaleLine, OverviewMap} from 'ol/control';
import {Polygon} from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import {Sphere} from 'ol/sphere.js';
import Draw from 'ol/interaction/Draw.js';
import {MVT, GeoJSON} from 'ol/format';
import {Vector as VectorLayer} from 'ol/layer.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {fromLonLat} from 'ol/proj.js';
import {transform} from 'ol/proj.js';
import {createXYZ} from 'ol/tilegrid.js';

const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiaHV5dm5uIiwiYSI6ImNqazB5aHJ1YjAxemszb3J3cjFiN2l5bGEifQ.mmwjuLqUODvJzh3DsL1qiA";

class MapViewPort extends Component {
    constructor(props) {
        super(props);

        this.state = {
            map: null,
            view: null,
            baseLayer: null
        };
    }

    render() {
        return <div id="map" className="map" />;
    }

    componentDidMount() {
        var chicago = [-87.61694, 41.86625];
        var sanjose = [-121.9236057, 37.261241];

        console.log(JSON.stringify(fromLonLat(sanjose)));
        var mapManager = this.createMap('map', sanjose, 18, 23);
        this.initMap(mapManager);
        this.setState(mapManager);
    }

    // MAIN: Render the entire map
    createMap(target, latLonArray, zoomLevel, maxZoom){
        const view = new View({
            // center: Projection.fromLonLat([-87.61694, 41.86625]),
            center: transform(latLonArray, 'EPSG:4326', 'EPSG:3857'), //fromLonLat(latLonArray),
            zoom: zoomLevel,
            maxZoom: maxZoom
        });
        const map = new Map({
            target: target,
            //Define the default controls
            controls: [
                new Zoom(),
                new Rotate(),
                new Attribution(),
                new ZoomSlider(),
                new ScaleLine(),
                new OverviewMap()
            ],
            view
        });

        return {map, view};
    }

    createBaseLayer() {
        // Layer: internal OpenStreetMap
        var raster = new TileLayer({
            source: new OSM()
        });

        return raster;
    }
    // edit, pick, delete obje
    showBaseLayer(mapManager, isVisible = true) {
        if (!this.state.baseLayer) {
            var raster = this.createBaseLayer();
            mapManager.map.addLayer(raster);
            this.setState({
                map: this.state.map,
                view: this.state.view,
                baseLayer: raster
            });
        } else {
            this.state.baseLayer.setVisibility(isVisible);
        }
    }

    moveViewport(view, newLatLon, duration = 2000) {
        view.animate({
            center: fromLonLat(newLatLon),
            duration
        });
    }

    changeView(mapManager, newView) {
        mapManager.map.setView(newView);
    }

    initMap(mapManager) {
        const layers = [];
        // Layer: Open street map
        const openStreetMapLayer = new TileLayer({
            source: new XYZ({
                url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            })
        });
        // mapManager.map.addLayer(openStreetMapLayer);

        // Add base layer
        this.showBaseLayer(mapManager);

        // Layer: A custom map (TMS with XYZ source)
        const aMapLayer = new TileLayer({
            // style: simpleStyle,
            source: new TileImage({
                tilePixelRatio: 1,
                tileGrid: createXYZ({maxZoom: 19}),
                format: new MVT(),
                url: 'http://ec2-52-27-92-51.us-west-2.compute.amazonaws.com:5002/{z}/{x}/{-y}.png'
            })
        });
        mapManager.map.addLayer(aMapLayer);
    
        // https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=<your access token here>'
        // Layer: Mapbox
        const mapbox = new TileLayer({
            source: new XYZ({
                url: 'https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=' + MAPBOX_ACCESS_TOKEN
            })
        });
        // mapManager.map.addLayer(mapbox);
    
        // Layer: Drawing tool
        var source = new VectorSource({wrapX: false});
        var vector = new VectorLayer({
            source: source
        });
        mapManager.map.addLayer(vector);
    
        var typeSelect = document.getElementById('type');
        var data = [];
        var draw; // global so we can remove it later

        function addInteraction() {
            var value = typeSelect.value;
            if (value !== 'None') {
                draw = new Draw({
                    source: source,
                    type: typeSelect.value
                });
                draw.on('drawend', function( evt ){
                    var geometry = evt.feature.getGeometry();
                    if (value === 'Circle') {
                        var radius = geometry.getRadius();
                        var center = geometry.getCenter();
                        // .... your code
                        data.push([radius, center]);
                    } else {
                        var coords = geometry.getCoordinates();
                        data.push(coords);
                    }                    
                });
                mapManager.map.addInteraction(draw);
            }
        }

        /** Handle change event.**/
        typeSelect.onchange = function() {
            mapManager.map.removeInteraction(draw);
            addInteraction();
        };

        /** Handle Draw button event **/
        document.getElementById('btn-draw').onclick = () => {
            mapManager.map.removeInteraction(draw);
            addInteraction();
        }

        /** Handle Move button event **/
        document.getElementById('btn-move').onclick = () => {
            this.moveViewport(mapManager.view, [-87.61694, 41.86625], 2000);
        }

        /** Handle Save  button event **/
        document.getElementById('btn-save').onclick = () => {
            // Get the array of features
            var features = vector.getSource().getFeatures();
            
            var writer = new GeoJSON();
            var geojsonStr = writer.writeFeatures(vector.getSource().getFeatures());

            // Go through this array and get coordinates of their geometry.
            features.forEach(function(feature) {
                console.log(feature.getGeometry().getCoordinates());
            });

            // Special
            console.log(data);
            alert('Saved. Please check console log for details.');
        }
    }
}

export default MapViewPort;