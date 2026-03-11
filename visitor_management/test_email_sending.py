
import os
import django
from django.core.mail import send_mail
from django.conf import settings

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'visitor_management.settings')
django.setup()

def test_email():
    print(f"Testing email with DEFAULT_FROM_EMAIL: {settings.DEFAULT_FROM_EMAIL}")
    print(f"EMAIL_HOST: {settings.EMAIL_HOST}")
    print(f"EMAIL_PORT: {settings.EMAIL_PORT}")
    print(f"EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}")
    
    try:
        subject = "VMS Test Email"
        message = "This is a test email from the VMS system."
        recipient_list = ["pratidnyaagalave0105@gmail.com"] # Using the same email as in test_mail view
        
        sent = send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            recipient_list,
            fail_silently=False
        )
        print(f"Email sent successfully: {sent}")
    except Exception as e:
        print(f"Email sending failed with error: {e}")

if __name__ == "__main__":
    test_email()
