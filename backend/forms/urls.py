# forms/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    GovernmentEntityViewSet,
    CitizenFeedbackViewSet,
    FormSubmissionViewSet,
    DashboardViewSet
)
from .citizen_feedback_view import create_citizen_feedback

router = DefaultRouter()
router.register(r'government-entities', GovernmentEntityViewSet)
router.register(r'citizen-feedback', CitizenFeedbackViewSet)
router.register(r'form-submissions', FormSubmissionViewSet)
router.register(r'dashboard', DashboardViewSet, basename='dashboard')

urlpatterns = [
    path('api/forms/', include(router.urls)),
    path('api/forms/citizen-feedback/create/', create_citizen_feedback, name='create_citizen_feedback'),
]
