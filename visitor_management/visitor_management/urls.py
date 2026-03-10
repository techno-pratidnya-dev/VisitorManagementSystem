from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from visitors.views import test_mail

urlpatterns = [
    path('admin/', admin.site.urls),

    # email test url
    path('test-mail/', test_mail),

    path('', include('visitors.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)