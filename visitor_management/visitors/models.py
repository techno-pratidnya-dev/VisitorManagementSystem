from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
from django.conf import settings


# =========================================================
# EMAIL BACKEND (LOGIN WITH EMAIL OR USERNAME)
# =========================================================
from django.contrib.auth.backends import ModelBackend
from django.db.models import Q

from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    is_email_verified = models.BooleanField(default=False)

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        try:
            user = UserModel.objects.get(Q(username__iexact=username) | Q(email__iexact=username))
        except UserModel.DoesNotExist:
            return None
        
        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None

# =========================================================
# CUSTOM USER MODEL (FIRST DEFINE THIS)
# =========================================================
class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('STAFF', 'Staff'),
        ('SECURITY', 'Security'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    is_email_verified = models.BooleanField(default=False)


# =========================================================
# VISITOR MODEL
# =========================================================
class Visitor(models.Model):

    GENDER_CHOICES = (
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    )

    STATUS_CHOICES = (
        ('IN', 'IN'),
        ('OUT', 'OUT'),
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,   # ✅ IMPORTANT CHANGE
        on_delete=models.CASCADE,
        related_name='visitors'
    )

    name = models.CharField(max_length=100)
    mobile = models.CharField(max_length=10)
    email = models.EmailField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)

    purpose = models.CharField(max_length=200)
    visit_to = models.CharField(max_length=100)
    hostel_or_office = models.CharField(max_length=200)
    address = models.TextField()
    aadhaar = models.CharField(max_length=12)

    remark = models.TextField(null=True, blank=True)

    photo = models.ImageField(upload_to='visitor_photos/', null=True, blank=True)
    signature = models.ImageField(upload_to='signatures/', null=True, blank=True)

    status = models.CharField(max_length=5, choices=STATUS_CHOICES, default='IN')

    entry_time = models.DateTimeField(default=timezone.now)
    exit_time = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-entry_time']

    def __str__(self):
        return f"{self.name} - {self.mobile}"

    def masked_aadhaar(self):
        if self.aadhaar and len(self.aadhaar) == 12:
            return "XXXX-XXXX-" + self.aadhaar[-4:]
        return ""

# =========================================================
# VISITOR EDIT LOG
# =========================================================
class VisitorEditLog(models.Model):
    visitor = models.ForeignKey(Visitor, on_delete=models.CASCADE)
    edited_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,   # ✅ IMPORTANT CHANGE
        on_delete=models.SET_NULL,
        null=True
    )
    edited_at = models.DateTimeField(auto_now_add=True)
    change_note = models.TextField(blank=True)

    def __str__(self):
        return f"{self.visitor.name} edited by {self.edited_by}"