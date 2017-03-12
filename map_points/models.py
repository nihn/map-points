from django.db import models


class MapPoint(models.Model):
    lng = models.FloatField()
    lat = models.FloatField()
    address = models.CharField(max_length=124)
