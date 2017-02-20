var map;
var layerGroups;
var areaDataCharts;
var pieChart, barChart, hbarChart;
var streetCharts = {};
var fffCharts = {};
var treesCharts = {};

var AREA_DIVISOR = 0;
var POPULATION = 9000;
var COLORS = {
    "roads": '#6D6D6D',
    "yards": '#fcde60',
    "buildings": '#C9CFD2',
    "firstFloorFunction": "#9463C2",
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

initMap();
