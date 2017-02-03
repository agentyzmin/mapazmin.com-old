var map;
var layerGroups;
var areaData;
var pieChart;

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
        yardsLayerGroup.categories = ["open", "hard_to_reach", "unreachable"];
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

    // defines switch behaviour(turning layerGroups on and off)
    function layerSwitcher(element, layer) {  // element - checkbox, layer - corresponding layer
        //console.log(element);
        //console.log(layer);
        if (typeof layer === 'undefined') return;
        if (element.checked) {
            if (!map.hasLayer(layer)) {
                //console.log(layer)
                map.addLayer(layer)
                refreshMap()
            }
        }
        else {
            if (map.hasLayer(layer)) {
                map.removeLayer(layer)
                refreshMap()
            }
            // recursion, fix later
            // else if (typeof layer.eachLayer != 'undefined'){
            //     layer.eachLayer(function (layer) {
            //         layerSwitcher(element, layer)
            //     })
            // }
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
            currSwitchDIV.id = layerGroups[i].name + "Switch";
            currSwitchDIV.innerHTML = "<label><input type='checkbox'> Toggle " + layerGroups[i].name + "    </label>  ";
            var currSwitchINPUT = currSwitchDIV.childNodes[0].childNodes[0];
            currSwitchINPUT.addEventListener('click', switchConstructor(i, currSwitchINPUT));
            wrapper.appendChild(currSwitchDIV)
        }
    }
    loadSwitches()
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

//recursiveBringToFront
// function recursiveBringToFront(layerGroup) {
//     if (map.hasLayer(layerGroup) && typeof layerGroup.bringToFront != 'undefined'){
//         layerGroup.bringToFront()
//     }
//     else if(typeof layerGroup.eachLayer != 'undefined'){
//         layerGroup.eachLayer(function (layer) {
//             recursiveBringToFront(layer)
//         })
//     }
// }

//refresh function - implements z-index(based on layerGroups array), updates stats and builds charts
function refreshMap() {
    for (var i = 0; i < layerGroups.length; i++) {
        if(map.hasLayer(layerGroups[i])){
            layerGroups[i].eachLayer(function (layer) {
                layer.bringToFront()
            });
            document.getElementById(layerGroups[i].name + "Switch").childNodes[0].childNodes[0].checked=true;
            //TODO: fix ids for switches!!!
        }
        // recursion, fix later
        // recursiveBringToFront(layerGroups[i]);
    }
    loadStats();
    drawCharts();
}

//counts area of all elements of layerGroup
function layerGroupArea(layerGroup) {
    totalArea = 0;
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

    if(typeof pieChart != 'undefined' && pieChart.data.datasets[0].data[0] == data[0]){
        return;
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
                xAxes: [{
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
