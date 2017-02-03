var map;
var layerGroups;
var areaData;


var COLORS = {
    "Roads": '#6D6D6D',
    "Yards": '#fcde60', //not shown on a map
    "Buildings": '#C9CFD2',
    "First Floor Function": "#9463C2",//not shown on a map
    "Cars": '#242424',
    "Cars(day)": '#242424',
    "Cars(night)": '#242424',
    "Trees": '#91C497',
    "hard to reach": '#898989',
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
    layerNames = ["Roads", "Yards", "Buildings", "First Floor Function", "Cars", "Cars(day)", "Cars(night)", "Trees"];

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
            layer.bindPopup("Площа: " + layer.feature.properties.area.toString())
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
            smoothFactor: 1
        });
        roadsLayerGroup.addLayer(geoJSONlayer).addTo(map);
        refreshMap()
    });
    // roads block end

    // yards block start

    processGeoJson('/static/geoJSON/yardsGeo.json.geojson', function (geoJSON) {
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
            }
        });
        yardsLayerGroup.addLayer(geoJSONlayer);
        yardsLayerGroup.categories = ["open", "hard to reach", "unreachable"];
        refreshMap();
    });

    // yards block end

    // first floor block start

    processGeoJson('/static/geoJSON/firstFloorFunctionGeo.json.geojson', function (geoJSON) {
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
            }
        });
        firstFloorLayerGroup.addLayer(geoJSONlayer);
        firstFloorLayerGroup.categories = ["office", "cafe", "garage", "culture", "housing", "ruin"];
        refreshMap();
    });

    // first floor block end

    document.getElementById("tree_switch").addEventListener("click", function () {
        layerSwitcher(this, treesLayerGroup);
    });

    document.getElementById("cars_switch").addEventListener("click", function () {
        layerSwitcher(this, carsLayerGroup);
    });

    document.getElementById("yards_switch").addEventListener("click", function () {
        layerSwitcher(this, yardsLayerGroup);
    });

    document.getElementById("first_floor_switch").addEventListener("click", function () {
        layerSwitcher(this, firstFloorLayerGroup);
    });

    document.getElementById("cars_day_switch").addEventListener("click", function () {
        layerSwitcher(this, carsDayLayerGroup);
    });

    document.getElementById("cars_night_switch").addEventListener("click", function () {
        layerSwitcher(this, carsNightLayerGroup);
    });

    // defines switch behaviour(turning layerGroups on and off)
    function layerSwitcher(element, layer) {  // element - checkbox, layer - corresponding layer
        if (element.checked) {
            if (!map.hasLayer(layer)) {
                map.addLayer(layer)
            }
        }
        else {
            if (map.hasLayer(layer)) {
                map.removeLayer(layer)
            }
        }
        refreshMap()
    }
}

initMap();

// updates stats based on current data
function loadStats() {
    // clear previous data
    var wrapper = document.getElementById("stats");
    wrapper.innerHTML = "";
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
    var data = [];
    for (var i = 0; i < groups.length; i++) {
        var currArea = (groups[i].area / totalArea * 100).toPrecision(4);
        var currData = {
            name: groups[i].name,
            area: currArea
        };

        var layerGroupDIV = document.createElement("div");
        layerGroupDIV.id = groups[i].name + "Stats";
        var layerGroupP = document.createElement("p");
        layerGroupP.innerHTML = groups[i].name + ": " + currArea + "%";
        layerGroupDIV.appendChild(layerGroupP);

        if (groups[i].categories != undefined) {
            currData['categories'] = [];
            for (var j = 0; j < groups[i].categories.length; j++) {
                currArea = layerGroupArea(layerGroupFilter(groups[i], function (layer) {
                    return layer.feature.properties.category == groups[i].categories[j]
                }));
                currArea = (currArea / totalArea * 100).toPrecision(4);
                currData['categories'].push({
                        name: groups[i].categories[j],
                        area: currArea
                    }
                );

                var categoryLI = document.createElement('li');
                categoryLI.innerHTML = groups[i].categories[j] + ": " + currArea + "%";
                layerGroupDIV.appendChild(categoryLI)
            }
        }
        data.push(currData);
        wrapper.appendChild(layerGroupDIV)
    }
    areaData = data;
}

//refresh function - implements z-index(based on layerGroups array), updates stats and builds charts
function refreshMap() {
    for (var i = 0; i < layerGroups.length; i++) {
        if (map.hasLayer(layerGroups[i])) {
            layerGroups[i].eachLayer(function (layer) {
                layer.bringToFront()
            })
        }
    }
    loadStats();
    drawCharts();
}

//counts area of all elements of layerGroup
function layerGroupArea(layerGroup) {
    totalArea = 0;
    layerGroup.eachLayer(function (layer) {
        if (typeof layer.feature != "undefined") {
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
    resultGroup = L.layerGroup([]);
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

// destroying previously drawn chart and creating new one instead, keep this function to avoid overlapping on redrawing(it gets ugly, really)
function reloadCanvas(canvasId) {
    var ctx = document.getElementById(canvasId);
    var parent = ctx.parentElement;
    var newctx = document.createElement("canvas");
    newctx.width = ctx.width;
    newctx.height = ctx.height;
    ctx.remove();
    ctx = newctx;
    ctx.id = canvasId;
    parent.appendChild(ctx);
}

// draws charts via Chart.js
function drawCharts() {
    if (areaData == undefined) return;

    var sortByArea = function (a, b) {
        if (Number(a.area) > Number(b.area)) return -1;
        else if (Number(a.area) < Number(b.area)) return 1;
        else return 0
    };

    var dataset = [];

    for (var i = 0; i < areaData.length; i++) {
        if (areaData[i].categories == undefined) {
            dataset.push(areaData[i]);
        }
        else {
            for (var j = 0; j < areaData[i].categories.length; j++) {
                dataset.push(areaData[i].categories[j]);
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

    reloadCanvas('piechart');
    reloadCanvas('barchart');
    reloadCanvas('hbarchart');

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

    var ctxPie = document.getElementById('piechart');
    var ctxBar = document.getElementById('barchart');
    var ctxHbar = document.getElementById('hbarchart');


    pieChart = new Chart(ctxPie, {
        type: 'pie',
        data: pieData
    });

    barChart = new Chart(ctxBar, {
        type: 'bar',
        data: pieData,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        // max: 100,
                        min: 0
                    }
                }]
            },
            legend: {
                display: false
            }
        }
    });

    hbarChart = new Chart(ctxHbar, {
        type: 'horizontalBar',
        data: pieData,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        // max: 100,
                        min: 0

                    }
                }]
            },
            legend: {
                display: false
            }
        }
    });
}

window.onerror = function (message, url, lineNumber) {
    if (url.includes('Chart.')) return true;
};
