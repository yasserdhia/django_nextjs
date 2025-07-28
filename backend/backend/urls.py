from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),
    path('api/auth/', include('djoser.urls.authtoken')),
    path('api/', include('accounts.urls')),
    path('api/custom-forms/', include('custom_forms.urls')),
    path('', include('forms.urls')),
]
