# coding=utf-8
from ast import literal_eval
from datetime import datetime
from django.http import HttpResponseRedirect
from django.http import JsonResponse
from django.shortcuts import render
from django.http import HttpResponse
from django.core import serializers

# Create your views here.
from django.views.decorators.csrf import csrf_exempt
from geojson_saver import save_geojson

from maps.models import SensorData


def index(request):
    return leaflet(request)


def leaflet(request):
    return render(request, 'leaflet.html')


def svgswitcher(request):
    return render(request, 'svgswitcher.html')


def pedestrian(request):
    return render(request, 'pedestrian.html')


@csrf_exempt
def receiveDataFromDevice(request):
    try:
        data = request.GET['data']
    except:
        return JsonResponse({'error': 'No data sent'})
    sensorData = SensorData()
    sensorData.data = data
    sensorData.time = datetime.now()
    sensorData.save()
    return HttpResponse()


def getSensorData(request):
    context = {
        'entries': SensorData.objects.order_by('-time')[:100]
    }
    return render(request, 'sensorData.html', context)


def get_sensor_json(request):
    result = []
    for sensorData in SensorData.objects.all():
        data = literal_eval(sensorData.data)
        try:
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
