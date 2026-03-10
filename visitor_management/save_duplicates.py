import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'visitor_management.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

email = 'techconnectpratidnya@gmail.com'
users = User.objects.filter(email=email)

with open('duplicate_users_log.txt', 'w') as f:
    f.write(f"--- Users with email {email} ---\n")
    for u in users:
        f.write(f"ID: {u.id} | Username: '{u.username}' | PasswordHash: {u.password[:20]}...\n")

    f.write(f"\n--- Users with username 'VSS' ---\n")
    vss_users = User.objects.filter(username='VSS')
    for u in vss_users:
        f.write(f"ID: {u.id} | Email: '{u.email}'\n")
