import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'visitor_management.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

ids = [2, 3, 4]
print("--- Detailed User Info for Candidates ---")
for uid in ids:
    try:
        u = User.objects.get(id=uid)
        print(f"ID: {u.id} | Username: {u.username} | Role: {getattr(u, 'role', 'N/A')} | Active: {u.is_active}")
    except User.DoesNotExist:
        print(f"ID: {uid} | NOT FOUND")
