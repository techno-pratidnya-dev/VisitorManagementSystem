import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'visitor_management.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

with open('full_user_list.txt', 'w') as f:
    f.write("--- FULL USER LIST ---\n")
    for u in User.objects.all().order_by('id'):
        f.write(f"ID: {u.id:4} | Username: {repr(u.username):30} | Email: {repr(u.email):40} | Active: {u.is_active}\n")
