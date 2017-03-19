from __future__ import unicode_literals

from datetime import datetime

from django.db import models


# Create your models here.

class SensorData(models.Model):
    data = models.CharField(max_length=200)
    time = models.DateTimeField()


class Pollution(models.Model):
    co2 = models.IntegerField()
    smoke = models.IntegerField()
    noise = models.IntegerField()
    bat = models.IntegerField()
    received = models.DateTimeField()


class PollutionConfig(models.Model):
    noise_refresh_ms = models.IntegerField(default=300)
    smoke_refresh_ms = models.IntegerField(default=1200)
    upload_refresh_s = models.IntegerField(default=20)
    co2_refresh_s = models.IntegerField(default=60)
    valid_since = models.DateTimeField(default=datetime.now, null=True)
    valid_to = models.DateTimeField(null=True)
    added = models.DateTimeField(default=datetime.now)

    def __str__(self):
        print type(self.noise_refresh_ms)
        return 'noise_refresh_ms: %d smoke_refresh_ms: %d upload_refresh_s: %d co2_refresh_s: %d' % (
            self.noise_refresh_ms, self.smoke_refresh_ms, self.upload_refresh_s, self.co2_refresh_s)


class CarData(models.Model):
    max_height = models.IntegerField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    time_received = models.DateTimeField()
    bat = models.IntegerField()
