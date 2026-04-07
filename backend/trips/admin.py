from django.contrib import admin
from .models import Trip, Expense

@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = (
        'truck',
        'owner',
        'start_location',
        'destination',
        'distance_km',
        'revenue',       # ✅ show revenue
        'status',
        'created_at'
    )
    list_filter = ('status',)
    search_fields = ('truck__truck_number',)


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = (
        'trip',
        'truck',
        'category',
        'created_by',    # ✅ correct field
        'amount',
        'created_at'
    )
    list_filter = ('category',)

