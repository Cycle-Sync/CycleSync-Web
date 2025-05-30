from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Profile, DailyEntry, Cycle
from .serializers import UserSerializer, ProfileSerializer, DailyEntrySerializer, CycleSerializer
from datetime import date, timedelta
import calendar
import math

# Authentication Views
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        username = data.get('username')
        password = data.get('password')
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(username=username, password=password)
        profile = Profile.objects.create(
            user=user,
            date_of_birth=data.get('date_of_birth'),
            country=data.get('country'),
            last_ovulation=data.get('last_ovulation'),
            cycle_type=data.get('cycle_type', 'unknown'),
            cycle_length=data.get('cycle_length'),
            period_length=data.get('period_length'),
            preferences=data.get('preferences', [])
        )
        if 'medical_conditions' in data:
            profile.medical_conditions.set(data['medical_conditions'])
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)

# Profile View
class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return Profile.objects.get(user=self.request.user)

# Daily Entry View
class DailyEntryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = date.today()
        profile = request.user.profile
        entry, _ = DailyEntry.objects.get_or_create(profile=profile, date=today)
        serializer = DailyEntrySerializer(entry)
        return Response(serializer.data)

    def post(self, request):
        today = date.today()
        profile = request.user.profile
        entry, _ = DailyEntry.objects.get_or_create(profile=profile, date=today)
        serializer = DailyEntrySerializer(entry, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Calendar View
class CalendarView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = request.user.profile
        last_end = profile.last_ovulation
        cycle_len = profile.cycle_length
        period_len = profile.period_length
        today = date.today()

        days_since = (today - last_end).days
        cycle_index = max(0, days_since // cycle_len)
        cycle_start = last_end + timedelta(days=cycle_index * cycle_len)

        days_list = []
        ov_offset = cycle_len // 2
        prev_month = None
        for offset in range(cycle_len):
            d = cycle_start + timedelta(days=offset)
            is_new_month = (d.month != prev_month)
            prev_month = d.month
            angle = (360.0 / cycle_len) * offset
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
                'date': d.isoformat(),
                'day_num': offset + 1,
                'phase': phase,
                'is_past': d < today,
                'is_today': d == today,
                'new_month': is_new_month,
                'angle': angle,
            })

        return Response({'days_list': days_list})

# Dashboard View
class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        days = list(range(1, 31))
        fsh = [5 + 2 * math.exp(-((d-1)/5)**2) + 0.5 * math.sin(d/30*2*math.pi) for d in days]
        lh = [1 + 10 * math.exp(-((d-14)/1.5)**2) for d in days]
        estradiol = [5 + 8 * math.exp(-((d-12)/3)**2) + 2 * math.exp(-((d-21)/4)**2) for d in days]
        progesterone = [1 + 5 * math.exp(-((d-21)/3)**2) for d in days]
        return Response({
            'days': days,
            'fsh': fsh,
            'lh': lh,
            'estradiol': estradiol,
            'progesterone': progesterone,
        })