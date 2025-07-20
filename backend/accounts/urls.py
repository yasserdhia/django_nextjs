from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

urlpatterns = [
    path('user/', views.UserProfileView.as_view(), name='user-profile'),
] + router.urls
