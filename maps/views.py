# coding=utf-8

from django.http import HttpResponseRedirect
from django.http import JsonResponse
from django.shortcuts import render
from django.http import HttpResponse
import requests
import pandas as pd
import os
import locale

from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

import metrotimer


# Create your views here.
def index(request):
    return leaflet(request)


def leaflet(request):
    return render(request, 'leaflet.html')


def svgswitcher(request):
    return render(request, 'svgswitcher.html')


def pedestrian(request):
    return render(request, 'pedestrian.html')


def get_metrotimer(request):
    # locale.setlocale(locale.LC_ALL,'uk_ua.cp1251')
    stations = metrotimer.get_all_stations_ukr()
    context = {
        'stationsUK': sorted(stations.values()),
        'stationsEN': sorted(stations.keys())
    }
    return render(request, 'metrotimer.html', context)

@csrf_exempt
def post_metrotimer(request):
    origin_station = request.POST['station']
    times_en = metrotimer.get_all_times(origin_station)
    times_ua = dict()
    stations_ua = metrotimer.get_all_stations_ukr()
    for key in times_en:
        times_en[key] = str(int(times_en[key] / 60)) + '.' + str(times_en[key] % 60)
        times_ua[stations_ua[key]] = times_en[key]
    response = JsonResponse({'times_en': sorted(times_en.items()), 'times_ua': sorted(times_ua.items())})

    return response
