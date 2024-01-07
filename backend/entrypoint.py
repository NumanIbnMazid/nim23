import os
from importlib import reload
from django.db import IntegrityError
from project import wsgi
from config import config

# Load django application
if config.MODE == "PRODUCTION":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings.production")
else:
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings.development")

application = reload(wsgi)

# Create Django Super User
try:
    from django.contrib.auth import get_user_model

    SUPERUSER_USERNAME = os.environ.get(
        'DJANGO_SUPERUSER_USERNAME', 'admin'
    )
    SUPERUSER_EMAIL = os.environ.get(
        'DJANGO_SUPERUSER_EMAIL', 'admin@example.com'
    )
    SUPERUSER_PASSWORD = os.environ.get(
        'DJANGO_SUPERUSER_PASSWORD', 'admin'
    )

    if not get_user_model().objects.filter(
        username=SUPERUSER_USERNAME
    ).exists():
        print("Creating django superuser ...")
        get_user_model().objects.create_superuser(
            username=SUPERUSER_USERNAME,
            email=SUPERUSER_EMAIL,
            password=SUPERUSER_PASSWORD
        )
        print('Django superuser created successfully...')
    else:
        print(f"Django superuser ({SUPERUSER_USERNAME}) already exists!")
except IntegrityError:
    pass
