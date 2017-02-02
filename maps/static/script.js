var map;
var layers;
var area_data;
var pieChart;

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

    yard_layer = L.layerGroup([]);
    trees_layer = L.layerGroup([]);
    cars_layer = L.layerGroup([]);
    cars_day_layer = L.layerGroup([]);
    cars_night_layer = L.layerGroup([]);
    houses_layer = L.layerGroup([]);
    roads_layer = L.layerGroup([]);
    first_floor_layer = L.layerGroup([]);
    layers = [roads_layer, yard_layer, houses_layer, first_floor_layer, cars_layer, cars_day_layer, cars_night_layer, trees_layer]; // from bottom to top
    layer_names = ["Roads", "Yards", "Buildings", "First Floor Function", "Cars", "Cars(day)", "Cars(night)", "Trees"];

    for (var i = 0; i < layers.length; i++)layers[i].name = layer_names[i]

    // trees block start
    var client_trees = new XMLHttpRequest();
    client_trees.open('GET', '/static/geoJSON/trees_GeoCoo.json.geojson');
    client_trees.onreadystatechange = function () {
        var geoJSON = JSON.parse(client_trees.responseText);
        var geoJSONLayer = L.geoJson(geoJSON, {
            pointToLayer: function (feature, latlng) {
                return L.circle(latlng, {
                    radius: feature.properties.radius,
                    color: '#91C497',
                    weight: 1,
                    opacity: 0.8,
                    fillColor: '#91C497',
                    fillOpacity: 0.8,
                    zIndex: 200
                })
            }
        });
        trees_layer.addLayer(geoJSONLayer);
        redraw_all_layers();
    };
    client_trees.send();
    // trees block end

    // cars block start
    var client_cars = new XMLHttpRequest();
    client_cars.open('GET', '/static/geoJSON/cars_GeoCoo.json.geojson');
    client_cars.onreadystatechange = function () {

        var geoJSON = JSON.parse(client_cars.responseText);
        var geoJSONlayer = L.geoJSON(geoJSON, {
            color: '#242424',
            opacity: 1,
            weight: 1,
            fillColor: '#242424',
            fillOpacity: 1,
            smoothFactor: 1
        });
        cars_layer.addLayer(geoJSONlayer);
        redraw_all_layers()
    };
    client_cars.send();
    // cars block end

    // cars day block start
    var client_cars_day = new XMLHttpRequest();
    client_cars_day.open('GET', '/static/geoJSON/Yarvalcars_day_GeoCoo.json.geojson');
    client_cars_day.onreadystatechange = function () {

        var geoJSON = JSON.parse(client_cars_day.responseText);
        var geoJSONlayer = L.geoJSON(geoJSON, {
            color: '#242424',
            opacity: 1,
            weight: 1,
            fillColor: '#242424',
            fillOpacity: 1,
            smoothFactor: 1
        });
        cars_day_layer.addLayer(geoJSONlayer);
        redraw_all_layers()
    };
    client_cars_day.send();
    // cars day block end

    // cars night block start
    var client_cars_night = new XMLHttpRequest();
    client_cars_night.open('GET', '/static/geoJSON/Yarvalcars_night_GeoCoo.json.geojson');
    client_cars_night.onreadystatechange = function () {

        var geoJSON = JSON.parse(client_cars_night.responseText);
        var geoJSONlayer = L.geoJSON(geoJSON, {
            color: '#242424',
            opacity: 1,
            weight: 1,
            fillColor: '#242424',
            fillOpacity: 1,
            smoothFactor: 1
        });
        cars_night_layer.addLayer(geoJSONlayer);
        redraw_all_layers()
    };
    client_cars_night.send();
    // cars day block end

    // houses block start
    var client_houses = new XMLHttpRequest();
    client_houses.open('GET', '/static/geoJSON/housesGeo.json.geojson');
    client_houses.onreadystatechange = function () {
        var geoJSON = JSON.parse(client_houses.responseText);
        var geoJSONlayer = L.geoJSON(geoJSON, {
            color: '#AAB3BE',
            opacity: 1,
            weight: 1,
            fillColor: '#C9CFD2',
            fillOpacity: 0.8,
            smoothFactor: 1
        });
        geoJSONlayer.eachLayer(function (layer) {
            layer.bindPopup("Площа: " + layer.feature.properties.area.toString())
        });
        houses_layer.addLayer(geoJSONlayer).addTo(map);
        redraw_all_layers()
    };
    client_houses.send();
    // houses block end

    // roads block start
    var client_roads = new XMLHttpRequest();
    client_roads.open('GET', '/static/geoJSON/roadsGeo.json.geojson');
    client_roads.onreadystatechange = function () {
        var geoJSON = JSON.parse(client_roads.responseText);
        var geoJSONlayer = L.geoJSON(geoJSON, {
            color: '#6D6D6D',
            opacity: 1,
            weight: 1,
            fillColor: '#6D6D6D',
            fillOpacity: 1,
            smoothFactor: 1
        });
        roads_layer.addLayer(geoJSONlayer).addTo(map);
        redraw_all_layers()
    };
    client_roads.send();
    // roads block end

    // yards block start

    var client_yards = new XMLHttpRequest();
    client_yards.open('GET', '/static/geoJSON/yardsGeo.json.geojson');
    client_yards.onreadystatechange = function () {
        var geoJSON = JSON.parse(client_yards.responseText);
        var geoJSONlayer = L.geoJSON(geoJSON, {
            style: function (feature) {
                var function_color;
                switch (feature.properties.category) {
                    case 'open':
                        function_color = "#fcde60";
                        break;
                    case 'hard to reach':
                        function_color = "#898989";
                        break;
                    case 'unreachable' :
                        function_color = "#666666";
                        break;
                    default:
                        function_color = "#000000"
                }

                return {
                    color: function_color,
                    opacity: 0.8,
                    weight: 1,
                    fillColor: function_color,
                    fillOpacity: 0.8,
                    smoothFactor: 1
                }
            }
        });
        yard_layer.addLayer(geoJSONlayer);
        yard_layer.categories = ["open", "hard to reach", "unreachable"];
        redraw_all_layers();
    };
    client_yards.send();
    // yards block end

    // first floor block start

    floor_colors = ['#9463C2', '#FD6E70', '#AAAAAA', '#4390FC', '#FFF6CF', '#565656']; // 0 - office, 1 - cafe, 2 - garage, 3 - culture, 4 - housing, 5 - ruin

    var client_1floor = new XMLHttpRequest();
    client_1floor.open('GET', '/static/geoJSON/firstFloorFunctionGeo.json.geojson');
    client_1floor.onreadystatechange = function () {
        var geoJSON = JSON.parse(client_1floor.responseText);
        var geoJSONlayer = L.geoJSON(geoJSON, {
            style: function (feature) {
                var function_color;
                switch (feature.properties.category) {
                    case 'office':
                        function_color = '#9463C2';
                        break;
                    case 'cafe':
                        function_color = '#FD6E70';
                        break;
                    case 'garage':
                        function_color = '#AAAAAA';
                        break;
                    case 'culture':
                        function_color = '#4390FC';
                        break;
                    case 'housing':
                        function_color = '#FFF6CF';
                        break;
                    case 'ruin':
                        function_color = '#565656';
                        break;
                    default:
                        function_color = '#000000'
                }

                return {
                    color: function_color,
                    opacity: 0.8,
                    weight: 1,
                    fillColor: function_color,
                    fillOpacity: 0.8,
                    smoothFactor: 1
                }
            }
        });
        first_floor_layer.addLayer(geoJSONlayer);
        first_floor_layer.categories = ["office", "cafe", "garage", "culture", "housing", "ruin"];
        redraw_all_layers();

    };
    client_1floor.send();

    // first floor block end

    document.getElementById("tree_switch").addEventListener("click", function () {
        layerSwitcher(this, trees_layer);
    });

    document.getElementById("cars_switch").addEventListener("click", function () {
        layerSwitcher(this, cars_layer);
    });

    document.getElementById("yards_switch").addEventListener("click", function () {
        layerSwitcher(this, yard_layer);
    });

    document.getElementById("first_floor_switch").addEventListener("click", function () {
        layerSwitcher(this, first_floor_layer);
    });

    document.getElementById("cars_day_switch").addEventListener("click", function () {
        layerSwitcher(this, cars_day_layer);
    });

    document.getElementById("cars_night_switch").addEventListener("click", function () {
        layerSwitcher(this, cars_night_layer);
    });

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
        redraw_all_layers()
    }
}

initMap();

function load_stats() {
    var wrapper = document.getElementById("stats");
    wrapper.innerHTML = "";
    var totalArea = 0;
    var groups = [];
    for (var i = 0; i < layers.length; i++) {
        if (map.hasLayer(layers[i])) {
            var area = count_layer_group_area(layers[i]);
            totalArea += area;
            layers[i].area = area;
            groups.push(layers[i])
        }
    }
    var data = [];
    for (var i = 0; i < groups.length; i++) {
        var layerGroupDIV = document.createElement("div");
        layerGroupDIV.id = "stats_" + groups[i].name;
        var curr_area = (groups[i].area / totalArea * 100).toPrecision(4);
        data.push({
            name: groups[i].name,
            area: curr_area
        });
        var layerGroupP = document.createElement("p");
        layerGroupP.innerHTML = groups[i].name + ": " + curr_area + "%";
        layerGroupDIV.appendChild(layerGroupP);
        if (groups[i].categories != undefined) {
            for (var j = 0; j < groups[i].categories.length; j++) {
                curr_area = count_layer_group_area(filter_layer_group_by_feature(groups[i], function (layer) {
                    return layer.feature.properties.category == groups[i].categories[j]
                }));
                curr_area = (curr_area / totalArea * 100).toPrecision(4);
                var categoryLI = document.createElement('li');
                categoryLI.innerHTML = groups[i].categories[j] + ": " + curr_area + "%";
                layerGroupDIV.appendChild(categoryLI)
            }
        }
        area_data = data;
        wrapper.appendChild(layerGroupDIV)
    }
}

function redraw_all_layers() {
    for (var i = 0; i < layers.length; i++) {
        if (map.hasLayer(layers[i])) {
            layers[i].eachLayer(function (layer) {
                layer.bringToFront()
            })
        }
    }
    load_stats();
    init_pieChart();
}

function count_layer_group_area(layerGroup) {
    total_area = 0;
    layerGroup.eachLayer(function (layer) {
        if (typeof layer.feature === "undefined") {
            total_area += count_layer_group_area(layer)
        }
        else {
            total_area += layer.feature.properties.area
        }
    });
    return total_area
}

function filter_layer_group_by_feature(layerGroup, filter) {
    result_group = L.layerGroup([]);
    layerGroup.eachLayer(function (layer) {
        if (typeof layer.feature === "undefined") {
            result_group.addLayer(filter_layer_group_by_feature(layer, filter))
        }
        else {
            if (filter(layer)) {
                result_group.addLayer(layer);
            }
        }
    });
    return result_group
}

function init_pieChart() {
    var ctx = document.getElementById('piechart');
    var parent = ctx.parentElement;
    var newctx = document.createElement("canvas");
    newctx.width = ctx.width;
    newctx.height = ctx.height;
    ctx.remove();
    ctx = newctx;
    ctx.id = 'piechart'
    parent.appendChild(ctx);
    var colors_by_name = {
        "Roads": '#50514F',
        "Yards": '#247BA0',
        "Buildings": '#F25F5C',
        "First Floor Function": "#9463C2",
        "Cars": '#70C1B3',
        "Cars(day)": '#95F9E3',
        "Cars(night)": '#247BA0 ',
        "Trees": '#91C497',
    };
    if (area_data == undefined) return;
    var labels = [];
    var data = [];
    var colors = [];
    for (var i = 0; i < area_data.length; i++) {
        labels.push(area_data[i].name);
        data.push(area_data[i].area);
        colors.push(colors_by_name[area_data[i].name])
    }
    var pieData = {
        labels: labels,
        datasets: [
            {
                data: data,
                backgroundColor: colors
            }
        ]
    };

    pieChart = new Chart(ctx, {
        type: 'pie',
        data: pieData
    });

}
