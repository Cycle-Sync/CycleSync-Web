from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from .models import *
from .forms import *
from django.contrib import messages
#from .utils import load_global_model, save_user_model, update_user_model, predict_next_cycle
#from tensorflow.keras.models import clone_model
import matplotlib.pyplot as plt
from io import BytesIO
import base64
from datetime import date, timedelta
from django.utils import timezone
import calendar
import json
from formtools.wizard.views import SessionWizardView
from django.http import JsonResponse, HttpResponse
from django.utils.safestring import mark_safe
FORMS = [
    ("dob", DateOfBirthForm),
    ("country", CountryForm),
    ("username", UsernameForm),
    ("conditions", ConditionsForm),
    ("ovulation", OvulationForm),
    ("type", CycleTypeForm),
    ("length", CycleLengthForm),
    ("period", PeriodLengthForm),
    ("prefs", PreferencesForm),
]

TEMPLATES = {"*": "core/signup_wizard.html"}
class SignupWizard(SessionWizardView):
    form_list = FORMS
    template_name = "core/signup_wizard.html"

    def done(self, form_list, **kwargs):
        # merge all steps' cleaned_data
        data = {}
        for form in form_list:
            data.update(form.cleaned_data)
        username=data['username']
        if User.objects.filter(username=username).exists():  
           messages.error("Username already taken. Please choose another one.")  
           return redirect('signup')
        # 1) Create the user
        user = User.objects.create_user(
            username=data['username'],
            password=data['password']
        )

        # 2) Create their profile
        profile = Profile.objects.create(
            user=user,
            date_of_birth=data['date_of_birth'],
            country=data['country'],
            last_ovulation=data.get('last_ovulation'),
            cycle_type=data['cycle_type'],
            cycle_length=data.get('cycle_length'),
            period_length=data.get('period_length'),
            preferences=data.get('preferences', [])
        )

        # 3) Assign any medical conditions (if chosen)
        if data.get('conditions'):
            profile.medical_conditions.set(data['conditions'])
            messages.success(self.request, "Profile created successfully!")
        return redirect('login')
@login_required(login_url='login')
def daily_log(request):
    today = date.today()

    # 1) Get the user’s profile (assumes one-to-one always exists)
    try:
        profile = request.user.profile
    except Profile.DoesNotExist:
        return redirect('signup')

    # 2) Get or create today's entry
    entry, _ = DailyEntry.objects.get_or_create(profile=profile, date=today)

    # 3) Bind and validate the form
    if request.method == 'POST':
        form = DailyEntryForm(request.POST, instance=entry)
        if form.is_valid():
            form.save()
            messages.success(request, "Daily log updated successfully!")
            return redirect('daily_log')
        else:
            messages.error(request, "Please correct the errors below.")
    else:
        form = DailyEntryForm(instance=entry)

    # 4) Compute which cycle-day column this is
    if profile.last_ovulation and profile.cycle_length:
        days_since = (today - profile.last_ovulation).days
        day_index  = (days_since % profile.cycle_length) + 1
    else:
        day_index = 1

    # 5) Prepare grouped field lists
    physical_names   = ['cramps', 'bloating', 'tender_breasts', 'headache', 'acne']
    emotional_names  = ['mood', 'stress', 'energy']
    cervical_names   = ['cervical_mucus']
    additional_names = ['sleep_quality', 'libido']

    physical_fields   = [form[f] for f in physical_names]
    emotional_fields  = [form[f] for f in emotional_names]
    cervical_fields   = [form[f] for f in cervical_names]
    additional_fields = [form[f] for f in additional_names]

    return render(request, 'core/daily_log.html', {
        'form': form,
        'today': today,
        'day_index': day_index,
        'physical_fields': physical_fields,
        'emotional_fields': emotional_fields,
        'cervical_fields': cervical_fields,
        'additional_fields': additional_fields,
    })
@login_required(login_url='login')
def profile_view(request):
    profile, created = Profile.objects.get_or_create(user=request.user)
    if request.method == 'POST':
        form = ProfileForm(request.POST, instance=profile)
        if form.is_valid():
            form.save()
            messages.success(request, "Profile updated successfully!")
            return redirect('profile')
        else:
            messages.error(request, "Please fix the errors below.")
    else:
        form = ProfileForm(instance=profile)

    return render(request, 'core/profile.html', {
        'form': form
    })
# AJAX endpoint
def validate_username(request):
    username = request.GET.get('username', None)
    exists = User.objects.filter(username=username).exists()
    return JsonResponse({'available': not exists})
# core/views.py
@login_required(login_url='login')
def calendar_view(request):
    profile    = Profile.objects.get(user=request.user)
    last_end   = profile.last_ovulation
    cycle_len  = profile.cycle_length
    period_len = profile.period_length
    today      = date.today()

    # 1) Cycle start
    days_since  = (today - last_end).days
    cycle_index = max(0, days_since // cycle_len)
    cycle_start = last_end + timedelta(days=cycle_index * cycle_len)
    #just_ended = (today == cycle_end + timedelta(days=1))


    # 2) Build days_list with new_month flag
    days_list = []
    ov_offset = cycle_len // 2
    prev_month = None
    for offset in range(cycle_len):
        d = cycle_start + timedelta(days=offset)
        # mark new month
        is_new_month = (d.month != prev_month)
        prev_month = d.month
         # compute angle around circle
        angle = (360.0 / cycle_len) * offset
        # determine phase
        if offset < period_len:
            phase = 'period'
        elif offset < ov_offset - 5:
            phase = 'follicular'
        elif offset < ov_offset:
            phase = 'fertile'
        elif offset == ov_offset:
            phase = 'ovulation'
        else:
            phase = 'luteal'

        days_list.append({
            'date'      : d,
            'day_num'   : offset + 1,
            'phase'     : phase,
            'is_past'   : d < today,
            'is_today'  : d == today,
            'new_month' : is_new_month,
            'angle'     : angle,  # NEW'
        })

    # 3) (Optional) build events_json...
    events = []

    return render(request, 'core/calendar.html', {
        'events_json': mark_safe(json.dumps(events)),
        'days_list'  : days_list,
    })
@login_required(login_url='login')
def beads_view(request):
    profile    = Profile.objects.get(user=request.user)
    last_end   = profile.last_ovulation
    cycle_len  = profile.cycle_length
    period_len = profile.period_length
    today      = date.today()

    # 1) Determine the start of the current cycle
    days_since  = (today - last_end).days
    cycle_index = max(0, days_since // cycle_len)
    cycle_start = last_end + timedelta(days=cycle_index * cycle_len)

    # 2) Determine days in this month
    year, month = today.year, today.month
    _, days_in_month = calendar.monthrange(year, month)
    bead_list = []

    for day in range(1, days_in_month + 1):
        d = date(year, month, day)
        offset = (d - cycle_start).days
        # Only map phases if within the cycle window
        if 0 <= offset < cycle_len:
            if offset < period_len:
                phase = 'period'
            elif offset < (cycle_len//2 - 5):
                phase = 'follicular'
            elif offset < cycle_len//2:
                phase = 'fertile'
            elif offset == cycle_len//2:
                phase = 'ovulation'
            else:
                phase = 'luteal'
        else:
            phase = 'offcycle'  # neutral color

        # compute angle for this day around the circle
        angle = 360.0 * (day - 1) / days_in_month

        bead_list.append({
            'date'     : d,
            'day_num'  : day,
            'phase'    : phase,
            'is_today' : (d == today),
            'angle'    : angle,
        })

    # (You can still build events_json for the left calendar here…)

    return render(request, 'core/calendar.html', {
        'events_json': mark_safe(json.dumps([])),
        'days_list'  : bead_list,
        # plus your existing calendar context…
    })
import math
from django.shortcuts import render
@login_required(login_url='login')
def dashboard(request):
    # Days 1–30
    days = list(range(1, 31))

    # Compute hormone levels with Gaussian-like curves
    fsh = [5 + 2 * math.exp(-((d-1)/5)**2) + 0.5 * math.sin(d/30*2*math.pi) for d in days]
    lh = [1 + 10 * math.exp(-((d-14)/1.5)**2) for d in days]
    estradiol = [5 + 8 * math.exp(-((d-12)/3)**2) + 2 * math.exp(-((d-21)/4)**2) for d in days]
    progesterone = [1 + 5 * math.exp(-((d-21)/3)**2) for d in days]

    context = {
        'days': days,
        'fsh': fsh,
        'lh': lh,
        'estradiol': estradiol,
        'progesterone': progesterone,
    }
    return render(request, 'core/dashboard.html', context)

# Landing page
def home(request):
    return render(request, 'core/home.html')
# Login view
def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('/')
    else:
        form = AuthenticationForm()
    return render(request, 'core/login.html', {'form': form})

# Logout view
@login_required(login_url='login')
def logout_view(request):
    logout(request)
    return redirect('/')

# Dashboard view
# @login_required(login_url='login')
# def dashboard(request):
#     cycles = Cycle.objects.filter(user=request.user).order_by('start_date')
#     start_dates = [cycle.start_date for cycle in cycles]
#     cycle_lengths = [(start_dates[i+1] - start_dates[i]).days for i in range(len(start_dates)-1)] if len(start_dates) > 1 else []
#     current_cycle_day = None
#     predicted_date = None
#     plot_image = None

#     # Calculate current cycle day
#     if cycles:
#         last_start = max(c.start_date for c in cycles if c.start_date <= date.today())
#         current_cycle_day = (date.today() - last_start).days + 1

#     # Generate plot and prediction
#     if cycle_lengths:
#         plot_image = generate_plot(cycle_lengths)
#         if len(cycle_lengths) >= 3:  # Minimum for prediction
#             predicted_date = predict_next_cycle(request.user.id, cycle_lengths, start_dates[-1])

#     return render(request, 'core/dashboard.html', {
#         'cycles': cycles,
#         'cycle_lengths': cycle_lengths,
#         'current_cycle_day': current_cycle_day,
#         'predicted_date': predicted_date,
#         'plot_image': plot_image
#     })

# Log cycle view
# @login_required(login_url='login')
# def log_cycle(request):
#     if request.method == 'POST':
#         form = CycleForm(request.POST)
#         if form.is_valid():
#             cycle = form.save(commit=False)
#             cycle.user = request.user
#             cycle.save()
#             update_user_model(request.user.id)
#             return redirect('dashboard')
#     else:
#         form = CycleForm()
#     return render(request, 'core/log_cycle.html', {'form': form})

# # Helper function to generate plot
# def generate_plot(cycle_lengths):
#     plt.figure(figsize=(8, 4))
#     plt.plot(cycle_lengths, marker='o')
#     plt.title('Cycle Lengths')
#     plt.xlabel('Cycle')
#     plt.ylabel('Length (days)')
#     buf = BytesIO()
#     plt.savefig(buf, format='png')
#     buf.seek(0)
#     image_base64 = base64.b64encode(buf.read()).decode('utf-8')
#     buf.close()
#     plt.close()
#     return image_base64