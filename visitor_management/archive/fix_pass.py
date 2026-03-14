import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'visitor_management.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()
u = User.objects.filter(email='techconnectpratidnya@gmail.com').first()
if u:
    u.set_password('VSS@2026')
    u.save()
    print("Password Reset Successfully")
else:
    print("User not found")
