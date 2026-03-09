from django.shortcuts import render, redirect, get_object_or_404
from django.utils import timezone
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model

from django.contrib import messages
from django.http import HttpResponse, HttpResponseForbidden
from django.db.models import Q
from django.core.paginator import Paginator
from django.core.mail import send_mail
from django.conf import settings
from django.core.files.base import ContentFile

from datetime import timedelta
import base64
import csv
import random

from .models import Visitor, VisitorEditLog
@login_required
def role_redirect(request):
    user = request.user

    if user.role == 'ADMIN':
        return redirect('dashboard')

    elif user.role == 'STAFF':
        return redirect('visitor_list')

    elif user.role == 'SECURITY':
        return redirect('checkin_page')

    return redirect('login')
# =====================
# INDEX (Landing Page)
# =====================
def index(request):
    if request.user.is_authenticated:
        return redirect('role_redirect')
    return render(request, 'visitors/index.html')

# =====================
# HOME (After Login)
# =====================
@login_required
def home(request):
    return render(request, 'visitors/home.html')


# =====================
# REGISTER
# =====================
User = get_user_model()
def register_view(request):
    if request.method == "POST":
        name = request.POST.get('name')
        email = request.POST.get('email')
        password = request.POST.get('password')

        if User.objects.filter(username=email).exists():
            messages.error(request, "User with this email already exists.")
            return redirect('register')

        User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=name,
            role='STAFF'
        )

        messages.success(request, "Registration successful. Please login.")
        return redirect('login')

    return render(request, 'visitors/registration.html')


# =====================
# LOGIN
# =====================
# =====================
# LOGIN WITH OTP
# ====================


def login_view(request):

    if request.user.is_authenticated:
        return redirect('home')
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user:
            otp = random.randint(100000, 999999)

            request.session['otp'] = otp
            request.session['user_id'] = user.id
            request.session['email'] = user.email
            request.session['otp_time'] = timezone.now().timestamp()

            send_mail(
                'VMS Login OTP',
                f'Your OTP is {otp}',
                settings.EMAIL_HOST_USER,
                [user.email],
                fail_silently=True
            )

            return redirect('otp_verify')

        else:
            messages.error(request, "Invalid username or password.")

    return render(request, 'visitors/login.html')
# =====================
# LOGOUT
# =====================
def logout_view(request):
    name = request.user.first_name or request.user.username
    logout(request)
    messages.success(request, f"Logged out successfully, {name}")
    return redirect('index')



# =====================
# ADD VISITOR
# =====================

@login_required
def add_visitor(request):

    # ❗ Security role cannot add visitors
    if request.user.role == "SECURITY":
        return HttpResponseForbidden("Security cannot add visitors.")

    if request.method == "POST":

        photo_file = request.FILES.get("photo")
        if not photo_file:
            messages.error(request, "Visitor photo is required.")
            return redirect("add_visitor")

        signature_data = request.POST.get("signature_data")
        uploaded_signature = request.FILES.get("signature")
        signature_file = None

        if signature_data:
            try:
                format, imgstr = signature_data.split(";base64,")
                ext = format.split("/")[-1]

                signature_file = ContentFile(
                    base64.b64decode(imgstr),
                    name=f"signature_{timezone.now().timestamp()}.{ext}"
                )
            except Exception:
                messages.error(request, "Invalid digital signature format.")
                return redirect("add_visitor")

        elif uploaded_signature:
            signature_file = uploaded_signature

        if not signature_file:
            messages.error(request, "Signature is required (Digital or Upload).")
            return redirect("add_visitor")

        Visitor.objects.create(
            name=request.POST.get('name'),
            mobile=request.POST.get('mobile'),
            email=request.POST.get('email'),
            gender=request.POST.get('gender'),
            purpose=request.POST.get('purpose'),
            visit_to=request.POST.get('visit_to'),
            hostel_or_office=request.POST.get('hostel_or_office'),
            address=request.POST.get('address'),
            aadhaar=request.POST.get('aadhaar'),
            remark=request.POST.get('remark'),
            photo=photo_file,
            signature=signature_file,
            created_by=request.user
        )

        messages.success(request, "Visitor added successfully 🎉")
        return redirect("visitor_list")

    return render(request, "visitors/visitor_entry.html")
# =====================
# VISITOR LIST
# =====================
@login_required
def visitor_list(request):

    if request.user.role == "ADMIN":
        visitors = Visitor.objects.all().order_by('-entry_time')
    else:
        visitors = Visitor.objects.filter(
            created_by=request.user
        ).order_by('-entry_time')

    from_date = request.GET.get('from_date')
    to_date = request.GET.get('to_date')
    status = request.GET.get('status')
    search = request.GET.get('search')
    export = request.GET.get('export')

    if from_date and to_date:
        visitors = visitors.filter(entry_time__date__range=[from_date, to_date])

    if status:
        visitors = visitors.filter(status=status)

    if search:
        visitors = visitors.filter(
            Q(name__icontains=search) |
            Q(mobile__icontains=search) |
            Q(purpose__icontains=search)
        )

    if export == "csv":
        return export_visitors_csv(visitors)

    paginator = Paginator(visitors, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        'visitors': page_obj,
        'page_obj': page_obj,
        'total': visitors.count(),
        'in_count': visitors.filter(status='IN').count(),
        'out_count': visitors.filter(status='OUT').count(),
    }

    return render(request, 'visitors/visitor_list.html', context)
# =====================
# EXPORT CSV
# =====================
@login_required
def export_visitors_csv(visitors):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="visitors.csv"'

    writer = csv.writer(response)
    writer.writerow([
        'Name', 'Mobile', 'Email', 'Purpose',
        'Visit To', 'Hostel/Office',
        'Entry Time', 'Exit Time', 'Status'
    ])

    for v in visitors:
        writer.writerow([
            v.name, v.mobile, v.email,
            v.purpose, v.visit_to,
            v.hostel_or_office,
            v.entry_time, v.exit_time,
            v.status,
        ])

    return response


# =====================
# CHECKOUT VISITOR
# =====================
@login_required
def checkout_visitor(request, visitor_id):

    if request.user.role == "ADMIN":
        visitor = get_object_or_404(Visitor, id=visitor_id)
    else:
        visitor = get_object_or_404(
            Visitor,
            id=visitor_id,
            created_by=request.user
        )

    if visitor.status == 'IN':
        visitor.status = 'OUT'
        visitor.exit_time = timezone.now()
        visitor.save()
        messages.success(request, "Visitor checked out successfully.")

    return redirect('visitor_list')
# =====================
# PROFILE
# =====================
@login_required
def profile(request):
    user = request.user

    if request.method == "POST":

        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")

        if User.objects.exclude(id=user.id).filter(username=username).exists():
            messages.error(request, "Username already exists.")
            return redirect("profile")

        user.username = username
        user.email = email

        if password:
            user.set_password(password)
            update_session_auth_hash(request, user)

        user.save()

        if hasattr(user, "profile") and request.FILES.get("photo"):
            user.profile.photo = request.FILES.get("photo")
            user.profile.save()

        messages.success(request, "Profile updated successfully ✅")
        return redirect("profile")

    return render(request, "visitors/profile.html")

# =====================
# VISITOR REPORT
# =====================
@login_required
def visitor_report(request):

    if request.user.role == "ADMIN":
        visitors = Visitor.objects.all().order_by('-entry_time')
    else:
        visitors = Visitor.objects.filter(
            created_by=request.user
        ).order_by('-entry_time')

    return render(request, 'visitors/visitor_report.html', {
        'visitors': visitors
    })
# =====================
# OTP VERIFY
# =====================
def otp_verify(request):

    # 🔐 Check email in session
    user_email = request.session.get('email')
    if not user_email:
        return redirect('login')

    # 🔐 Check OTP expiry
    otp_time = request.session.get('otp_time')
    if not otp_time:
        return redirect('login')

    if timezone.now().timestamp() - otp_time > 180:
        messages.error(request, "OTP expired. Please login again.")
        return redirect('login')

    masked_email = user_email[0] + "***@" + user_email.split("@")[1]

    if request.method == "POST":
        entered_otp = request.POST.get('otp')
        session_otp = request.session.get('otp')
        user_id = request.session.get('user_id')

        if str(entered_otp) == str(session_otp):

            user = get_object_or_404(User, id=user_id)

            # 🔥 LOGIN USER
            login(request, user)

            # 🔥 CLEAR OTP SESSION DATA
            request.session.pop('otp', None)
            request.session.pop('user_id', None)
            request.session.pop('email', None)
            request.session.pop('otp_time', None)

            return redirect('role_redirect')


        else:
            messages.error(request, "Invalid OTP.")

    return render(request, 'visitors/otp.html', {
        'masked_email': masked_email
    })
# =====================
# RESEND OTP
# =====================
@login_required
def resend_otp(request):
    user_id = request.session.get('user_id')
    if not user_id:
        return redirect('login')

    user = User.objects.get(id=user_id)

    new_otp = random.randint(100000, 999999)
    request.session['otp'] = new_otp
    request.session['otp_time'] = timezone.now().timestamp()

    send_mail(
        'VMS Resend OTP',
        f'Your new OTP is {new_otp}',
        settings.EMAIL_HOST_USER,
        [user.email],
        fail_silently=True
    )

    return redirect('otp_verify')
#---------------
#-------------------

@login_required
def dashboard(request):

    if request.user.role == "ADMIN":
      visitors = Visitor.objects.only("status", "entry_time")
    else:
      visitors = Visitor.objects.filter(
        created_by=request.user
    ).only("status", "entry_time")

    today = timezone.now().date()
    yesterday = today - timedelta(days=1)

    week_start = today - timedelta(days=today.weekday())
    month_start = today.replace(day=1)
    year_start = today.replace(month=1, day=1)

    context = {
        "total": visitors.count(),
        "in_count": visitors.filter(status="IN").count(),
        "out_count": visitors.filter(status="OUT").count(),

        "today_count": visitors.filter(entry_time__date=today).count(),
        "yesterday_count": visitors.filter(entry_time__date=yesterday).count(),

        "week_count": visitors.filter(entry_time__date__gte=week_start).count(),
        "month_count": visitors.filter(entry_time__date__gte=month_start).count(),
        "year_count": visitors.filter(entry_time__date__gte=year_start).count(),
    }

    return render(request, "visitors/dashboard.html", context)

# =====================
# ABOUT PAGE
# =====================
@login_required
def about(request):
    return render(request, "visitors/about.html")



@login_required
def edit_visitor(request, id):

    if request.user.role == "ADMIN":
        visitor = get_object_or_404(Visitor, id=id)
    else:
        visitor = get_object_or_404(Visitor, id=id, created_by=request.user)

    if request.method == "POST":

        visitor.name = request.POST.get('name')
        visitor.mobile = request.POST.get('mobile')
        visitor.email = request.POST.get('email')
        visitor.gender = request.POST.get('gender')
        visitor.address = request.POST.get('address')
        visitor.purpose = request.POST.get('purpose')
        visitor.visit_to = request.POST.get('visit_to')
        visitor.hostel_or_office = request.POST.get('hostel_or_office')
        visitor.remark = request.POST.get('remark')

        # ✅ Only ADMIN can change status & exit time
        if request.user.role == "ADMIN":
            visitor.status = request.POST.get('status')
            visitor.exit_time = request.POST.get('exit_time')

            if request.FILES.get('photo'):
                visitor.photo = request.FILES.get('photo')

            if request.FILES.get('signature'):
                visitor.signature = request.FILES.get('signature')

        visitor.save()

        VisitorEditLog.objects.create(
            visitor=visitor,
            edited_by=request.user,
            change_note="Visitor details updated"
        )

        return redirect('visitor_list')

    return render(request, 'visitors/edit_visitor.html', {'visitor': visitor})
        

@login_required
def delete_visitor(request, id):

    if request.user.role != "ADMIN":
        return HttpResponseForbidden("Admins only")

    visitor = get_object_or_404(Visitor, id=id)

    if request.method == "POST":
        visitor.delete()
        return redirect('visitor_list')

    return render(request, 'visitors/delete_confirm.html', {'visitor': visitor})
@login_required
def checkin_page(request):
    visitors = Visitor.objects.filter(status='IN').order_by('-entry_time')
    return render(request, 'visitors/checkin_page.html', {'visitors': visitors})