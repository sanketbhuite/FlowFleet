from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    UserListView,
    DriverListView
)

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("users/", UserListView.as_view()),
    path("drivers/", DriverListView.as_view()),  # 👈 REQUIRED
]
