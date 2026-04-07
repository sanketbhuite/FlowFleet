from django.urls import path
from .views import BusinessSummaryView

urlpatterns = [
    path("summary/", BusinessSummaryView.as_view()),
]
