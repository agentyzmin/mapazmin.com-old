# coding=utf-8

from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.http import HttpResponse


# Create your views here.
def index(request):
    return leaflet(request)


def leaflet(request):
    return render(request, 'leaflet.html')


def svgswitcher(request):
    return render(request, 'svgswitcher.html')


def pedestrian(request):
    return render(request, 'pedestrian.html')

