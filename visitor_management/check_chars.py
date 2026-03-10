import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'visitor_management.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

try:
    u = User.objects.get(id=4)
    print(f"Username: '{u.username}' (len: {len(u.username)})")
    print(f"Email: '{u.email}' (len: {len(u.email)})")
    
    # Check for non-printable characters
    print(f"Username repr: {repr(u.username)}")
    print(f"Email repr: {repr(u.email)}")

except Exception as e:
    print(f"Error: {e}")
