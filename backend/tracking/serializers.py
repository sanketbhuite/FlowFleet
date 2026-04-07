from rest_framework import serializers
from .models import LocationUpdate

class LocationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationUpdate
        fields = '__all__'
        read_only_fields = ('timestamp',)
