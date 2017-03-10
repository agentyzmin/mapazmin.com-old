from __future__ import unicode_literals

from django.db import models


# Create your models here.

class SensorData(models.Model):
    data = models.CharField(max_length=200)
    time = models.DateTimeField()


class CarData(models.Model):
    max_height = models.IntegerField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    time_received = models.DateTimeField()
    bat = models.IntegerField()
