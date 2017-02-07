var map;
var layerGroups;
var areaDataCharts;
var dataset;
var pieChart, barChart, hbarChart;

var AREA_DIVISOR = 0;
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
    "ruin": '#565656'
};

// creates a map, loads data, defines switch behaviour
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
    layerGroups = [roadsLayerGroup, yardsLayerGroup, housesLayerGroup, firstFloorLayerGroup, carsLayerGroup, carsDayLayerGroup, carsNightLayerGroup, treesLayerGroup]; // from bottom to top
    layerNames = ["roads", "yards", "buildings", "firstFloorFunction", "cars", "carsDay", "carsNight", "trees"];

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
            smoothFactor: 1
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
            smoothFactor: 1
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
            smoothFactor: 1
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
            // layer.bindPopup("Площа: " + layer.feature.properties.area.toString())
            layer.bindPopup("Coos: " + layer._latlngs.toString() + "   Площа: " + layer.feature.properties.area.toString())
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
                layer.bindPopup("Coos: " + layer._latlngs.toString() + "   Площа: " + layer.feature.properties.area.toString());
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
                layer.bindPopup("Coos: " + layer._latlngs[0][0].toString() + "   Площа: " + layer.feature.properties.area.toString());
            }
        });
        // firstFloorLayerGroup.addLayer(geoJSONlayer);
        refreshMap();
        loadSwitches()
    });

    // first floor block end

    // defines switch behaviour(turning layerGroups on and off)
    function layerSwitcher(element, layer) {  // element - checkbox, layer - corresponding layer
        //console.log(element);
        //console.log(layer);
        if (typeof layer === 'undefined') return;
        if (typeof layer.categories === 'undefined') { // if this is a layer without subcategories

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
        }
        //if there are categories of this layer, we simply go through them
        else {
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
            currSwitchDIV.innerHTML = "<label><input type='checkbox'>  " + layerGroups[i].name + " </label>  ";
            var currSwitchINPUT = currSwitchDIV.childNodes[0].childNodes[0];
            currSwitchINPUT.id = layerGroups[i].name + "Switch";
            currSwitchINPUT.onchange = switchConstructor(i, currSwitchINPUT);
            wrapper.appendChild(currSwitchDIV);
        }
    }

    loadSwitches();
}

initMap();


// updates stats based on current data
function loadStats(absoluteArea) {
    var totalArea = 0;
    var groups = [];
    for (var i = 0; i < layerGroups.length; i++) {
        if (map.hasLayer(layerGroups[i])) {
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
    // areaDataCharts = data;
    return data;
}

//update divisor from radio button
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
    }
    areaDataCharts = loadStats(AREA_DIVISOR);
    drawCharts();
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
function drawCharts() {
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
        else {
            for (var j = 0; j < areaDataCharts[i].categories.length; j++) {
                dataset.push(areaDataCharts[i].categories[j]);
            }
        }
    }
    dataset.sort(sortByArea);

    var labels = [];
    var data = [];
    var colors = [];

    for (var i = 0; i < dataset.length; i++) {
        labels.push(dataset[i].name);
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
                }
            }
        });
    }
    else {
        var newDatasetLength = pieData.datasets[0].data.length;
        var oldDatasetLength = pieChart.data.datasets[0].data.length;
        for (var i = 0; i < newDatasetLength; i++) {
            pieChart.data.datasets[0].data[i] = pieData.datasets[0].data[i];
            pieChart.data.datasets[0].backgroundColor[i] = pieData.datasets[0].backgroundColor[i];
            pieChart.data.labels[i] = pieData.labels[i];
        }
        if (newDatasetLength < oldDatasetLength) {
            pieChart.data.datasets[0].data.splice(newDatasetLength, oldDatasetLength - newDatasetLength);
            pieChart.data.datasets[0].backgroundColor.splice(newDatasetLength, oldDatasetLength - newDatasetLength);
            pieChart.data.labels.splice(newDatasetLength, oldDatasetLength - newDatasetLength);
        }
        pieChart.update();
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
        var newDatasetLength = pieData.datasets[0].data.length;
        var oldDatasetLength = barChart.data.datasets[0].data.length;
        for (var i = 0; i < newDatasetLength; i++) {
            barChart.data.datasets[0].data[i] = pieData.datasets[0].data[i];
            barChart.data.datasets[0].backgroundColor[i] = pieData.datasets[0].backgroundColor[i];
            barChart.data.labels[i] = pieData.labels[i];
        }
        if (newDatasetLength < oldDatasetLength) {
            barChart.data.datasets[0].data.splice(newDatasetLength, oldDatasetLength - newDatasetLength);
            barChart.data.datasets[0].backgroundColor.splice(newDatasetLength, oldDatasetLength - newDatasetLength);
            barChart.data.labels.splice(newDatasetLength, oldDatasetLength - newDatasetLength);
        }
        barChart.update();
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
                            // max: 100,
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
        var newDatasetLength = pieData.datasets[0].data.length;
        var oldDatasetLength = hbarChart.data.datasets[0].data.length;
        for (var i = 0; i < newDatasetLength; i++) {
            hbarChart.data.datasets[0].data[i] = pieData.datasets[0].data[i];
            hbarChart.data.datasets[0].backgroundColor[i] = pieData.datasets[0].backgroundColor[i];
            hbarChart.data.labels[i] = pieData.labels[i];
        }
        if (newDatasetLength < oldDatasetLength) {
            hbarChart.data.datasets[0].data.splice(newDatasetLength, oldDatasetLength - newDatasetLength);
            hbarChart.data.datasets[0].backgroundColor.splice(newDatasetLength, oldDatasetLength - newDatasetLength);
            hbarChart.data.labels.splice(newDatasetLength, oldDatasetLength - newDatasetLength);
        }
        hbarChart.update();
    }

}

window.onerror = function (message, url, lineNumber) {
    // if (url.includes('Chart.')) return true;
};

function recursiveLayerData(name, layer) {
    if (typeof layer.feature != 'undefined'){
        dataset.push({
            'type': name,
            'area': layer.feature.properties.area
        })
    }
    else if (typeof layer.eachLayer != 'undefined'){
        var layerName;
        if (typeof layer.name != 'undefined'){

        }
        layer.eachLayer(function (layer) {

        })
    }
}

function loadDataset() {
    dataset = [];
    for (var i = 0; i < layerGroups.length; i++) {
        layerGroups[i].eachLayer(function (layer) {
            if (typeof layer.feature != 'undefined') {
                dataset.push({
                    'type': layerGroups[i].name,
                    'area': layer.feature.properties.area,
                })
            }
        })
    }
    return dataset
}