from rest_framework.routers import DefaultRouter
from .views import TruckViewSet

router = DefaultRouter()
router.register(r'trucks', TruckViewSet, basename='truck')

urlpatterns = router.urls
