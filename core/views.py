# core/views.py

from datetime import date, timedelta
import math

from django.contrib.auth.models import User

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Profile, DailyEntry, Cycle, Prediction
from .serializers import (
    UserSerializer,
    ProfileSerializer,
    DailyEntrySerializer,
    CycleSerializer,
    PredictionSerializer,
)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Extends SimpleJWT to include user info in the token response.
    """
    def validate(self, attrs):
        data = super().validate(attrs)
        return {
            "tokens": {
                "refresh": data["refresh"],
                "access": data["access"],
            },
            "user": {
                "id": self.user.id,
                "username": self.user.username,
            },
        }

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["user_id"] = user.id
        return token


class MyTokenObtainPairView(TokenObtainPairView):
    """
    POST /api/auth/token/  -> { tokens: { refresh, access }, user: {...} }
    """
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(APIView):
    """
    POST /api/auth/register/
    {
      "username": "...",
      "password": "...",
      "date_of_birth": "YYYY-MM-DD",
      "country": "US",
      "last_ovulation": "YYYY-MM-DD",
      "cycle_type": "regular",
      "cycle_length": 28,
      "period_length": 5,
      "preferences": ["cycle", "symptoms"],
      "medical_conditions": [1,2,3]
    }
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        username = data.get("username")
        password = data.get("password")

        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already taken"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.create_user(username=username, password=password)
        profile = Profile.objects.create(
            user=user,
            date_of_birth=data.get("date_of_birth"),
            country=data.get("country"),
            last_ovulation=data.get("last_ovulation"),
            cycle_type=data.get("cycle_type", "unknown"),
            cycle_length=data.get("cycle_length"),
            period_length=data.get("period_length"),
            preferences=data.get("preferences", []),
        )
        if "medical_conditions" in data:
            profile.medical_conditions.set(data["medical_conditions"])

        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)


class ProfileViewSet(viewsets.ModelViewSet):
    """
    /api/profiles/       [GET, POST]
    /api/profiles/{pk}/  [GET, PUT, PATCH, DELETE]
    /api/profiles/me/    [GET]  — current user's profile
    """
    queryset = Profile.objects.select_related("user").all()
    serializer_class = ProfileSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=["get"], url_path="me")
    def me(self, request):
        serializer = self.get_serializer(request.user.profile)
        return Response(serializer.data)


class DailyEntryViewSet(viewsets.ModelViewSet):
    """
    /api/daily-entries/       [GET, POST]
    /api/daily-entries/{pk}/  [GET, PUT, PATCH, DELETE]
    """
    serializer_class = DailyEntrySerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return DailyEntry.objects.filter(profile=self.request.user.profile)

    def perform_create(self, serializer):
        serializer.save(profile=self.request.user.profile)


class CycleViewSet(viewsets.ModelViewSet):
    """
    /api/cycles/       [GET, POST]
    /api/cycles/{pk}/  [GET, PUT, PATCH, DELETE]
    """
    serializer_class = CycleSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Cycle.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PredictionViewSet(viewsets.ModelViewSet):
    """
    /api/predictions/       [GET, POST]
    /api/predictions/{pk}/  [GET, PUT, PATCH, DELETE]
    """
    serializer_class = PredictionSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Prediction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CalendarView(APIView):
    """
    GET /api/calendar/
    Returns a list of days in the current cycle with phases, angles, and flags.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

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
                phase = "menstrual"
            elif offset < ov_offset - 5:
                phase = "follicular"
            elif offset < ov_offset:
                phase = "fertile"
            elif offset == ov_offset:
                phase = "ovulation"
            else:
                phase = "luteal"

            days_list.append({
                "date": d.isoformat(),
                "day_num": offset + 1,
                "phase": phase,
                "is_past": d < today,
                "is_today": d == today,
                "new_month": is_new_month,
                "angle": angle,
            })

        return Response({"days_list": days_list})


class DashboardView(APIView):
    """
    GET /api/dashboard/
    Returns hormone curves over a 30-day cycle.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        days = list(range(1, 31))
        fsh = [5 + 2 * math.exp(-((d - 1) / 5) ** 2) + 0.5 * math.sin(d / 30 * 2 * math.pi) for d in days]
        lh = [1 + 10 * math.exp(-((d - 14) / 1.5) ** 2) for d in days]
        estradiol = [
            5 + 8 * math.exp(-((d - 12) / 3) ** 2) + 2 * math.exp(-((d - 21) / 4) ** 2)
            for d in days
        ]
        progesterone = [1 + 5 * math.exp(-((d - 21) / 3) ** 2) for d in days]

        return Response({
            "days": days,
            "fsh": fsh,
            "lh": lh,
            "estradiol": estradiol,
            "progesterone": progesterone,
        })
class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    /api/users/       [GET]
    /api/users/{pk}/  [GET]
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return User.objects.all().order_by('username')