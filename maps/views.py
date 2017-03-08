# coding=utf-8
from ast import literal_eval
from datetime import datetime
import time
from django.http import HttpResponseRedirect
from django.http import JsonResponse
from django.shortcuts import render
from django.http import HttpResponse
from django.core import serializers

# Create your views here.
from django.views.decorators.csrf import csrf_exempt
from geojson_saver import save_geojson

from maps.models import SensorData, CarData


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
def receiveDataFromDevice(request):
    try:
        data = request.GET['data']
    except:
        return JsonResponse({'error': 'No data sent'})
    sensor_data = SensorData()
    sensor_data.data = data
    sensor_data.time = datetime.now()
    sensor_data.save()
    return HttpResponse()


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
    except:
        return JsonResponse({'error': 'No data sent'})
    print data
    entries = parse_car_data(data)
    for entry in entries:
        car_data = CarData(max_height=entry['max_height'],
                           start_time=entry['start_time'],
                           end_time=entry['end_time'],
                           time_received=datetime.now())
        car_data.save()
    return HttpResponse()


def get_sensor_data(request):
    context = {
        'entries': SensorData.objects.order_by('-time')[:100]
    }
    return render(request, 'sensorData.html', context)


def get_car_data(request):
    context = {
        'entries': CarData.objects.order_by('-time_received')
    }
    return render(request, 'carData.html', context)


def get_sensor_json(request):
    result = []
    for sensorData in SensorData.objects.all():
        data = literal_eval(sensorData.data)
        try:
            if 'bat' not in data:
                data['bat'] = 100
            if 'noise' in data and 'smoke' in data and 'CO2' in data:
                result.append({
                    'id': sensorData.id,
                    'time': sensorData.time,
                    'data': data
                })
        except TypeError:
            pass
    return JsonResponse({'result': result})


@csrf_exempt
def post_geojson(request):
    try:
        data = request.POST['geojson']
    except:
        return JsonResponse({'error': 'No data sent'})
    print data
    save_geojson(data)
    return HttpResponse()
