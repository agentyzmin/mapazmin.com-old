var map;
var layerGroups;
var areaDataCharts;
// var dataset;
var pieChart, barChart, hbarChart;
var streetCharts = {};
var fffCharts = {};

var AREA_DIVISOR = 0;
var POPULATION = 9000;
var COLORS = {
    "roads": '#6D6D6D',
    "yards": '#fcde60', //not shown on a map
    "buildings": '#C9CFD2',
    "firstFloorFunction": "#9463C2",//not shown on a map
    "cars": '#242424',
    "carsDay": '#242424',
    "carsNight": '#242424',
    "trees": '#91C497',
    "hard_to_reach": '#898989',
    "open": '#fcde60',
    "unreachable": '#666666',
    "office": '#9463C2',
    "cafe": '#FD6E70',
    "garage": '#AAAAAA',
    "culture": '#4390FC',
    "housing": '#FFF6CF',
    "ruin": '#565656',
    'tolerable': '#84B7E3',
    'inactive': '#F06251',
    'monument': '#A082A3',
    'dopey': '#EDA156',
    'hole': '#E2E2E2',
    'active': '#0990C6',
    'green': '#478456',
    'nothing': '#EFD8B8'

};
var STREETS = ['Striletska', 'Franka', 'Zolotovoritska', 'Reitarska', 'Kotsiubynskoho', 'Stritenska', 'Honchara', 'Velyka_Zhytomyrska', 'Khmelnytskogo', 'Rylskyi_prov', 'Volodymyrska', 'Lysenka', 'Yaroslaviv_Val', 'Lypynskoho', 'Heorhiivskyi'];

// creates a map, loads data, defines switch behaviour
initMap();
function initMap() {
    // set up the map
    map = new L.Map('mapid', {
        renderer: L.canvas(),
        maxZoom: 19
    });
    // create the tile layer with correct attribution
    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 20, attribution: osmAttrib});
    //    map.addLayer(osm);

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
    layerGroups = [roadsLayerGroup, yardsLayerGroup, housesLayerGroup, firstFloorLayerGroup, carsLayerGroup, carsDayLayerGroup, carsNightLayerGroup, treesLayerGroup, facadesLayerGroup]; // from bottom to top
    layerNames = ["roads", "yards", "buildings", "firstFloorFunction", "cars", "carsDay", "carsNight", "trees", "facades"];

    for (var i = 0; i < layerGroups.length; i++)layerGroups[i].name = layerNames[i]

    // loads geoJSON and applies processor function over it
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

    // trees block start

    processGeoJson('/static/geoJSON/trees_GeoCoo.json.geojson', function (geoJSON) {
        var geoJSONLayer = L.geoJson(geoJSON, {
            pointToLayer: function (feature, latlng) {
                return L.circle(latlng, {
                    radius: feature.properties.radius,
                    color: COLORS[treesLayerGroup.name],
                    weight: 1,
                    opacity: 0.8,
                    fillColor: COLORS[treesLayerGroup.name],
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
        treesLayerGroup.addLayer(geoJSONLayer);
        refreshMap();
    });
    // trees block end

    // cars block start
    processGeoJson('/static/geoJSON/cars_GeoCoo.json.geojson', function (geoJSON) {
        var geoJSONlayer = L.geoJSON(geoJSON, {
            color: COLORS[carsLayerGroup.name],
            opacity: 1,
            weight: 1,
            fillColor: COLORS[carsLayerGroup.name],
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
        carsLayerGroup.addLayer(geoJSONlayer);
        refreshMap()
    });
    // cars block end

    // cars day block start
    processGeoJson('/static/geoJSON/Yarvalcars_day_GeoCoo.json.geojson', function (geoJSON) {
        var geoJSONlayer = L.geoJSON(geoJSON, {
            color: COLORS[carsDayLayerGroup.name],
            opacity: 1,
            weight: 1,
            fillColor: COLORS[carsDayLayerGroup.name],
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
        carsDayLayerGroup.addLayer(geoJSONlayer);
        refreshMap()
    });
    // cars day block end

    // cars night block start

    processGeoJson('/static/geoJSON/Yarvalcars_night_GeoCoo.json.geojson', function (geoJSON) {
        var geoJSONlayer = L.geoJSON(geoJSON, {
            color: COLORS[carsNightLayerGroup.name],
            opacity: 1,
            weight: 1,
            fillColor: COLORS[carsNightLayerGroup.name],
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
        carsNightLayerGroup.addLayer(geoJSONlayer);
        refreshMap()
    });
    // cars night block end

    // houses block start
    processGeoJson('/static/geoJSON/housesGeo.json.geojson', function (geoJSON) {
        var geoJSONlayer = L.geoJSON(geoJSON, {
            color: '#AAB3BE',
            opacity: 1,
            weight: 1,
            fillColor: COLORS[housesLayerGroup.name],
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
        housesLayerGroup.addLayer(geoJSONlayer).addTo(map);
        refreshMap()
    });
    // houses block end

    // roads block start
    processGeoJson('/static/geoJSON/roadsGeo.json.geojson', function (geoJSON) {
        var geoJSONlayer = L.geoJSON(geoJSON, {
            color: COLORS[roadsLayerGroup.name],
            opacity: 1,
            weight: 1,
            fillColor: COLORS[roadsLayerGroup.name],
            fillOpacity: 1,
            smoothFactor: 1,
            onEachFeature: function (feature, layer) {
                // layer.bindPopup("Coos: " + layer._latlngs.toString() + "   Площа: " + layer.feature.properties.area.toString());
            }
        });
        roadsLayerGroup.addLayer(geoJSONlayer).addTo(map);
        refreshMap()
    });
    // roads block end

    // yards block start

    processGeoJson('/static/geoJSON/yardsGeo.json.geojson', function (geoJSON) {
        yardsLayerGroup.categories = ["open", "hard_to_reach", "unreachable"];
        yardsLayerGroup.layers = {};
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
                if (typeof yardsLayerGroup.layers[feature.properties.category] === 'undefined') {
                    yardsLayerGroup.layers[feature.properties.category] = L.layerGroup([]);
                    layerGroups.splice(layerGroups.indexOf(yardsLayerGroup) + 1, 0, yardsLayerGroup.layers[feature.properties.category]);
                    yardsLayerGroup.layers[feature.properties.category].name = feature.properties.category
                }
                yardsLayerGroup.layers[feature.properties.category].addLayer(layer);
            }
        });
        // yardsLayerGroup.addLayer(geoJSONlayer);
        refreshMap();
        loadSwitches();
    });

    // yards block end

    // first floor block start

    processGeoJson('/static/geoJSON/firstFloorFunctionGeo.json.geojson', function (geoJSON) {
        firstFloorLayerGroup.categories = ["office", "cafe", "garage", "culture", "housing", "ruin"];
        firstFloorLayerGroup.layers = {};
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
                if (typeof firstFloorLayerGroup.layers[feature.properties.category] === 'undefined') {
                    firstFloorLayerGroup.layers[feature.properties.category] = L.layerGroup([]);
                    layerGroups.splice(layerGroups.indexOf(firstFloorLayerGroup) + 1, 0, firstFloorLayerGroup.layers[feature.properties.category]);
                    firstFloorLayerGroup.layers[feature.properties.category].name = feature.properties.category;
                }
                firstFloorLayerGroup.layers[feature.properties.category].addLayer(layer);
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
        // firstFloorLayerGroup.addLayer(geoJSONlayer);
        drawFirstFloorFunctionCharts();
        refreshMap();
        loadSwitches();
    });

    // first floor block end

    // active facades block start

    processGeoJson('/static/geoJSON/facades.geoJSON', function (geoJSON) {
        // facadesLayerGroup.categories = ['tolerable', 'inactive', 'monument', 'dopey', 'hole', 'active', 'green', 'nothing']
        // facadesLayerGroup.layers = {};
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
                // layer.bindPopup("Category: " + layer.feature.properties.category + ", STREETS:" + layer.feature.properties.STREETS + ' length: ' + layer.feature.properties.length);
                layer.options.lineCap = 'butt';
                layer.options.lineJoin = 'butt'
            }
        });
        // facadesLayerGroup.addLayer(geoJSONlayer).addTo(map);
        facadesLayerGroup._layers = geoJSONlayer._layers;
        facadesLayerGroup.addTo(map);
        drawFacadeCharts();
        refreshMap();
        loadSwitches();

    });

    // active facades block end

    // defines switch behaviour(turning layerGroups on and off)
    function layerSwitcher(element, layer) {  // element - checkbox, layer - corresponding layer
        //console.log(element);
        //console.log(layer);
        if (typeof layer === 'undefined') return;
        // if (typeof layer.categories === 'undefined') { // if this is a layer without subcategories

        if (element.checked) {
            if (!map.hasLayer(layer)) {
                //console.log(layer)
                map.addLayer(layer);
                refreshMap()
            }
        }
        else {
            if (map.hasLayer(layer)) {
                map.removeLayer(layer);
                refreshMap()
            }
        }
        // }
        //if there are categories of this layer, we simply go through them
        if (typeof layer.categories != 'undefined') {
            for (var i = 0; i < layer.categories.length; i++) {
                document.getElementById(layer.categories[i] + "Switch").checked = element.checked;
                document.getElementById(layer.categories[i] + "Switch").onchange();
            }
        }
    }

    function switchConstructor(j, currSwitchINPUT) {
        return function () {
            layerSwitcher(currSwitchINPUT, layerGroups[j]);
        }
    }

    function loadSwitches() {
        var wrapper = document.getElementById("switchContainer");
        wrapper.innerHTML = "";
        for (var i = 0; i < layerGroups.length; i++) {
            var currSwitchDIV = document.createElement('div');
            currSwitchDIV.style.display = 'inline-block';
            currSwitchDIV.id = layerGroups[i].name + "SwitchContainer";
            currSwitchDIV.innerHTML = "<label><input type='checkbox'>  " + i18n(layerGroups[i].name) + " </label>  ";
            var currSwitchINPUT = currSwitchDIV.childNodes[0].childNodes[0];
            currSwitchINPUT.id = layerGroups[i].name + "Switch";
            currSwitchINPUT.onchange = switchConstructor(i, currSwitchINPUT);
            wrapper.appendChild(currSwitchDIV);
        }
    }

    loadSwitches();
}

// updates stats for charts based on current data
function loadStats(absoluteArea) {
    var EXCLUSIONS = ['cars', 'carsDay', 'carsNight', 'facades']; //layers which do not require area calculation
    var totalArea = 0;
    var groups = [];
    for (var i = 0; i < layerGroups.length; i++) {
        if (map.hasLayer(layerGroups[i]) && !EXCLUSIONS.includes(layerGroups[i].name)) {
            var area = layerGroupArea(layerGroups[i]);
            totalArea += area;
            layerGroups[i].area = area;
            groups.push(layerGroups[i])
        }
    }
    if (absoluteArea != 0) {
        totalArea = absoluteArea;
    }
    var data = [];
    for (var i = 0; i < groups.length; i++) {
        var currArea = (groups[i].area / totalArea * 100).toFixed(2);
        var currData = {
            name: groups[i].name,
            area: currArea
        };
        if (groups[i].categories != undefined) {
            currData['categories'] = [];
            for (var j = 0; j < groups[i].categories.length; j++) {
                currArea = layerGroupArea(layerGroupFilter(groups[i], function (layer) {
                    return layer.feature.properties.category == groups[i].categories[j]
                }));
                currArea = (currArea / totalArea * 100).toFixed(2);
                currData['categories'].push({
                        name: groups[i].categories[j],
                        area: currArea
                    }
                );
            }
        }
        data.push(currData);
    }


    return data;
}

// that's how you count area of objects on the street
// layerGroupArea(layerGroupFilter(layerGroups[5], function (layer) {
//     if (typeof layer.feature.properties.streets === 'undefined') {
//         return false;
//     }
//     return layer.feature.properties.streets.includes('Khmelnytskogo')
// }))

// update divisor from radio button
function updateDivisor(newDivisor) {
    AREA_DIVISOR = newDivisor;
    refreshMap();
}

//refresh function - implements z-index(based on layerGroups array), updates stats and builds charts
function refreshMap() {
    for (var i = 0; i < layerGroups.length; i++) {
        if (map.hasLayer(layerGroups[i])) {
            layerGroups[i].eachLayer(function (layer) {
                layer.bringToFront()
            });
            document.getElementById(layerGroups[i].name + "Switch").checked = true;
        }
        else {
            // document.getElementById(layerGroups[i].name + "Switch").checked = false;
        }
    }
    var facades_charts_block = document.getElementById('streets_block');
    if (map.hasLayer(facadesLayerGroup)) {
        facades_charts_block.style.display = 'block'
    }
    else {
        facades_charts_block.style.display = 'none'
    }
    var fff_charts_block = document.getElementById('streets_fff');
    if (map.hasLayer(firstFloorLayerGroup)) {
        fff_charts_block.style.display = 'block'
    }
    else {
        fff_charts_block.style.display = 'none'
    }

    areaDataCharts = loadStats(AREA_DIVISOR); //uncomment for charts
    loadAreabyPopulation();
    drawAreaCharts();
}

//counts area of all elements of layerGroup
function layerGroupArea(layerGroup) {
    var totalArea = 0;
    layerGroup.eachLayer(function (layer) {
        if (typeof layer.feature != "undefined") {
            // console.log(map.hasLayer(layer));
            totalArea += layer.feature.properties.area
        }
        else if (typeof layer.eachLayer != 'undefined') {
            totalArea += layerGroupArea(layer)
        }
        else {
            totalArea += 0
        }
    });
    return totalArea
}

//filters group by filter function
function layerGroupFilter(layerGroup, filter) {
    var resultGroup = L.layerGroup([]);
    layerGroup.eachLayer(function (layer) {
        if (typeof layer.eachLayer != "undefined") {
            resultGroup.addLayer(layerGroupFilter(layer, filter))
        }
        else {
            if (filter(layer)) {
                resultGroup.addLayer(layer);
            }
        }
    });
    return resultGroup
}

// draws charts via Chart.js
function drawAreaCharts() {
    if (areaDataCharts == undefined) return;

    var sortByArea = function (a, b) {
        if (Number(a.area) > Number(b.area)) return -1;
        else if (Number(a.area) < Number(b.area)) return 1;
        else return 0
    };

    var dataset = [];

    for (var i = 0; i < areaDataCharts.length; i++) {
        if (areaDataCharts[i].categories == undefined) {
            dataset.push(areaDataCharts[i]);
        }
    }
    dataset.sort(sortByArea);

    var labels = [];
    var data = [];
    var colors = [];

    for (var i = 0; i < dataset.length; i++) {
        labels.push(i18n(dataset[i].name));
        data.push(dataset[i].area);
        colors.push(COLORS[dataset[i].name])
    }

    if (typeof pieChart != 'undefined' && pieChart.data.datasets[0].data.length == data.length && pieChart.data.datasets[0].data[0] == data[0]) {
        return;
    }


    var pieData = {
        labels: labels,
        datasets: [
            {
                label: "Area allocation",
                data: data,
                backgroundColor: colors
            }
        ]
    };


    // pieChart drawing block start
    var ctxPie = document.getElementById('piechart');
    if (typeof pieChart === 'undefined') {
        pieChart = new Chart(ctxPie, {
            type: 'pie',
            data: pieData,
            options: {
                animation: {
                    animateRotate: false
                },
                legend: {
                    position: 'bottom'
                }
            }
        });
    }
    else {
        updateDataInChart(pieChart,pieData);
    }
    // pieChart drawing block end

    // barChart drawing block start
    var ctxBar = document.getElementById('barchart');
    if (typeof barChart === 'undefined') {
        barChart = new Chart(ctxBar, {
            type: 'bar',
            data: pieData,
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            min: 0
                        }
                    }]
                },
                legend: {
                    display: false
                },
                animation: {
                    // duration: 0
                }
            }
        });
    }
    else {
        updateDataInChart(barChart, pieData);
    }
    // barChart drawing block end

    // hbarChart drawing block start
    var ctxHbar = document.getElementById('hbarchart');
    if (typeof hbarChart === 'undefined') {
        hbarChart = new Chart(ctxHbar, {
            type: 'horizontalBar',
            data: pieData,
            options: {
                scales: {
                    xAxes: [{
                        ticks: {
                            min: 0
                        }
                    }]
                },
                legend: {
                    display: false
                },
                animation: {
                    // duration: 0
                }
            }
        });
    }
    else {
        updateDataInChart(hbarChart,pieData);
    }
}

// loading area by population data and putting it into DOM
function loadAreabyPopulation() {
    var areaByPopulationData = [];
    for (var i = 0; i < layerGroups.length; i++) {
        if (map.hasLayer(layerGroups[i]) && typeof layerGroups[i].area != 'undefined' && typeof layerGroups[i].categories === 'undefined') {
            areaByPopulationData.push({
                name: layerGroups[i].name,
                areaPerHuman: layerGroups[i].area / POPULATION
            })
        }
    }
    var parentElement = document.getElementById("populationData");
    parentElement.innerHTML = "";
    for (var i = 0; i < areaByPopulationData.length; i++) {
        var currElement = document.createElement("p");
        currElement.innerHTML = i18n(areaByPopulationData[i].name) + ": " + areaByPopulationData[i].areaPerHuman.toFixed(4) + " кв.м.";
        parentElement.appendChild(currElement)
    }
}

function loadFacadesByStreet() {
    var result = {};
    facadesLayerGroup.eachLayer(function (layer) {
        var category = layer.feature.properties.category;
        var streets = layer.feature.properties.streets;
        var length = layer.feature.properties.length;
        for (var index in streets) {
            var street = streets[index];
            if (STREETS.includes(street)) {
                if (typeof result[street] === 'undefined') {
                    result[street] = {}
                }
                if (typeof result[street][category] === 'undefined') {
                    result[street][category] = 0
                }
                result[street][category] += length
            }
        }
    });
    return result
}

function drawFacadeCharts() {
    var data = loadFacadesByStreet();
    var parentDIV = document.getElementById('street_charts');
    var categories = ['active', 'tolerable', 'monument', 'green',
        'nothing', 'dopey', 'inactive', 'hole'];

    var streets_by_active_length = [];
    for (var key in data) {
        var all_facades_length = 0;
        for (var category in data[key]) {
            all_facades_length += data[key][category]
        }
        var active_length = 0;
        if (typeof data[key]['active'] != 'undefined') active_length += data[key]['active'];
        if (typeof data[key]['tolerable'] != 'undefined') active_length += data[key]['tolerable'];
        streets_by_active_length.push({
            name: key,
            active_length: active_length / all_facades_length
        })
    }

    var sortByActiveLength = function (a, b) {
        if (Number(a.active_length) > Number(b.active_length)) return -1;
        else if (Number(a.active_length) < Number(b.active_length)) return 1;
        else return 0
    };

    streets_by_active_length.sort(sortByActiveLength);

    for (var index in streets_by_active_length) {
        var street = streets_by_active_length[index].name;
        var labels = [];
        var datas = [];
        var colors = [];

        var all_facades_length = 0;
        for (var category in data[street]) {
            all_facades_length += data[street][category]
        }

        for (var index in categories) {
            var category = categories[index];
            if (typeof data[street][category] != 'undefined') {
                labels.push(i18n(category) + '(%)');
                datas.push((data[street][category] / all_facades_length * 100).toFixed(2));
                colors.push(COLORS[category]);
            }
        }

        var pieData = {
            labels: labels,
            datasets: [
                {
                    label: 'Довжина',
                    data: datas,
                    backgroundColor: colors
                }
            ]
        };

        if (typeof streetCharts[street] === 'undefined') {
            var streetDIV = document.createElement('div');
            streetDIV.style.width = '400px';
            streetDIV.style.height = '300px';
            var streetHeader = document.createElement('h5');
            streetHeader.innerHTML = i18n(street);
            var pieCanvas = document.createElement('canvas');
            pieCanvas.style.width = '400px';
            pieCanvas.style.height = '300px';

            parentDIV.appendChild(streetHeader);
            parentDIV.appendChild(streetDIV);
            streetDIV.appendChild(pieCanvas);

            var pieChart = new Chart(pieCanvas, {
                type: 'pie',
                data: pieData,
                options: {
                    legend: {
                        position: 'bottom'
                    }
                }
            });
            streetCharts[street] = pieChart;
        }
        else {
            updateDataInChart(streetCharts[street],pieData);
        }
    }
}

function loadFirstFloorByStreet() {
    var result = {};
    for (var category in firstFloorLayerGroup.layers) {
        var curr_layer = firstFloorLayerGroup.layers[category];
        curr_layer.eachLayer(function (layer) {
            var facades = layer.feature.properties.facades;
            for (var street in facades) {
                if (STREETS.includes(street)) {
                    if (typeof result[street] === 'undefined') {
                        result[street] = {}
                    }
                    if (typeof result[street][category] === 'undefined') {
                        result[street][category] = 0
                    }
                    result[street][category] += facades[street]
                }
            }
        })
    }
    return result
}

function drawFirstFloorFunctionCharts() {
    var data = loadFirstFloorByStreet();
    var parentDIV = document.getElementById('streets_fff_charts');

    for (var street in data) {
        var labels = [];
        var datas = [];
        var colors = [];

        var total_length = 0;
        for (var category in data[street]) {
            total_length += data[street][category];
        }

        for (var category in data[street]) {
            labels.push(i18n(category) + '(%)')
            datas.push((data[street][category] / total_length * 100).toFixed(2))
            colors.push(COLORS[category])
        }

        var pieData = {
            labels: labels,
            datasets: [
                {
                    data: datas,
                    backgroundColor: colors
                }
            ]
        }

        if (typeof fffCharts[street] === 'undefined') {
            var streetfffDIV = document.createElement('div');
            streetfffDIV.style.width = '400px';
            streetfffDIV.style.height = '300px';
            var streetHeader = document.createElement('h5');
            streetHeader.innerHTML = i18n(street);
            var pieCanvas = document.createElement('canvas');
            pieCanvas.style.width = '400px';
            pieCanvas.style.height = '300px';

            parentDIV.appendChild(streetHeader);
            parentDIV.appendChild(streetfffDIV);
            streetfffDIV.appendChild(pieCanvas);

            fffCharts[street] = new Chart(pieCanvas, {
                type: 'pie',
                data: pieData,
                options: {
                    legend: {
                        position: 'bottom'
                    }
                }
            });
        }
        else {
            updateDataInChart(fffCharts[street], pieData)
        }
    }
}

function updateDataInChart(chart, newData) {
    var newLength = newData.datasets[0].data.length;
    var oldLength = chart.data.datasets[0].data.length;
    for (var i = 0; i < newLength; i++) {
        chart.data.datasets[0].data[i] = newData.datasets[0].data[i];
        chart.data.datasets[0].backgroundColor[i] = newData.datasets[0].backgroundColor[i];
        chart.data.labels[i] = newData.labels[i];
    }
    if (newLength < oldLength) {
        chart.data.datasets[0].data.splice(newLength, oldLength - newLength);
        chart.data.datasets[0].backgroundColor.splice(newLength, oldLength - newLength);
        chart.data.labels.splice(newLength, oldLength - newLength);
    }
    chart.update();
}

window.onerror = function (message, url, lineNumber) {
    // if (url.includes('Chart.')) return true;
};

//to human-readable interface
function i18n(string) {
    var dict = {
            "roads": 'Дороги',
            "yards": 'Подвір\'я', //not shown on a map
            "buildings": 'Будівлі',
            "firstFloorFunction": "Функція першого поверху",//not shown on a map
            "cars": 'Автомобілі',
            "carsDay": 'Автомобілі(вдень)',
            "carsNight": 'Автомобілі(вночі)',
            "trees": 'Дерева',
            "hard_to_reach": 'Важкодоступні',
            "open": 'Відкриті',
            "unreachable": 'Недосяжні',
            "office": 'Офіси',
            "cafe": 'Кафе',
            "garage": 'Гаражі',
            "culture": 'Культура',
            "housing": 'Житло',
            "ruin": 'Руїни',
            "facades": 'Фасади',
            'tolerable': 'Задовільний',
            'inactive': 'Неактивний',
            'monument': 'Пам’ятка',
            'dopey': 'Млявий',
            'hole': 'Проїзд',
            'active': 'Активний',
            'green': 'Озеленення',
            'nothing': 'Ніякий',
            'Lypynskoho': 'Липинського',
            'Volodymyrskyi': 'Володимирський',
            'Striletska': 'Стрілецька',
            'Franka': 'Івана Франка',
            'Zolotovoritska': 'Золотоворітська',
            'Reitarska': 'Рейтарська',
            'Kotsiubynskoho': 'Коцюбинського',
            'Sofiivska': 'Софіївська',
            'Stritenska': 'Стрітенська',
            'Irynynska': 'Ірининська',
            'Honchara': 'Гончара',
            'Velyka_Zhytomyrska': 'Велика Житомирська',
            'Khmelnytskogo': 'Хмельницького',
            'Rylskyi_prov': 'Рильський провулок',
            'Malopidvalna': 'Малопідвальна',
            'Prorizna': 'Прорізна',
            'Volodymyrska': 'Володимирська',
            'Lysenka': 'Лисенка',
            'Yaroslaviv_Val': 'Ярославів вал',
            'Bulvarno_Kudriavska': 'Бульварно-Кудрявська',
            'Heorhiivskyi': 'Георгіївський'
        }
        ;
    return dict[string];
}

// var marker;
//
// function loadServiceMarker() {
//     marker = L.marker([50.45752471902741, 30.505999797936283], {
//         draggable: true,
//     }).on('dblclick', function (e) {
//         console.log(e.latlng.lat + ',' + e.latlng.lng)
//     }).addTo(map);
//
// }
