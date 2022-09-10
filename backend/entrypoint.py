import os
from importlib import reload
from django.db import IntegrityError
from project import wsgi

# Load django application
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings")
application = reload(wsgi)

# Create Django Super User
try:
    from django.contrib.auth import get_user_model

    if not get_user_model().objects.filter(
        username=os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
    ).exists():
        print("Creating django superuser ...")
        get_user_model().objects.create_superuser(
            username=os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin'),
			email=os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@example.com'),
            password=os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'admin')
        )
        print('Django superuser created successfully...')
    else:
        print(f"Django Super Admin ({os.environ.get('DJANGO_SU_EMAIL')}) already exists!")
except IntegrityError:
    pass
