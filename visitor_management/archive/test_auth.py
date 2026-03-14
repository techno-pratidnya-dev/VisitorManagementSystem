import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'visitor_management.settings')
django.setup()

from django.contrib.auth import authenticate, get_user_model

User = get_user_model()
username = 'VSS'
password = 'VSS@2023'

user = authenticate(username=username, password=password)

if user:
    print(f"Authentication SUCCESS for {user.username}")
else:
    print(f"Authentication FAILURE for {username}")
    
    # Debug why it failed
    try:
        user_obj = User.objects.get(username=username)
        print(f"User check_password result: {user_obj.check_password(password)}")
        print(f"User is_active: {user_obj.is_active}")
        
    except User.DoesNotExist:
        print(f"User {username} does not exist in the database.")
