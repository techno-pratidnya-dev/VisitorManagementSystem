import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'visitor_management.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

email = 'techconnectpratidnya@gmail.com'
users = User.objects.filter(email=email)

print(f"--- Users with email {email} ---")
for u in users:
    print(f"ID: {u.id} | Username: '{u.username}' | PasswordHash: {u.password[:20]}...")

print("\n--- Users with username 'VSS' ---")
vss_users = User.objects.filter(username='VSS')
for u in vss_users:
    print(f"ID: {u.id} | Email: '{u.email}'")
