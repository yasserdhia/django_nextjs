from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import User
from .serializers import UserCreateSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
