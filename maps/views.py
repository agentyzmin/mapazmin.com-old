# coding=utf-8
from ast import literal_eval
from datetime import datetime
import time
import pytz
from django.http import HttpResponseRedirect
from django.http import JsonResponse
from django.shortcuts import render
from django.http import HttpResponse
from django.core import serializers

# Create your views here.
from django.views.decorators.csrf import csrf_exempt
from geojson_saver import save_geojson

from maps.models import SensorData, CarData, PollutionConfig, Pollution


def index(request):
    return leaflet(request)


def leaflet(request):
    return render(request, 'leaflet.html')


def svgswitcher(request):
    return render(request, 'svgswitcher.html')


def pedestrian(request):
    return render(request, 'pedestrian.html')


def time_now(request):
    return JsonResponse({'now': int(time.time())})


@csrf_exempt
def receive_sensor_data(request):
    try:
        data_dict = literal_eval(request.GET['data'])
        pollution = Pollution(co2=data_dict['CO2'], smoke=data_dict['smoke'], noise=data_dict['noise'],
                              received=datetime.now(tz=pytz.utc))
        pollution.save()
    except:
        return JsonResponse({'error': 'Wrong data sent'})
    sensor_config = PollutionConfig.objects.all().order_by('-added')[0]
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
    print 'Received data:' + data
    print bat
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
    # ?noise_refresh_ms=300&smoke_refresh_ms=1200&upload_refresh_s=20&co2_refresh_s=60
    config = PollutionConfig()
    config_received = False
    try:
        if 'noise_refresh_ms' in request.GET:
            config.noise_refresh_ms = int(request.GET['noise_refresh_ms'])
            config_received = True
        if 'smoke_refresh_ms' in request.GET:
            config.smoke_refresh_ms = int(request.GET['smoke_refresh_ms'])
            config_received = True
        if 'upload_refresh_s' in request.GET:
            config.upload_refresh_s = int(request.GET['upload_refresh_s'])
            config_received = True
        if 'co2_refresh_s' in request.GET:
            config.co2_refresh_s = int(request.GET['co2_refresh_s'])
            config_received = True
        if config_received:
            config.added = datetime.now(tz=pytz.utc)
            config.save()
    except:
        pass
    last_config = PollutionConfig.objects.all().order_by('-added')[0]
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
    for sensorData in SensorData.objects.all():
        try:
            data = literal_eval(sensorData.data)
            if 'bat' not in data:
                data['bat'] = 100
            if 'noise' in data and 'smoke' in data and 'CO2' in data:
                result.append({
                    'id': sensorData.id,
                    'time': sensorData.time,
                    'data': data
                })
        except:
            pass
    for pollution in Pollution.objects.all():
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
    save_geojson(data)
    return HttpResponse()
