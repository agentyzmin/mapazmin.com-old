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
    url(r'^leaflet$', maps.views.leaflet, name='leaflet'),
    url(r'^svgswitcher$', maps.views.svgswitcher, name='svgswitcher'),
    url(r'^pedestrian$', maps.views.pedestrian, name='pedestrian'),
    url(r'^sensor$', maps.views.receive_sensor_data, name='deviceData'),
    url(r'^car_sensor$', maps.views.receive_car_data, name='carDeviceData'),
    url(r'^sensorData$', maps.views.get_sensor_data, name='seeDeviceData'),
    url(r'^now$', maps.views.time_now, name='now'),
    url(r'^carData$', maps.views.get_car_data, name='seeDeviceData'),
    url(r'^sensor_json$', maps.views.get_sensor_json, name='sensor_json'),
    url(r'^post_geojson$', maps.views.post_geojson, name='post_geojson'),
    url(r'^get_geojson$', maps.views.get_geojson, name='get_geojson'),

    url(r'^admin/', include(admin.site.urls)),
]
