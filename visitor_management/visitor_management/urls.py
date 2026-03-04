from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [

    # =====================
    # ADMIN PANEL
    # =====================
    path('admin/', admin.site.urls),

    # =====================
    # MAIN APP ROUTES
    # =====================
    path('', include('visitors.urls')),  # 👈 index yethun control hoto
]


# =====================
# MEDIA FILES (Development Only)
# =====================
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )
