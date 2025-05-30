from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from core.views import RegisterView, LoginView, LogoutView, ProfileView, DailyEntryView, CalendarView, DashboardView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/profile/', ProfileView.as_view(), name='profile'),
    path('api/daily-entry/', DailyEntryView.as_view(), name='daily_entry'),
    path('api/calendar/', CalendarView.as_view(), name='calendar'),
    path('api/dashboard/', DashboardView.as_view(), name='dashboard'),
    path('api-auth/', include('rest_framework.urls')),  # Optional for browsable API
]