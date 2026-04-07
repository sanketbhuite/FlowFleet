from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.db.models import Sum
from trips.models import Trip, Expense

class BusinessSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role != "OWNER":
            raise PermissionDenied("Only owners can view reports")

        total_revenue = Trip.objects.filter(
            owner=user,
            status="COMPLETED"
        ).aggregate(total=Sum('revenue'))['total'] or 0

        total_expenses = Expense.objects.filter(
            created_by__in=[user]
        ).aggregate(total=Sum('amount'))['total'] or 0

        profit = total_revenue - total_expenses

        return Response({
            "total_revenue": total_revenue,
            "total_expenses": total_expenses,
            "profit": profit
        })
