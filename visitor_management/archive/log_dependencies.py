import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'visitor_management.settings')
django.setup()

from django.apps import apps
from django.db import models

UserModel = apps.get_model('visitors', 'CustomUser')
target_ids = [2, 3]

results = []
results.append("--- Checking for Dependent Data ---")
for model in apps.get_models():
    for field in model._meta.fields:
        if isinstance(field, models.ForeignKey) and field.related_model == UserModel:
            results.append(f"Model: {model.__module__}.{model.__name__} has Foreign Key to CustomUser in field: {field.name}")
            for tid in target_ids:
                matches = model.objects.filter(**{field.name: tid})
                if matches.exists():
                    results.append(f"  CONFLICT FOUND! User ID {tid} is used in {model.__name__} ({matches.count()} records)")

with open('dependency_results.txt', 'w') as f:
    f.writelines(line + '\n' for line in results)
