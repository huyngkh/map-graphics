import React, {Component} from 'react';

import {Map, View} from 'ol';
import {XYZ, TileImage} from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import Draw from 'ol/interaction/Draw.js';
import {Zoom, Rotate, Attribution, ZoomSlider, MousePosition, ScaleLine, OverviewMap} from 'ol/control';
import {MVT} from 'ol/format';
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
            view: null
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
    }

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
        mapManager.map.addLayer(openStreetMapLayer);

        // Layer: A custom map
        // const aMapLayer = new TileLayer({
        //     source: new XYZ({
        //         url: 'http://ec2-52-27-92-51.us-west-2.compute.amazonaws.com:5002/{z}/{x}/{y}.png'
        //     })
        // });
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
    
        // Layer: internal OpenStreetMap
        var raster = new TileLayer({
            source: new OSM()
        });
        // mapManager.map.addLayer(raster);
    
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
    
        // MAIN: Render the entire map
        var typeSelect = document.getElementById('type');
        var draw; // global so we can remove it later
        function addInteraction() {
            var value = typeSelect.value;
            if (value !== 'None') {
                draw = new Draw({
                source: source,
                type: typeSelect.value
                });
                mapManager.map.addInteraction(draw);
            }
        }
    
        /**
         * Handle change event.
         */
        typeSelect.onchange = function() {
            mapManager.map.removeInteraction(draw);
            addInteraction();
        };
        addInteraction();

        /**
         * Handle Draw button event
         */
        document.getElementById('btn-draw').onclick = () => {
            this.moveViewport(mapManager.view, [-121.9236057, 37.261241], 2000);
        }

        /**
         * Handle Move button event
         */
        document.getElementById('btn-draw').onclick = () => {
            this.moveViewport(mapManager.view, [-121.9236057, 37.261241], 2000);
        }
    }
}

export default MapViewPort;