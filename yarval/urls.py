"""yarval URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin

admin.autodiscover()
import maps.views

urlpatterns = [
    url(r'^$', maps.views.index, name='index'),
    url(r'^trees$', maps.views.googlemapstrees, name='trees'),
    url(r'^cars$', maps.views.cars, name='cars'),
    url(r'^carsandtrees$', maps.views.carsandtrees, name='carsandtrees'),
    url(r'^houses$', maps.views.houses, name='houses'),
    url(r'^united$', maps.views.united, name='united'),
    url(r'^leaflet$', maps.views.leaflet, name='leaflet'),
    url(r'^svgswitcher$', maps.views.svgswitcher, name='svgswitcher'),
    url(r'^trees_json$', maps.views.trees_json, name='trees_json'),
    url(r'^cars_json$', maps.views.cars_json, name='cars_json'),
    url(r'^houses_json$', maps.views.houses_json, name='houses_json'),
    url(r'^roads_json$', maps.views.roads_json, name='roads_json'),
    url(r'^yards_json$', maps.views.yards_json, name='yards_json'),
    url(r'^floor1_json$', maps.views.floor1_json, name='floor1_json'),
    url(r'^cars_day_json$', maps.views.cars_day_json, name='cars_day_json'),
    url(r'^cars_night_json$', maps.views.cars_night_json, name='cars_night_json'),
    url(r'^admin/', include(admin.site.urls)),
]
