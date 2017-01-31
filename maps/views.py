from django.shortcuts import render
from django.http import HttpResponse
import requests
import pandas as pd
import os


# Create your views here.
def index(request):
    return leaflet(request)


def googlemapstrees(request):
    return render(request, 'googlemaptrees.html')


def cars(request):
    return render(request, 'cars.html')


def carsandtrees(request):
    return render(request, 'carsandtrees.html')


def houses(request):
    return render(request, 'houses.html')


def united(request):
    return render(request, 'united.html')


def leaflet(request):
    return render(request, 'leaflet.html')


def trees_json(request):
    module_dir = os.path.dirname(__file__)  # get current directory
    file_path = os.path.join(module_dir, 'static/trees_GeoCoo.json')
    with open(file_path) as json_file:
        json_trees = json_file.read()
    return HttpResponse(json_trees, content_type="application/json")


def cars_json(request):
    module_dir = os.path.dirname(__file__)  # get current directory
    file_path = os.path.join(module_dir, 'static/cars_GeoCoo.json')
    with open(file_path) as json_file:
        json_cars = json_file.read()
    return HttpResponse(json_cars, content_type="application/json")


def houses_json(request):
    module_dir = os.path.dirname(__file__)  # get current directory
    file_path = os.path.join(module_dir, 'static/housesGeo.json')
    with open(file_path) as json_file:
        json_houses = json_file.read()
    return HttpResponse(json_houses, content_type="application/json")


def roads_json(request):
    module_dir = os.path.dirname(__file__)  # get current directory
    file_path = os.path.join(module_dir, 'static/roadsGeo.json')
    with open(file_path) as json_file:
        json_roads = json_file.read()
    return HttpResponse(json_roads, content_type="application/json")


def yards_json(request):
    module_dir = os.path.dirname(__file__)  # get current directory
    file_path = os.path.join(module_dir, 'static/yardsGeo.json')
    with open(file_path) as json_file:
        json_yards = json_file.read()
    return HttpResponse(json_yards, content_type="application/json")


def floor1_json(request):
    module_dir = os.path.dirname(__file__)  # get current directory
    file_path = os.path.join(module_dir, 'static/firstFloorFunctionGeo.json')
    with open(file_path) as json_file:
        json_floor1 = json_file.read()
    return HttpResponse(json_floor1, content_type="application/json")


def cars_day_json(request):
    module_dir = os.path.dirname(__file__)  # get current directory
    file_path = os.path.join(module_dir, 'static/Yarvalcars_day_GeoCoo.json')
    with open(file_path) as json_file:
        json_cars_day = json_file.read()
    return HttpResponse(json_cars_day, content_type="application/json")


def cars_night_json(request):
    module_dir = os.path.dirname(__file__)  # get current directory
    file_path = os.path.join(module_dir, 'static/Yarvalcars_night_GeoCoo.json')
    with open(file_path) as json_file:
        json_cars_night = json_file.read()
    return HttpResponse(json_cars_night, content_type="application/json")
