# coding=utf-8
from ast import literal_eval
from datetime import datetime
import time
import pytz
from django.http import JsonResponse
from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
from django.views.decorators.csrf import csrf_exempt

from maps.models import CarData, PollutionConfig, Pollution


def index(request):
    return leaflet(request)


def leaflet(request):
    return render(request, 'leaflet.html')


def dynamic(request):
    return render(request, 'dynamic.html')


def svgswitcher(request):
    return render(request, 'svgswitcher.html')


def pedestrian(request):
    return render(request, 'pedestrian.html')


def time_now(request):
    return JsonResponse({'now': int(time.time())})


def get_latest_pollution_config():
    configs = PollutionConfig.objects.all().order_by('-added')
    for config in configs:
        if config.valid_since < datetime.now(tz=pytz.utc) and (
                    not config.valid_to or config.valid_to > datetime.now(pytz.utc)):
            return config
    new_configs = PollutionConfig()
    new_configs.save()
    return new_configs


@csrf_exempt
def receive_sensor_data(request):
    try:
        data_dict = literal_eval(request.GET['data'])
        pollution = Pollution(co2=data_dict['CO2'], smoke=data_dict['smoke'], noise=data_dict['noise'],
                              bat=data_dict['bat'], received=datetime.now(tz=pytz.utc))
        pollution.save()
    except:
        return JsonResponse({'error': 'Wrong data sent'})
    sensor_config = get_latest_pollution_config()
    return HttpResponse('noise_refresh_ms:' + str(sensor_config.noise_refresh_ms)
                        + '|upload_refresh_s:' + str(sensor_config.upload_refresh_s)
                        + '|co2_refresh_s:' + str(sensor_config.co2_refresh_s)
                        + '|smoke_refresh_ms:' + str(sensor_config.smoke_refresh_ms))


def parse_car_data(raw_data):
    raw_data = raw_data.translate('\n')
    rows = raw_data.split(',')
    base_time = rows[0]
    result = []
    for row in rows[1:]:
        row_list = row.split('|')
        if len(row_list) < 4: continue
        max_height = row_list[1]
        start_time = datetime.fromtimestamp((int(base_time) + int(row_list[2])) / 1000.0)
        end_time = datetime.fromtimestamp((int(base_time) + int(row_list[3])) / 1000.0)
        result.append({
            'max_height': max_height,
            'start_time': start_time,
            'end_time': end_time
        })
    return result


@csrf_exempt
def receive_car_data(request):
    try:
        data = request.POST['data']
        bat = request.GET['bat']
    except:
        return JsonResponse({'error': 'No data sent'})
    entries = parse_car_data(data)
    time_received = datetime.now(tz=pytz.utc)
    for entry in entries:
        car_data = CarData(max_height=entry['max_height'],
                           start_time=entry['start_time'],
                           end_time=entry['end_time'],
                           time_received=time_received,
                           bat=bat)
        car_data.save()
    return HttpResponse()


def get_sensor_data(request):
    last_config = get_latest_pollution_config()
    context = {
        'config': last_config
    }
    return render(request, 'sensorData.html', context=context)


def get_car_data(request):
    entries = CarData.objects.order_by('-time_received')
    for entry in entries:
        entry.time_diff = entry.end_time - entry.start_time
    context = {
        'entries': entries
    }
    return render(request, 'carData.html', context)


def get_sensor_json(request):
    result = []
    for pollution in Pollution.objects.all().order_by('-received'):
        result.append({
            'id': pollution.id,
            'time': pollution.received,
            'data': {
                'CO2': pollution.co2,
                'smoke': pollution.smoke,
                'noise': pollution.noise,
                'bat': pollution.bat
            }
        })
    return JsonResponse({'result': result})


@csrf_exempt
def post_geojson(request):
    try:
        data = request.POST['geojson']
    except:
        return JsonResponse({'error': 'No data sent'})
    with open('maps/static/geoJSON/firstFloorFunctionGeo.json.geojson', 'w') as outfile:
        outfile.write(data)
    return HttpResponse()


def get_geojson(request):
    with open('maps/static/geoJSON/firstFloorFunctionGeo.json.geojson', 'r') as infile:
        data = infile.read()
    return HttpResponse(data)
