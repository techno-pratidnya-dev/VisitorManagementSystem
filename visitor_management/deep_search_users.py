import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'visitor_management.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

print("--- ALL USERS WITH IDENTICAL EMAIL DATA ---")
email = 'techconnectpratidnya@gmail.com'
users = User.objects.filter(email__icontains='techconnectpratidnya')

for u in users:
    print(f"ID: {u.id:4} | Username: {repr(u.username):30} | Email: {repr(u.email):40} | Active: {u.is_active} | Verified: {getattr(u, 'is_email_verified', 'N/A')}")

print("\n--- Identifying VSS ---")
vss_users = User.objects.filter(username__icontains='VSS')
for u in vss_users:
    print(f"ID: {u.id:4} | Username: {repr(u.username):30} | Email: {repr(u.email):40}")
