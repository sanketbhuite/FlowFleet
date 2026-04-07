from rest_framework.routers import DefaultRouter
from .views import LocationUpdateViewSet

router = DefaultRouter()
router.register(r'locations', LocationUpdateViewSet, basename='location')

urlpatterns = router.urls
