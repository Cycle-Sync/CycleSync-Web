from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from core.views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
# Register your viewsets here if you have any
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('auth/token/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),#for api users
    path('profile/', ProfileView.as_view(), name='profile'),
    path('daily-entry/', DailyEntryView.as_view(), name='daily_entry'),
    path('calendar/', CalendarView.as_view(), name='calendar'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('', include(router.urls)),
]