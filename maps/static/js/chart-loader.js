/**
 * Created by yurii on 2/19/2017.
 */

function checkLayersForCharts(){

    if (map.hasLayer(facadesLayerGroup) || map.hasLayer(firstFloorLayerGroup) || map.hasLayer(treesLayerGroup)) {
        document.getElementById('streets').style.display = 'block';
    }
    else {
        document.getElementById('streets').style.display = 'none';
    }

    if (map.hasLayer(facadesLayerGroup)) {
        Array.prototype.forEach.call(document.getElementsByClassName('active-facade-chart'), function (element) {
            element.style.display = 'block'
        })
    }
    else {
        Array.prototype.forEach.call(document.getElementsByClassName('active-facade-chart'), function (element) {
            element.style.display = 'none'
        })
    }

    if (map.hasLayer(firstFloorLayerGroup)) {
        Array.prototype.forEach.call(document.getElementsByClassName('fff-chart'), function (element) {
            element.style.display = 'block'
        })
    }
    else {
        Array.prototype.forEach.call(document.getElementsByClassName('fff-chart'), function (element) {
            element.style.display = 'none'
        })
    }

    if (map.hasLayer(treesLayerGroup)) {
        Array.prototype.forEach.call(document.getElementsByClassName('trees-chart'), function (element) {
            element.style.display = 'block'
        })
    }
    else {
        Array.prototype.forEach.call(document.getElementsByClassName('trees-chart'), function (element) {
            element.style.display = 'none'
        })
    }
}

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
        updateDataInChart(pieChart, pieData);
    }

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
                }
            }
        });
    }
    else {
        updateDataInChart(barChart, pieData);
    }

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
                }
            }
        });
    }
    else {
        updateDataInChart(hbarChart, pieData);
    }
}

function drawFacadeCharts() {
    var data = loadFacadesByStreet();
    var categories = ['active', 'tolerable', 'monument', 'green',
        'nothing', 'dopey', 'inactive', 'hole'];

    var streets_by_active_length = sortFacadeDataByActiveLength(data);

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
            var streetChartsDIV = document.getElementById(street + 'Block')
            var streetDIV = document.createElement('div');
            streetDIV.className = 'active-facade-chart';
            var streetHeader = document.createElement('h5');
            streetHeader.innerHTML = 'Активні фасади:';
            var canvasDIV = document.createElement('div');
            canvasDIV.style.width = '400px';
            canvasDIV.style.height = '300px';
            var pieCanvas = document.createElement('canvas');
            pieCanvas.style.width = '400px';
            pieCanvas.style.height = '300px';

            streetChartsDIV.appendChild(streetDIV);
            streetDIV.appendChild(streetHeader);
            streetDIV.appendChild(canvasDIV);
            canvasDIV.appendChild(pieCanvas);

            streetCharts[street] = new Chart(pieCanvas, {
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
            updateDataInChart(streetCharts[street], pieData);
        }
    }
}

function drawFirstFloorFunctionCharts() {
    var data = loadFirstFloorByStreet();

    for (var street in data) {
        var labels = [];
        var datas = [];
        var colors = [];

        var total_length = 0;
        for (var category in data[street]) {
            total_length += data[street][category];
        }

        for (var category in data[street]) {
            labels.push(i18n(category) + '(%)');
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
        };

        if (typeof fffCharts[street] === 'undefined') {
            var streetChartsDIV = document.getElementById(street + 'Block');
            var streetfffDIV = document.createElement('div');
            streetfffDIV.className = 'fff-chart';
            var streetHeader = document.createElement('h5');
            streetHeader.innerHTML = "Функція першого поверху(за довжиною фасаду):";
            var canvasDIV = document.createElement('div');
            canvasDIV.style.width = '400px';
            canvasDIV.style.height = '300px';
            var pieCanvas = document.createElement('canvas');
            pieCanvas.style.width = '400px';
            pieCanvas.style.height = '300px';

            streetChartsDIV.appendChild(streetfffDIV);
            streetfffDIV.appendChild(streetHeader);
            streetfffDIV.appendChild(canvasDIV);
            canvasDIV.appendChild(pieCanvas);

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

function drawTreesCharts() {
    var data = loadTreesAreaByStreet();
    for (var street in data) {
        var labels = [];
        var datas = [];
        var colors = [];

        treesCOLORS = {1: '#64B6AC', 2: '#C0FDFB', 3: '#DAFFEF'};

        for (var category in data[street]) {
            labels.push(category);
            datas.push(data[street][category]);
            colors.push(treesCOLORS[category])
        }

        var pieData = {
            labels: labels,
            datasets: [
                {
                    data: datas,
                    backgroundColor: colors
                }
            ]
        };

        if (typeof treesCharts[street] === 'undefined') {
            var streetChartsDIV = document.getElementById(street + 'Block');
            var streetTreesDIV = document.createElement('div');
            streetTreesDIV.className = 'trees-chart';
            var streetHeader = document.createElement('h5');
            streetHeader.innerHTML = 'Дерева(за розміром крони):';
            var canvasDIV = document.createElement('div');
            canvasDIV.style.width = '400px';
            canvasDIV.style.height = '300px';
            var pieCanvas = document.createElement('canvas');
            pieCanvas.style.width = '400px';
            pieCanvas.style.height = '300px';

            streetChartsDIV.appendChild(streetTreesDIV);
            streetTreesDIV.appendChild(streetHeader);
            streetTreesDIV.appendChild(canvasDIV);
            canvasDIV.appendChild(pieCanvas);

            treesCharts[street] = new Chart(pieCanvas, {
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
            updateDataInChart(treesCharts[street], pieData)
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

