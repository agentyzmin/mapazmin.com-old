/**
 * Created by proggeo on 31.01.17.
 */



var map;
var layers;
//    var yard_layer, trees_layer, cars_layer, houses_layer, roads_layer, first_floor_layer;


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

    // trees block start
    var client_trees = new XMLHttpRequest();
    client_trees.open('GET', '/trees_json');
    client_trees.onreadystatechange = function () {
        var plainTreesCoo = client_trees.responseText;
        var treesCoo = JSON.parse(plainTreesCoo);

        for (var i = 0; i < treesCoo.length; i++) {
            tree = treesCoo[i];
            current_tree = L.circle([tree['lat'], tree['lon']], {
                radius: tree['radius'],
                color: '#91C497',
                weight: 1,
                opacity: 0.8,
                fillColor: '#91C497',
                fillOpacity: 0.8,
                zIndex: 200
            });
            trees_layer.addLayer(current_tree)
        }
//        trees_layer.addTo(map);
        redraw_all_layers()
    };
    client_trees.send();
    // trees block end

    // cars block start
    var client_cars = new XMLHttpRequest();
    client_cars.open('GET', '/cars_json');
    client_cars.onreadystatechange = function () {

        var plainCarsCoo = client_cars.responseText;
        var carsCoo = JSON.parse(plainCarsCoo);

        for (var i = 0; i < carsCoo.length; i++) {
            var carCoords = [
                [carsCoo[i]['a']['lat'], carsCoo[i]['a']['lon']],
                [carsCoo[i]['b']['lat'], carsCoo[i]['b']['lon']],
                [carsCoo[i]['c']['lat'], carsCoo[i]['c']['lon']],
                [carsCoo[i]['d']['lat'], carsCoo[i]['d']['lon']],
            ];

            current_car = L.polygon(carCoords, {
                color: '#242424',
                opacity: 1,
                weight: 1,
                fillColor: '#242424',
                fillOpacity: 1,
                smoothFactor: 1,
                zIndex: 200
            });
            cars_layer.addLayer(current_car)
        }
//        cars_layer.addTo(map);
        redraw_all_layers()
    };
    client_cars.send();
    // cars block end

    // cars day block start
    var client_cars_day = new XMLHttpRequest();
    client_cars_day.open('GET', '/cars_day_json');
    client_cars_day.onreadystatechange = function () {

        var plainCarsDayCoo = client_cars_day.responseText;
        var carsDayCoo = JSON.parse(plainCarsDayCoo);

        for (var i = 0; i < carsDayCoo.length; i++) {
            var carCoords = [
                [carsDayCoo[i]['a']['lat'], carsDayCoo[i]['a']['lon']],
                [carsDayCoo[i]['b']['lat'], carsDayCoo[i]['b']['lon']],
                [carsDayCoo[i]['c']['lat'], carsDayCoo[i]['c']['lon']],
                [carsDayCoo[i]['d']['lat'], carsDayCoo[i]['d']['lon']],
            ];

            current_car = L.polygon(carCoords, {
                color: '#242424',
                opacity: 1,
                weight: 1,
                fillColor: '#242424',
                fillOpacity: 1,
                smoothFactor: 1,
                zIndex: 200
            });
            cars_day_layer.addLayer(current_car)
        }
        redraw_all_layers()
    };
    client_cars_day.send();
    // cars day block end

    // cars night block start
    var client_cars_night = new XMLHttpRequest();
    client_cars_night.open('GET', '/cars_night_json');
    client_cars_night.onreadystatechange = function () {

        var plainCarsNightCoo = client_cars_night.responseText;
        var carsNightCoo = JSON.parse(plainCarsNightCoo);

        for (var i = 0; i < carsNightCoo.length; i++) {
            var carCoords = [
                [carsNightCoo[i]['a']['lat'], carsNightCoo[i]['a']['lon']],
                [carsNightCoo[i]['b']['lat'], carsNightCoo[i]['b']['lon']],
                [carsNightCoo[i]['c']['lat'], carsNightCoo[i]['c']['lon']],
                [carsNightCoo[i]['d']['lat'], carsNightCoo[i]['d']['lon']],
            ];

            current_car = L.polygon(carCoords, {
                color: '#242424',
                opacity: 1,
                weight: 1,
                fillColor: '#242424',
                fillOpacity: 1,
                smoothFactor: 1,
                zIndex: 200
            });
            cars_night_layer.addLayer(current_car)
        }
        redraw_all_layers()
    };
    client_cars_night.send();
    // cars day block end


    // houses block start
    var client_houses = new XMLHttpRequest();
    client_houses.open('GET', '/houses_json');
    client_houses.onreadystatechange = function () {
        var houseplain = client_houses.responseText;
        var houses = JSON.parse(houseplain);
        for (var i = 0; i < houses.length; i++) {
            houseCoos = [];
            for (var j = 0; j < houses[i].length; j++) {
                houseCoos[j] = [houses[i][j]['lat'], houses[i][j]['lng']]
            }

            current_house = L.polygon(houseCoos, {
                color: '#AAB3BE',
                opacity: 1,
                weight: 1,
                fillColor: '#C9CFD2',
                fillOpacity: 0.8,
                smoothFactor: 1
            });
            houses_layer.addLayer(current_house);
        }
        houses_layer.addTo(map);
        redraw_all_layers()

    };
    client_houses.send();
    // houses block end

    // roads block start
    var client_roads = new XMLHttpRequest();
    client_roads.open('GET', '/roads_json');
    client_roads.onreadystatechange = function () {
        var roadsplain = client_roads.responseText;
        var roads = JSON.parse(roadsplain);
        for (var i = 0; i < roads.length; i++) {
            roadCoos = [];
            for (var j = 0; j < roads[i].length; j++) {
                roadCoos[j] = [roads[i][j]['lat'], roads[i][j]['lng']]
            }
            current_road = L.polygon(roadCoos, {
                color: '#6D6D6D',
                opacity: 1,
                weight: 1,
                fillColor: '#6D6D6D',
                fillOpacity: 1,
                smoothFactor: 1,
            });
            roads_layer.addLayer(current_road);
        }
        roads_layer.addTo(map);
        redraw_all_layers()
    };
    client_roads.send();
    // roads block end

    // yards block start

    yard_colors = ["#fcde60", "#898989", "#666666"]; // 0 - open yards, 1 - hard to reach, 2 - unreachable

    var client_yards = new XMLHttpRequest();
    client_yards.open('GET', '/yards_json');
    client_yards.onreadystatechange = function () {
        var yardsplain = client_yards.responseText;
        var yards = JSON.parse(yardsplain);
        for (var i = 0; i < yards.length; i++) {
            yard_type = yards[i][0];
            yardCoos = [];
            for (var j = 0; j < yards[i][1].length; j++) {
                yardCoos[j] = [yards[i][1][j]['lat'], yards[i][1][j]['lng']]
            }
            current_yard = L.polygon(yardCoos, {
                color: yard_colors[yard_type],
                opacity: 0.8,
                weight: 1,
                fillColor: yard_colors[yard_type],
                fillOpacity: 0.8,
                smoothFactor: 1
            });
            yard_layer.addLayer(current_yard)
        }
//        yard_layer.addTo(map);
        redraw_all_layers();

    };
    client_yards.send();
    // yards block end

    // first floor block start

    floor_colors = ['#9463C2', '#FD6E70', '#AAAAAA', '#4390FC', '#FFF6CF', '#565656']; // 0 - office, 1 - cafe, 2 - garage, 3 - culture, 4 - housing, 5 - ruin

    var client_1floor = new XMLHttpRequest();
    client_1floor.open('GET', '/floor1_json');
    client_1floor.onreadystatechange = function () {
        var floor1plain = client_1floor.responseText;
        var floors1 = JSON.parse(floor1plain);
        for (var i = 0; i < floors1.length; i++) {
            floor_function = floors1[i][0];
            floor1Coos = [];
            for (var j = 0; j < floors1[i][1].length; j++) {
                floor1Coos[j] = [floors1[i][1][j]['lat'], floors1[i][1][j]['lng']]
            }
            current_floor1 = L.polygon(floor1Coos, {
                color: floor_colors[floor_function],
                opacity: 0.8,
                weight: 1,
                fillColor: floor_colors[floor_function],
                fillOpacity: 0.8,
                smoothFactor: 1
            });
            first_floor_layer.addLayer(current_floor1)
        }
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


function redraw_all_layers() {
    for (var i = 0; i < layers.length; i++) {
        if (map.hasLayer(layers[i])) {
            layers[i].eachLayer(function (layer) {
                layer.bringToFront()
            })
        }
    }
}
