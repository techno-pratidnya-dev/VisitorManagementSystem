import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'visitor_management.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

try:
    u = User.objects.get(username='VSS')
    print(f'Username: {u.username}')
    print(f'Email: {u.email}')
    print(f'pk: {u.pk}')
    print(f'is_active: {u.is_active}')
    print(f'is_email_verified: {getattr(u, "is_email_verified", "N/A")}')
    print(f'password Hash: {u.password[:20]}...')
except Exception as e:
    print(f'Error: {e}')
