from rest_framework import serializers
from .models import Truck
from users.models import User

class TruckSerializer(serializers.ModelSerializer):
    assigned_driver = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='DRIVER'),
        required=False
    )

    class Meta:
        model = Truck
        fields = '__all__'
        read_only_fields = ('owner',)
