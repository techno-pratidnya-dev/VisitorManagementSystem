import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'visitor_management.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

try:
    user = User.objects.get(username='VSS')
    print(f"User found: {user.username}")
    print(f"Email: {user.email}")
    print(f"Is active: {user.is_active}")
    print(f"Is email verified: {getattr(user, 'is_email_verified', 'N/A')}")
    print(f"Role: {getattr(user, 'role', 'N/A')}")
    print(f"Password starts with pbkdf2_sha256: {user.password.startswith('pbkdf2_sha256')}")
except User.DoesNotExist:
    print("User 'VSS' not found.")
    # Check by email
    try:
        user = User.objects.get(email='techconnectpratidnya@gmail.com')
        print(f"User found by email: {user.username}")
        print(f"Email: {user.email}")
    except User.DoesNotExist:
        print("User with email 'techconnectpratidnya@gmail.com' not found.")
