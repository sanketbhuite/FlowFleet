from rest_framework import viewsets, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import models
from .models import Trip
from .serializers import TripSerializer
from fleet.models import Truck
from .models import Expense
from .serializers import ExpenseSerializer



class TripViewSet(viewsets.ModelViewSet):
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # Owner sees their trips
        if user.role == 'OWNER':
            return Trip.objects.filter(owner=user)

        # Driver sees trips for assigned trucks
        return Trip.objects.filter(truck__assigned_driver=user)

    def perform_create(self, serializer):
        user = self.request.user

        if user.role != 'OWNER':
            raise PermissionDenied("Only owners can create trips")

        truck = serializer.validated_data['truck']

        # Owner can only create trips for own trucks
        if truck.owner != user:
            raise PermissionDenied("You do not own this truck")

        serializer.save(owner=user)

    @action(detail=True, methods=['patch'], url_path='start')
    def start_trip(self, request, pk=None):
        trip = self.get_object()

        if request.user.role != 'DRIVER':
            raise PermissionDenied("Only drivers can start trips")

        trip.status = 'RUNNING'
        trip.save()

        return Response({"message": "Trip started"})

    @action(detail=True, methods=['patch'], url_path='complete')
    def complete_trip(self, request, pk=None):
        trip = self.get_object()

        if request.user.role != 'DRIVER':
            raise PermissionDenied("Only drivers can complete trips")

        trip.status = 'COMPLETED'
        trip.save()

        return Response({"message": "Trip completed"})
    
    @action(detail=True, methods=['get'], url_path='profit')
    def trip_profit(self, request, pk=None):
        trip = self.get_object()

        if request.user.role != "OWNER":
            raise PermissionDenied("Only owners can view profit")

        total_expenses = trip.expenses.aggregate(
            total=Sum('amount')
        )['total'] or 0

        profit = trip.revenue - total_expenses

        return Response({
            "trip_id": trip.id,
            "revenue": trip.revenue,
            "expenses": total_expenses,
            "profit": profit
        })



class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == "OWNER":
            return Expense.objects.filter(
                models.Q(trip__owner=user) |
                models.Q(truck__owner=user) |
                models.Q(created_by=user)
            )

        if user.role == "DRIVER":
            return Expense.objects.filter(created_by=user)

        raise PermissionDenied("Invalid role")

    def perform_create(self, serializer):
        user = self.request.user

        trip = serializer.validated_data.get("trip")

        # Driver rules
        if user.role == "DRIVER":
            if not trip or trip.status != "RUNNING":
                raise PermissionDenied("Drivers can add expenses only during running trip")
            serializer.save(created_by=user)

        # Owner rules
        elif user.role == "OWNER":
            serializer.save(created_by=user)

        else:
            raise PermissionDenied("Invalid role")
