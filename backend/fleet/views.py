from rest_framework.decorators import action
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from users.models import User
from .models import Truck
from .serializers import TruckSerializer
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

@method_decorator(csrf_exempt, name='dispatch')
class TruckViewSet(viewsets.ModelViewSet):
    serializer_class = TruckSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'OWNER':
            return Truck.objects.filter(owner=user)
        return Truck.objects.filter(assigned_driver=user)

    def perform_create(self, serializer):
        if self.request.user.role != 'OWNER':
            raise PermissionDenied("Only owners can add trucks")
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['patch'], url_path='assign-driver')
    def assign_driver(self, request, pk=None):
        user = request.user

        if user.role != 'OWNER':
            raise PermissionDenied("Only owners can assign drivers")

        truck = self.get_object()
        driver_id = request.data.get('driver_id')

        try:
            driver = User.objects.get(id=driver_id, role='DRIVER')
        except User.DoesNotExist:
            return Response(
                {"error": "Invalid driver ID"},
                status=status.HTTP_400_BAD_REQUEST
            )

        truck.assigned_driver = driver
        truck.save()

        return Response(
            {"message": "Driver assigned successfully"},
            status=status.HTTP_200_OK
        )
    @action(detail=True, methods=['get'], url_path='profit')
    def truck_profit(self, request, pk=None):
        truck = self.get_object()
        user = request.user

        if user.role != "OWNER":
            raise PermissionDenied("Only owners can view profit")

        trips = Trip.objects.filter(
            truck=truck,
            status="COMPLETED"
        )

        total_revenue = trips.aggregate(
            total=Sum('revenue')
        )['total'] or 0

        trip_expenses = Expense.objects.filter(
            trip__in=trips
        ).aggregate(total=Sum('amount'))['total'] or 0

        truck_expenses = Expense.objects.filter(
            truck=truck,
            trip__isnull=True
        ).aggregate(total=Sum('amount'))['total'] or 0

        profit = total_revenue - trip_expenses - truck_expenses

        return Response({
            "truck_id": truck.id,
            "total_revenue": total_revenue,
            "trip_expenses": trip_expenses,
            "truck_expenses": truck_expenses,
            "profit": profit
        })
