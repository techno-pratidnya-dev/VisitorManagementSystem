import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'visitor_management.settings')
django.setup()

from django.contrib.auth import authenticate, get_user_model
User = get_user_model()

print("--- Testing with EmailBackend ---")
user = authenticate(username='VSS', password='VSS@2023', backend='visitors.backends.EmailBackend')
print(f"Result (VSS): {user}")

user_email = authenticate(username='techconnectpratidnya@gmail.com', password='VSS@2023', backend='visitors.backends.EmailBackend')
print(f"Result (Email): {user_email}")

print("\n--- Testing with ModelBackend ---")
user_model = authenticate(username='VSS', password='VSS@2023', backend='django.contrib.auth.backends.ModelBackend')
print(f"Result (Model): {user_model}")

print("\n--- Testing without specifying backend ---")
user_default = authenticate(username='VSS', password='VSS@2023')
print(f"Result (Default): {user_default}")
