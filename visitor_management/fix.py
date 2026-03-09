from django.contrib.auth import get_user_model
User = get_user_model()
u = User.objects.filter(email='techconnectpratidnya@gmail.com').first()
if u:
    u.set_password('VSS@2026')
    u.save()
    print("Password Fixed")
else:
    print("User not found")
