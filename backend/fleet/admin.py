from django.contrib import admin
from .models import Truck

@admin.register(Truck)
class TruckAdmin(admin.ModelAdmin):
    list_display = ('truck_number', 'model', 'owner', 'assigned_driver')
    search_fields = ('truck_number',)
