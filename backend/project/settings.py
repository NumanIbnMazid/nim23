# ----------------------------------------------------
# *** Numan Ibn Mazid's Portfolio Project's Backend Settings ***
# ----------------------------------------------------
from pathlib import Path
import os
from config import config

# ----------------------------------------------------
# *** Project's BASE DIRECTORY ***
# ----------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# ----------------------------------------------------
# *** SECRET KEY ***
# ----------------------------------------------------
SECRET_KEY = config.SECRET_KEY

# ----------------------------------------------------
# *** Debug ***
# ----------------------------------------------------
DEBUG = config.MODE == "DEVELOPMENT"

# ----------------------------------------------------
# *** Allowed Hosts ***
# ----------------------------------------------------
ALLOWED_HOSTS = ["*"]

# ----------------------------------------------------
# *** Application Definition ***
# ----------------------------------------------------
THIRD_PARTY_APPS = []
LOCAL_APPS = []
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
] + THIRD_PARTY_APPS + LOCAL_APPS

# ----------------------------------------------------
# *** Middleware Definition ***
# ----------------------------------------------------
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# ----------------------------------------------------
# *** Root URL Config ***
# ----------------------------------------------------
ROOT_URLCONF = "project.urls"

# ----------------------------------------------------
# *** Templates Definition ***
# ----------------------------------------------------
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# ----------------------------------------------------
# *** WSGI Application ***
# ----------------------------------------------------
WSGI_APPLICATION = "project.wsgi.application"

# ----------------------------------------------------
# *** Database Configuration ***
# ----------------------------------------------------
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config.DATABASE.NAME,
        'USER': config.DATABASE.USER,
        'PASSWORD': config.DATABASE.PASSWORD,
        'HOST': config.DATABASE.HOST,
        'PORT': config.DATABASE.PORT
    }
}

# ----------------------------------------------------
# *** Authentication Definition ***
# ----------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#password-hashers
PASSWORD_HASHERS = [
    # https://docs.djangoproject.com/en/dev/topics/auth/passwords/#using-argon2-with-django
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
    "django.contrib.auth.hashers.BCryptSHA256PasswordHasher",
]

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# ----------------------------------------------------
# *** Internationalization ***
# ----------------------------------------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# ----------------------------------------------------
# *** Static and Media Files Configuration ***
# ----------------------------------------------------
PUBLIC_ROOT = os.path.join(BASE_DIR, 'public/')
# STATIC & MEDIA URL
STATIC_URL = '/static/'
MEDIA_URL = '/media/'
# STATIC & MEDIA ROOT
MEDIA_ROOT = os.path.join(PUBLIC_ROOT, 'media/')
STATIC_ROOT = os.path.join(PUBLIC_ROOT, 'static/')
# Static Files Directories
STATICFILES_DIRS = [
    os.path.join(PUBLIC_ROOT, 'staticfiles'),
]

# https://docs.djangoproject.com/en/dev/ref/contrib/staticfiles/#staticfiles-finders
STATICFILES_FINDERS = [
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
]

# ----------------------------------------------------
# *** Logging ***
# ----------------------------------------------------
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "%(levelname)s %(asctime)s %(module)s "
            "%(process)d %(thread)d %(message)s"
        }
    },
    "handlers": {
        "console": {
            "level": os.getenv("DJANGO_LOG_LEVEL", "INFO"),
            "class": "logging.StreamHandler",
            "formatter": "verbose"
        }
    },
	"loggers": {
        "django": {
            "handlers": [],
            "level": os.getenv("DJANGO_LOG_LEVEL", "INFO"),
            "propagate": True,
        },
    },
    "root": {
        "level": os.getenv("DJANGO_LOG_LEVEL", "INFO"),
        "handlers": ["console"]
    }
}

# ----------------------------------------------------
# *** Other Definitions ***
# ----------------------------------------------------
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
SITE_ID = 1
