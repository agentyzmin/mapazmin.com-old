# coding=utf-8
from datetime import datetime
from django.http import HttpResponseRedirect
from django.http import JsonResponse
from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
from django.views.decorators.csrf import csrf_exempt

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
        data = request.POST['data']
    except:
        return JsonResponse({'error': 'No data sent'})
    sensorData = SensorData()
    sensorData.data = data
    sensorData.time = datetime.now()
    sensorData.save()
    return HttpResponse()


def getSensorData(request):
    context = {
        'entries': SensorData.objects.order_by('time')[:10]
    }
    return render(request, 'sensorData.html', context)
