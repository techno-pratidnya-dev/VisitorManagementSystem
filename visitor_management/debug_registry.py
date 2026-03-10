import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'visitor_management.settings')
django.setup()

from django.apps import apps
from django.contrib.auth import get_user_model

print("--- Checking Model Registry ---")
for app_config in apps.get_app_configs():
    for model in app_config.get_models():
        if model.__name__ == 'CustomUser':
            print(f"Found CustomUser in {app_config.label}: {model.__module__}")

print("\n--- Checking get_user_model ---")
User = get_user_model()
print(f"User model: {User}")
print(f"User module: {User.__module__}")

from django.contrib.auth import authenticate
print("\n--- Testing Authentication ---")
try:
    user = authenticate(username='VSS', password='VSS@2023')
    print(f"Result: {user}")
except Exception as e:
    print(f"Error during authenticate: {e}")
    import traceback
    traceback.print_exc()
