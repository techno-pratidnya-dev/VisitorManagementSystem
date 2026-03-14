import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'visitor_management.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

try:
    u = User.objects.get(username='VSS')
    u.set_password('VSS@2023')
    u.is_active = True
    u.is_email_verified = True
    u.save()
    print(f"SUCCESS: User {u.username} updated.")
    print(f"is_active: {u.is_active}")
    print(f"is_email_verified: {getattr(u, 'is_email_verified', 'N/A')}")
except User.DoesNotExist:
    print("ERROR: User VSS not found.")
except Exception as e:
    print(f"ERROR: {e}")
