"""
WSGI config for project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

from config import config

if config.MODE == "PRODUCTION":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings.production")
else:
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings.development")

application = get_wsgi_application()
