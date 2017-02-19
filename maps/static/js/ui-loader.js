/**
 * Created by yurii on 2/19/2017.
 */


function generateStreetStatBlocks() {
    var parentDiv = document.getElementById('streets');
    for (var index in STREETS) {
        var id = STREETS[index] + 'Block'
        var streetDIV = document.createElement('div');
        var chartsDIV = document.createElement('div');
        chartsDIV.id = id;
        chartsDIV.className = 'collapse';
        var header = document.createElement('h4');
        header.innerHTML = i18n(STREETS[index]) + ':';
        header.setAttribute('data-toggle', 'collapse');
        header.setAttribute('data-target', '#' + id);
        header.style.cursor = 'pointer';
        streetDIV.appendChild(header);
        streetDIV.appendChild(chartsDIV);
        parentDiv.appendChild(streetDIV);
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

function layerSwitcher(element, layer) {
    if (typeof layer === 'undefined') return;
    if (element.checked) {
        if (!map.hasLayer(layer)) {
            map.addLayer(layer);
            refreshMap()
        }
    }
    else if (map.hasLayer(layer)) {
        map.removeLayer(layer);
        refreshMap()
    }
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

function loadStats(absoluteArea) {
    var EXCLUSIONS = ['cars', 'carsDay', 'carsNight', 'facades', 'firstFloorFunction', 'yards'];
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

function checkCarLayers() {
    var carsLayerGroups = [carsLayerGroup, carsDayLayerGroup, carsNightLayerGroup];
    var parentDiv = document.getElementById('carsPerHuman');

    if (map.hasLayer(carsLayerGroup) || map.hasLayer(carsDayLayerGroup) || map.hasLayer(carsNightLayerGroup)) {
        parentDiv.style.display = 'block'
    }
    else {
        parentDiv.style.display = 'none'
    }

    for (var index in carsLayerGroups) {
        if (map.hasLayer(carsLayerGroups[index])) {
            document.getElementById(carsLayerGroups[index].name + 'PerHumanStat').style.display = 'block';
        }
        else {
            document.getElementById(carsLayerGroups[index].name + 'PerHumanStat').style.display = 'none';
        }
    }
}

function loadCarsPerPopulation() {
    var carsLayerGroups = [carsLayerGroup, carsDayLayerGroup, carsNightLayerGroup];

    var parentDiv = document.getElementById('carsPerHuman');

    for (var index in carsLayerGroups) {
        var layerGroup = carsLayerGroups[index];
        var count = layerGroup.getLayers().length;
        var stat = document.getElementById(layerGroup.name + 'PerHumanStat');
        if (!stat) {
            stat = document.createElement('p');
            stat.id = layerGroup.name + 'PerHumanStat';
            parentDiv.appendChild(stat);
        }
        stat.innerHTML = i18n(layerGroup.name) + ': ' + (count / POPULATION).toFixed(3);
    }
}

function updateDivisor(newDivisor) {
    AREA_DIVISOR = newDivisor;
    refreshMap();
}

function refreshMap() {
    for (var i = 0; i < layerGroups.length; i++) {
        if (map.hasLayer(layerGroups[i])) {
            layerGroups[i].eachLayer(function (layer) {
                layer.bringToFront()
            });
            document.getElementById(layerGroups[i].name + "Switch").checked = true;
        }
    }
    checkCarLayers();
    checkLayersForCharts();
    areaDataCharts = loadStats(AREA_DIVISOR);
    loadAreaByPopulation();
    drawAreaCharts();
}

function layerGroupArea(layerGroup) {
    var totalArea = 0;
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

function loadAreaByPopulation() {
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

function sortFacadeDataByActiveLength(data) {
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
    return streets_by_active_length
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

function loadTreesAreaByStreet() {
    var result = {};
    treesLayerGroup.eachLayer(function (layer) {
        var tree_radius = layer.feature.properties.radius.toFixed(0);
        var streets = layer.feature.properties.streets;
        for (var index in streets) {
            var street = streets[index];
            if (STREETS.includes(street)) {
                if (typeof result[street] === 'undefined') {
                    result[street] = {}
                }
                if (typeof result[street][tree_radius] === 'undefined') {
                    result[street][tree_radius] = 0
                }
                result[street][tree_radius] += 1;
            }
        }
    });
    return result
}

function i18n(string) {
    var dict = {
        "roads": 'Дороги',
        "yards": 'Подвір\'я',
        "buildings": 'Будівлі',
        "firstFloorFunction": "Функція першого поверху",
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
    };
    return dict[string];
}