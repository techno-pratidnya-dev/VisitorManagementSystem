import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'visitor_management.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

print("--- Listing All Users ---")
users = User.objects.all()
for u in users:
    print(f"ID: {u.id} | Username: '{u.username}' | Email: '{u.email}' | Active: {u.is_active} | Verified: {getattr(u, 'is_email_verified', 'N/A')}")

print("\n--- Statistics ---")
print(f"Total users: {users.count()}")
print(f"Users with username 'VSS': {User.objects.filter(username__iexact='VSS').count()}")
print(f"Users with email 'techconnectpratidnya@gmail.com': {User.objects.filter(email__iexact='techconnectpratidnya@gmail.com').count()}")
