from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Truck(models.Model):
    truck_number = models.CharField(max_length=20, unique=True)
    model = models.CharField(max_length=50)
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="owned_trucks"
    )
    assigned_driver = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_trucks"
    )

    def __str__(self):
        return self.truck_number
