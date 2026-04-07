from django.db import models
from fleet.models import Truck
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Trip(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('RUNNING', 'Running'),
        ('COMPLETED', 'Completed'),
    )

    truck = models.ForeignKey(Truck, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    start_location = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    distance_km = models.FloatField()

    revenue = models.FloatField()  # ✅ NEW

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='PENDING'
    )
    created_at = models.DateTimeField(auto_now_add=True)

class Expense(models.Model):
    CATEGORY_CHOICES = (
        ('FUEL', 'Fuel'),
        ('TOLL', 'Toll'),
        ('FOOD', 'Food'),
        ('MAINTENANCE', 'Maintenance'),
        ('INSURANCE', 'Insurance'),
        ('EMI', 'EMI'),
        ('SALARY', 'Salary'),
        ('REPAIR', 'Repair'),
        ('MISC', 'Miscellaneous'),
    )

    amount = models.FloatField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.CharField(max_length=100)

    trip = models.ForeignKey(
        Trip,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="expenses"
    )

    truck = models.ForeignKey(
        Truck,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(auto_now_add=True)
