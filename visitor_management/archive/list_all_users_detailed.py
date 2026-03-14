import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'visitor_management.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

print("--- ALL USERS ---")
for u in User.objects.all().order_by('id'):
    print(f"ID: {u.id:4} | Usr: {u.username:20} | Eml: {u.email:30} | IsAct: {u.is_active} | Ver: {getattr(u, 'is_email_verified', 'N/A')}")
