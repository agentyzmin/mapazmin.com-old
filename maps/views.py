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

