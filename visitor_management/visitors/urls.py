from django.urls import path
from . import views

urlpatterns = [

    # =====================
    # LANDING PAGE
    # =====================
    path('', views.index, name='index'),

    # =====================
    # AUTHENTICATION
    # =====================
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register_view, name='register'),
    
    path('verify-email/<uidb64>/<token>/', views.verify_email_confirm, name='verify_email_confirm'),

    # =====================
    # HOME / DASHBOARD
    # =====================
    path('home/', views.home, name='home'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('about/', views.about, name='about'),

    # =====================
    # VISITOR SECTION
    # =====================
    path('visitor-entry/', views.add_visitor, name='visitor_entry'),
    path('visitors/', views.visitor_list, name='visitor_list'),
    path('visitors/add/', views.add_visitor, name='add_visitor'),
    path('visitors/checkout/<int:visitor_id>/', views.checkout_visitor, name='checkout_visitor'),
    path('visitors/report/', views.visitor_report, name='visitor_report'),
    path('visitors/edit/<int:id>/',
         views.edit_visitor,
         name='edit_visitor'),

    path('role-redirect/', views.role_redirect, name='role_redirect'),


    # ✅ NEW DELETE
    path('visitors/delete/<int:id>/',
         views.delete_visitor,
         name='delete_visitor'),

    
    # =====================
    # PROFILE
    # =====================
    path('profile/', views.profile, name='profile'),

    # =====================
    # API ENDPOINTS
    # =====================
    path('past-visitors/', views.past_visiter, name='past_visiter'),

    path('api/visitor-by-mobile/', views.get_visitor_by_mobile, name='visitor_by_mobile'),
    path('api/check-duplicate-visitor/', views.check_duplicate_visitor, name='check_duplicate_visitor'),
]
