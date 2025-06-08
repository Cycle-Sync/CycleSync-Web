from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    ProfileViewSet,
    DailyEntryViewSet,
    CycleViewSet,
    PredictionViewSet,
    CalendarView,
    DashboardView,
    RegisterView,
)

router = DefaultRouter()
router.register(r'profiles', ProfileViewSet, basename='profile')
router.register(r'daily-entries', DailyEntryViewSet, basename='dailyentry')
router.register(r'cycles', CycleViewSet, basename='cycle')
router.register(r'predictions', PredictionViewSet, basename='prediction')
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # custom endpoints
    path('calendar/', CalendarView.as_view(), name='calendar'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
]
