from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Fixes a broke user password'

    def handle(self, *args, **options):
        User = get_user_model()
        u = User.objects.filter(email='techconnectpratidnya@gmail.com').first()
        if u:
            u.set_password('VSS@2026')
            u.save()
            self.stdout.write(self.style.SUCCESS("Password successfully reset!"))
        else:
            self.stdout.write(self.style.ERROR("User not found."))
