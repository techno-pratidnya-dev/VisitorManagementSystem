import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'visitor_management.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.apps import apps
from django.db import models

User = get_user_model()
target_user = User.objects.get(id=4) # VSS (Keep)
dup_user_2 = User.objects.get(id=2)  # techconnect... (Delete)
dup_user_3 = User.objects.get(id=3)  # Admin (Delete)

print(f"Consolidating to user: {target_user.username} (ID: {target_user.id})")

# Migrate related data
for model in apps.get_models():
    for field in model._meta.fields:
        if isinstance(field, models.ForeignKey) and field.related_model == User:
            # Update ID 2 records
            count2 = model.objects.filter(**{field.name: dup_user_2.id}).update(**{field.name: target_user.id})
            if count2 > 0:
                print(f"  Migrated {count2} records from ID 2 to ID 4 in {model.__name__} (field: {field.name})")
            
            # Update ID 3 records
            count3 = model.objects.filter(**{field.name: dup_user_3.id}).update(**{field.name: target_user.id})
            if count3 > 0:
                print(f"  Migrated {count3} records from ID 3 to ID 4 in {model.__name__} (field: {field.name})")

# Now delete duplicates
print("Deleting duplicate user ID 3...")
dup_user_3.delete()
print("Deleting duplicate user ID 2...")
dup_user_2.delete()

# Ensure ID 4 has correct password
target_user.set_password('VSS@2023')
target_user.is_active = True
target_user.is_email_verified = True
target_user.save()

print("DONE: Accounts consolidated to ID 4 (VSS) with password VSS@2023")
