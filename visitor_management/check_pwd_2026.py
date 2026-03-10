import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'visitor_management.settings')
django.setup()

from django.contrib.auth import authenticate, get_user_model

User = get_user_model()
username = 'VSS'
password = 'VSS@2026'

user = authenticate(username=username, password=password)

if user:
    print(f"Authentication SUCCESS for {user.username} with password VSS@2026")
else:
    print(f"Authentication FAILURE for {username} with password VSS@2026")
    
    user_obj = User.objects.get(username=username)
    print(f"User check_password(VSS@2026) result: {user_obj.check_password('VSS@2026')}")
    print(f"User check_password(VSS@2023) result: {user_obj.check_password('VSS@2023')}")
