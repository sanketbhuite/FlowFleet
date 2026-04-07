from rest_framework import viewsets, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from .models import LocationUpdate
from .serializers import LocationUpdateSerializer
from fleet.models import Truck

class LocationUpdateViewSet(viewsets.ModelViewSet):
    serializer_class = LocationUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # Owner sees locations of their trucks
        if user.role == 'OWNER':
            return LocationUpdate.objects.filter(truck__owner=user).order_by('-timestamp')

        # Driver sees locations of assigned truck
        return LocationUpdate.objects.filter(truck__assigned_driver=user).order_by('-timestamp')

    def perform_create(self, serializer):
        user = self.request.user

        if user.role != 'DRIVER':
            raise PermissionDenied("Only drivers can send location updates")

        truck = serializer.validated_data['truck']

        # Driver can only update their assigned truck
        if truck.assigned_driver != user:
            raise PermissionDenied("You are not assigned to this truck")

        serializer.save()
