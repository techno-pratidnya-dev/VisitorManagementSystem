from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Visitor, VisitorEditLog


# ==============================
# Custom User Admin
# ==============================
@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('username', 'email', 'role', 'is_staff', 'is_superuser')
    fieldsets = UserAdmin.fieldsets + (
        ('Role Information', {'fields': ('role',)}),
    )


# ==============================
# Visitor Admin
# ==============================
@admin.register(Visitor)
class VisitorAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'mobile',
        'gender',
        'purpose',
        'visit_to',
        'hostel_or_office',
        'entry_time',
        'exit_time',
        'status',
    )
    list_filter = ('status', 'gender')
    search_fields = ('name', 'mobile', 'aadhaar')


# ==============================
# Visitor Edit Log Admin
# ==============================
@admin.register(VisitorEditLog)
class VisitorEditLogAdmin(admin.ModelAdmin):
    list_display = ('visitor', 'edited_by', 'edited_at')