from django.db import models
from fleet.models import Truck

class LocationUpdate(models.Model):
    truck = models.ForeignKey(Truck, on_delete=models.CASCADE)
    latitude = models.FloatField()
    longitude = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.truck.truck_number} @ {self.latitude},{self.longitude}"
