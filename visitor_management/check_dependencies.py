import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'visitor_management.settings')
django.setup()

from django.apps import apps
from django.db import models

UserModel = apps.get_model('visitors', 'CustomUser')
target_ids = [2, 3]

print("--- Checking for Dependent Data ---")
for model in apps.get_models():
    for field in model._meta.fields:
        if isinstance(field, models.ForeignKey) and field.related_model == UserModel:
            print(f"Model: {model.__name__} has Foreign Key to CustomUser in field: {field.name}")
            for tid in target_ids:
                matches = model.objects.filter(**{field.name: tid})
                if matches.exists():
                    print(f"  Conflict! User ID {tid} found in {model.__name__} ({matches.count()} records)")
