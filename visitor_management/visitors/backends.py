from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        try:
            # Look for users where either username or email matches the input
            users = UserModel.objects.filter(Q(username__iexact=username) | Q(email__iexact=username))
            
            for user in users:
                if user.check_password(password) and self.user_can_authenticate(user):
                    return user
            return None
        except Exception as e:
            # Fallback for unexpected errors, logging could be added here
            return None
