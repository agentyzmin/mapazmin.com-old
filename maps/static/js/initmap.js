/**
 * Created by yurii on 2/19/2017.
 */

function initMap() {
    map = new L.Map('mapid', {renderer: L.canvas(), maxZoom: 19 });
    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 20, attribution: osmAttrib});

    var OpenMapSurfer_Grayscale = L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roadsg/x={x}&y={y}&z={z}', {
        maxZoom: 18,
        attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    map.setView(new L.LatLng(50.450779, 30.510317), 16);
    map.addLayer(OpenMapSurfer_Grayscale);

    yardsLayerGroup = L.layerGroup([]);
    treesLayerGroup = L.layerGroup([]);
    carsLayerGroup = L.layerGroup([]);
    carsDayLayerGroup = L.layerGroup([]);
    carsNightLayerGroup = L.layerGroup([]);
    housesLayerGroup = L.layerGroup([]);
    roadsLayerGroup = L.layerGroup([]);
    firstFloorLayerGroup = L.layerGroup([]);
    facadesLayerGroup = L.layerGroup([]);
    layerGroups = [roadsLayerGroup, yardsLayerGroup, housesLayerGroup, firstFloorLayerGroup, carsLayerGroup, carsDayLayerGroup, carsNightLayerGroup, treesLayerGroup, facadesLayerGroup];
    layerNames = ["roads", "yards", "buildings", "firstFloorFunction", "cars", "carsDay", "carsNight", "trees", "facades"];

    for (var i = 0; i < layerGroups.length; i++)layerGroups[i].name = layerNames[i]

    generateStreetStatBlocks();
    loadTrees('/static/geoJSON/trees_GeoCoo.json.geojson', treesLayerGroup);
    loadCars('/static/geoJSON/cars_GeoCoo.json.geojson', carsLayerGroup);
    loadCars('/static/geoJSON/Yarvalcars_day_GeoCoo.json.geojson', carsDayLayerGroup);
    loadCars('/static/geoJSON/Yarvalcars_night_GeoCoo.json.geojson', carsNightLayerGroup);
    loadBuildings('/static/geoJSON/housesGeo.json.geojson', housesLayerGroup);
    loadRoads('/static/geoJSON/roadsGeo.json.geojson', roadsLayerGroup);
    loadYards('/static/geoJSON/yardsGeo.json.geojson', yardsLayerGroup);
    loadFirstFloorFunction('/static/geoJSON/firstFloorFunctionGeo.json.geojson', firstFloorLayerGroup);
    loadFacades('/static/geoJSON/facades.geoJSON', facadesLayerGroup);
    loadSwitches();
}

function loadTrees(url, layerGroup) {
    processGeoJson(url, function (geoJSON) {
        var geoJSONLayer = L.geoJson(geoJSON, {
            pointToLayer: function (feature, latlng) {
                return L.circle(latlng, {
                    radius: feature.properties.radius,
                    color: COLORS[layerGroup.name],
                    weight: 1,
                    opacity: 0.8,
                    fillColor: COLORS[layerGroup.name],
                    fillOpacity: 0.8,
                    zIndex: 200
                })
            },
            onEachFeature: function (feature, layer) {
                var text = "Вулиці: ";
                for (var index in layer.feature.properties.streets) {
                    text += i18n(layer.feature.properties.streets[index]) + ' ';
                }
                layer.bindPopup(text);
            }
        });
        copyLayers(geoJSONLayer, layerGroup);
        refreshMap();
    });
}
function loadCars(url, layerGroup) {
    processGeoJson(url, function (geoJSON) {
        var geoJSONlayer = L.geoJSON(geoJSON, {
            color: COLORS[layerGroup.name],
            opacity: 1,
            weight: 1,
            fillColor: COLORS[layerGroup.name],
            fillOpacity: 1,
            smoothFactor: 1,
            onEachFeature: function (feature, layer) {
                var text = "Вулиці: ";
                for (var index in layer.feature.properties.streets) {
                    text += i18n(layer.feature.properties.streets[index]) + ' ';
                }
                layer.bindPopup(text);
            }
        });
        copyLayers(geoJSONlayer, layerGroup);
        loadCarsPerPopulation();
        refreshMap();
    });
}
function loadBuildings(url, layerGroup) {
    processGeoJson(url, function (geoJSON) {
        var geoJSONlayer = L.geoJSON(geoJSON, {
            color: '#AAB3BE',
            opacity: 1,
            weight: 1,
            fillColor: COLORS[layerGroup.name],
            fillOpacity: 0.8,
            smoothFactor: 1
        });
        geoJSONlayer.eachLayer(function (layer) {
            var text = "Вулиці: ";
            for (var index in layer.feature.properties.streets) {
                text += i18n(layer.feature.properties.streets[index]) + ' ';
            }
            text += "   Площа: " + layer.feature.properties.area.toFixed(2);
            layer.bindPopup(text);
            layer.on('dblclick', function (e) {
                var a = "[";
                for (var i = 1; i < this._latlngs[0].length; i++) {
                    a += '[' + this._latlngs[0][i - 1].lat + "," + this._latlngs[0][i - 1].lng + ',' + this._latlngs[0][i].lat + "," + this._latlngs[0][i].lng + ']'
                    if (i + 1 != this._latlngs[0].length) a += ', ';
                }
                a += ']';
                console.log(a);
            })
        });
        copyLayers(geoJSONlayer, layerGroup);
        layerGroup.addTo(map);
        refreshMap()
    });
}
function loadRoads(url, layerGroup) {
    processGeoJson(url, function (geoJSON) {
        var geoJSONlayer = L.geoJSON(geoJSON, {
            color: COLORS[layerGroup.name],
            opacity: 1,
            weight: 1,
            fillColor: COLORS[layerGroup.name],
            fillOpacity: 1,
            smoothFactor: 1
        });
        copyLayers(geoJSONlayer, layerGroup);
        layerGroup.addTo(map);
        refreshMap()
    });
}
function loadYards(url, layerGroup) {
    processGeoJson(url, function (geoJSON) {
        layerGroup.categories = ["open", "hard_to_reach", "unreachable"];
        layerGroup.layers = {};
        var geoJSONlayer = L.geoJSON(geoJSON, {
            style: function (feature) {
                var functionColor;
                if (typeof COLORS[feature.properties.category] != 'undefined') {
                    functionColor = COLORS[feature.properties.category]
                }
                else {
                    functionColor = "#000000"
                }

                return {
                    color: functionColor,
                    opacity: 0.8,
                    weight: 1,
                    fillColor: functionColor,
                    fillOpacity: 0.8,
                    smoothFactor: 1
                }
            },
            onEachFeature: function (feature, layer) {
                if (typeof layerGroup.layers[feature.properties.category] === 'undefined') {
                    layerGroup.layers[feature.properties.category] = L.layerGroup([]);
                    layerGroups.splice(layerGroups.indexOf(layerGroup) + 1, 0, layerGroup.layers[feature.properties.category]);
                    layerGroup.layers[feature.properties.category].name = feature.properties.category
                }
                layerGroup.layers[feature.properties.category].addLayer(layer);
            }
        });
        refreshMap();
        loadSwitches();
    });
}
function loadFirstFloorFunction(url, layerGroup) {
    processGeoJson(url, function (geoJSON) {
        layerGroup.categories = ["office", "cafe", "garage", "culture", "housing", "ruin"];
        layerGroup.layers = {};
        var geoJSONlayer = L.geoJSON(geoJSON, {
            style: function (feature) {
                var functionColor;
                if (COLORS[feature.properties.category] != undefined) {
                    functionColor = COLORS[feature.properties.category];
                }
                else {
                    functionColor = '#000000'
                }
                return {
                    color: functionColor,
                    opacity: 0.8,
                    weight: 1,
                    fillColor: functionColor,
                    fillOpacity: 0.8,
                    smoothFactor: 1
                }
            },
            onEachFeature: function (feature, layer) {
                if (typeof layerGroup.layers[feature.properties.category] === 'undefined') {
                    layerGroup.layers[feature.properties.category] = L.layerGroup([]);
                    layerGroups.splice(layerGroups.indexOf(layerGroup) + 1, 0, layerGroup.layers[feature.properties.category]);
                    layerGroup.layers[feature.properties.category].name = feature.properties.category;
                }
                layerGroup.layers[feature.properties.category].addLayer(layer);
                var text = "Вулиці: ";
                for (var index in layer.feature.properties.streets) {
                    text += ' ' + i18n(layer.feature.properties.streets[index]) + ((layer.feature.properties.streets.length - index > 1) ? ',' : '; ');
                }
                text += "Фасади: ";
                for (var street in layer.feature.properties.facades) {
                    text += ' ' + i18n(street) + ': ' + layer.feature.properties.facades[street] + ';'
                }
                text += "   Площа: " + layer.feature.properties.area.toFixed(2);
                layer.bindPopup(text);
                layer.on('click', function (e) {
                    console.log(layer.feature.geometry.coordinates[0])
                })
            }
        });
        drawFirstFloorFunctionCharts();
        drawTreesCharts();
        refreshMap();
        loadSwitches();
    });
}
function loadFacades(url, layerGroup) {
    processGeoJson(url, function (geoJSON) {
        var geoJSONlayer = L.geoJSON(geoJSON, {
            style: function (feature) {
                var functionColor;
                if (COLORS[feature.properties.category] != undefined) functionColor = COLORS[feature.properties.category];
                else functionColor = '#000000';
                return {
                    color: functionColor,
                    opacity: 1,
                    weight: 5,
                    smoothFactor: 0.5
                }
            },
            onEachFeature: function (feature, layer) {
                var text = "Вулиці: ";
                for (var index in layer.feature.properties.streets) {
                    text += ' ' + i18n(layer.feature.properties.streets[index]) + ((layer.feature.properties.streets.length - index > 1) ? ',' : '');
                }
                text += "   Довжина: " + layer.feature.properties.length.toFixed(2);
                text += "   Категорія: " + i18n(layer.feature.properties.category);
                layer.bindPopup(text);
                layer.options.lineCap = 'butt';
                layer.options.lineJoin = 'butt'
            }
        });
        copyLayers(geoJSONlayer, layerGroup);
        layerGroup.addTo(map);
        drawFacadeCharts();
        refreshMap();
        loadSwitches();
    });
}
function copyLayers(originLayerGroup, targetLayerGroup){
    targetLayerGroup.clearLayers();
    originLayerGroup.eachLayer(function (layer) {
        targetLayerGroup.addLayer(layer)
    })
}

function processGeoJson(src, processor) {
    var client = new XMLHttpRequest();
    client.open('GET', src);
    client.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            try {
                var geoJSON = JSON.parse(this.responseText);
            } catch (err) {
            } finally {
                processor(geoJSON);
            }
        }
    };
    client.send()
}

