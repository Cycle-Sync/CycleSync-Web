from django.urls import path
from .views import*
from .forms import FORMS
urlpatterns = [
    path('',home, name='home'),
    #path('signup/', views.signup, name='signup'),
    path('login/', login_view, name='login'),
    path('logout/',logout_view, name='logout'),
    path('dashboard/', dashboard, name='dashboard'),
    path('signup/', SignupWizard.as_view(), name='signup'),
    path('ajax/validate-username/', validate_username, name='validate_username'),
    #path('log_cycle/', log_cycle, name='log_cycle'),
    path('calendar/', calendar_view, name='calendar'),
    path('daily-log/', daily_log, name='daily_log'),
    path('beads_view/', beads_view, name='beads_view'),
    path('profile/', profile_view, name='profile'),
]