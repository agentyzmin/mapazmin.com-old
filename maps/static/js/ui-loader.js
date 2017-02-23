/**
 * Created by yurii on 2/19/2017.
 */

var selectedLayer;

function generateStreetStatBlocks() {
    var parentDiv = $('#streets');
    for (var index in STREETS) {
        var id = STREETS[index] + 'Block';
        var streetDIV = $('<div></div>');
        var chartsDIV = $('<div></div>').attr('id', id).addClass('collapse');
        var header = $('<h4>' + i18n(STREETS[index]) + '</h4>')
            .attr('data-toggle', 'collapse')
            .attr('data-target', '#' + id)
            .css('cursor', 'pointer')
        streetDIV.append(header);
        streetDIV.append(chartsDIV);
        parentDiv.append(streetDIV);
    }
}

function loadSwitches() {
    var wrapper = $('#switchContainer').html('');
    // wrapper.innerHTML = "";
    for (var i = 0; i < layerGroups.length; i++) {
        var currSwitchDIV = $('<div></div>')
            .css('display', 'inline-block')
            .attr('id', layerGroups[i].name + "SwitchContainer")
            .html("<label><input type='checkbox'>  " + i18n(layerGroups[i].name) + " </label>  ")
        var currSwitchInput = currSwitchDIV.find('input')
            .attr('id', layerGroups[i].name + "Switch");
        currSwitchInput.change(switchConstructor(i, currSwitchInput));
        wrapper.append(currSwitchDIV)
    }
}

function loadFloorSwitch() {
    var floors = [];
    firstFloorLayerGroup.eachLayer(function (layer) {
        for (var floor in layer.feature.properties.floors) {
            if (!floors.includes(floor)) {
                floors.push(floor)
            }
        }
    });
    floors.sort();
    var floorSwitcher = $('#floorSwitcher').html('');
    var floorSwitcherSelect = $('<select class="form-group"></select>');
    floorSwitcher.append(floorSwitcherSelect);
    for (var index in floors) {
        floorSwitcherSelect.append($('<option value="' + floors[index] + '">' + floors[index] + '</option>'))
    }
    floorSwitcherSelect.click(function () {
        loadNthFloorFunction(floorSwitcherSelect.val(), firstFloorLayerGroup.toGeoJSON(), firstFloorLayerGroup)
    })
}

function layerSwitcher(element, layer) {
    if (typeof layer === 'undefined') return;
    if (element.prop('checked')) {
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
            $('#' + layer.categories[i] + "Switch")
                .prop('checked', element.prop('checked'))
                .change();
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
    var parentDiv = $('#carsPerHuman');

    if (map.hasLayer(carsLayerGroup) || map.hasLayer(carsDayLayerGroup) || map.hasLayer(carsNightLayerGroup)) {
        parentDiv.css('display', 'block');
    }
    else {
        parentDiv.css('display', 'none');
    }

    for (var index in carsLayerGroups) {
        if (map.hasLayer(carsLayerGroups[index])) {
            $('#' + carsLayerGroups[index].name + 'PerHumanStat').css('display', 'block');
        }
        else {
            $('#' + carsLayerGroups[index].name + 'PerHumanStat').css('display', 'none');
        }
    }
}

function loadCarsPerPopulation() {
    var carsLayerGroups = [carsLayerGroup, carsDayLayerGroup, carsNightLayerGroup];

    var parentDiv = $('#carsPerHuman');

    for (var index in carsLayerGroups) {
        var layerGroup = carsLayerGroups[index];
        var count = layerGroup.getLayers().length;
        var stat = $('#' + layerGroup.name + 'PerHumanStat');
        if (stat.length == 0) {
            stat = $('<p></p>').attr('id', layerGroup.name + 'PerHumanStat');
            parentDiv.append(stat);
        }
        stat.html(i18n(layerGroup.name) + ': ' + (count / POPULATION).toFixed(3));
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
                if (map.hasLayer(layer)) {
                    // console.log(layer);
                    layer.bringToFront()
                }
            });
            $('#' + layerGroups[i].name + "Switch").prop('checked', true);
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
    var parentElement = $("#populationData").html('');
    for (var i = 0; i < areaByPopulationData.length; i++) {
        var currElement = $('<p></p>').html(i18n(areaByPopulationData[i].name) + ": " + areaByPopulationData[i].areaPerHuman.toFixed(4) + " кв.м.");
        parentElement.append(currElement)
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

function buildingEditor() {
    if (typeof selectedLayer === 'undefined') return;
    var parent = $('#editForm');
    console.log(parent);
    parent.html('');
    var info = $('<p></p>');
    info.html('Вулиці: ')
    for (var index in selectedLayer.feature.properties.streets) {
        info.html(info.html() + ' ' + i18n(selectedLayer.feature.properties.streets[index]) + ((selectedLayer.feature.properties.streets.length - index > 1) ? ',' : '<br> '));
    }
    for (var key in selectedLayer.feature.properties.floors) {
        info.html(info.html() + key + ': ' + i18n(selectedLayer.feature.properties.floors[key]) + '<br>');
    }
    var fields = $('<div id="fields"></div>');
    var floorField = $('<input type="text" id="floorNumber">');
    var categorySelect = $('<select id="categorySelect" class="form-group"></select>');
    for (var index in firstFloorLayerGroup.categories) {
        categorySelect.append($('<option value="' + firstFloorLayerGroup.categories[index] + '">' + i18n(firstFloorLayerGroup.categories[index]) + '</option>'))
    }
    var approveButton = $('<button class="btn btn-default">Додати</button>').click(function () {
        selectedLayer.feature.properties.floors[Number($('#floorNumber').val())] = $('#categorySelect').val();
        loadFloorSwitch();
        buildingEditor();
    });
    var saveButton = $('<button class="btn btn-default">Зберегти</button>').click(function () {
        var data = JSON.stringify(firstFloorLayerGroup.toGeoJSON());
        var url = 'data:text/json;charset=utf8,' + data;
        window.open(url, '_blank');
        window.focus();
    });
    fields.append(floorField)
        .append(categorySelect)
        .append(approveButton);
    parent.append(info)
        .append(fields)
        .append(saveButton);
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