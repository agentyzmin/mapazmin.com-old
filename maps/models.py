from __future__ import unicode_literals

from django.db import models

# Create your models here.

class SensorData(models.Model):
    data = models.CharField(max_length=200)
    time = models.DateTimeField()
