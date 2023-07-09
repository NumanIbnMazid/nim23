# ----------------------------------------------------
# *** Numan Ibn Mazid's Portfolio Project's Backend Settings ***
# ----------------------------------------------------
from pathlib import Path
import os
from conf import config
from datetime import timedelta
from rest_framework.settings import api_settings

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
THIRD_PARTY_APPS = [
    # Django REST Framework
    "rest_framework",
    # Knox Authentication
    "knox",
    # Django REST Framework Yet Another Swagger
    "drf_yasg",
    # Django CORS Headers
    "corsheaders",
    # Django CKEditor
    "ckeditor",
    "ckeditor_uploader",
    # Django TinyMCE
    "tinymce",
]
LOCAL_APPS = [
    "users",
    "portfolios",
    "code_snippets",
    "blogs"
]
INSTALLED_APPS = (
    [
        # Django Filebrowser Needs to be placed before Django Admin
        # Start Django Filebrowser
        'grappelli',
        'filebrowser',
        # End Django Filebrowser
        "django.contrib.admin",
        "django.contrib.auth",
        "django.contrib.contenttypes",
        "django.contrib.sessions",
        "django.contrib.messages",
        "django.contrib.staticfiles",
    ]
    + THIRD_PARTY_APPS
    + LOCAL_APPS
)

# ----------------------------------------------------
# *** Middleware Definition ***
# ----------------------------------------------------
MIDDLEWARE = [
    # Django CORS Headers Middleware
    "corsheaders.middleware.CorsMiddleware",
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
ROOT_URLCONF = "config.urls"

# ----------------------------------------------------
# *** Templates Definition ***
# ----------------------------------------------------
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "config", "templates")],
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
# *** Authentication Definition ***
# ----------------------------------------------------

# https://docs.djangoproject.com/en/dev/topics/auth/customizing/#substituting-a-custom-user-model
AUTH_USER_MODEL = "users.User"

# ----------------------------------------------------
# *** WSGI Application ***
# ----------------------------------------------------
WSGI_APPLICATION = "config.wsgi.application"

# ----------------------------------------------------
# *** Database Configuration ***
# ----------------------------------------------------
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": config.DATABASE.NAME,
        "USER": config.DATABASE.USER,
        "PASSWORD": config.DATABASE.PASSWORD,
        "HOST": config.DATABASE.HOST,
        "PORT": config.DATABASE.PORT,
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
PUBLIC_ROOT = os.path.join(BASE_DIR, "public/")
# STATIC & MEDIA URL
STATIC_URL = "/static/"
MEDIA_URL = "/media/"
# STATIC & MEDIA ROOT
MEDIA_ROOT = os.path.join(PUBLIC_ROOT, "media/")
STATIC_ROOT = os.path.join(PUBLIC_ROOT, "static/")
# Static Files Directories
STATICFILES_DIRS = [
    os.path.join(PUBLIC_ROOT, "staticfiles"),
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
            "format": "%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s"
        }
    },
    "handlers": {
        "console": {
            "level": os.getenv("DJANGO_LOG_LEVEL", "INFO"),
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        }
    },
    "loggers": {
        "django": {
            "handlers": [],
            "level": os.getenv("DJANGO_LOG_LEVEL", "INFO"),
            "propagate": True,
        },
    },
    "root": {"level": os.getenv("DJANGO_LOG_LEVEL", "INFO"), "handlers": ["console"]},
}

# ----------------------------------------------------
# *** Other Definitions ***
# ----------------------------------------------------
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
SITE_ID = 1

# REST Framework Configuration
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": ("knox.auth.TokenAuthentication",),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
}

# KNOX Configuration
KNOX_TOKEN_MODEL = "knox.AuthToken"

REST_KNOX = {
    # "SECURE_HASH_ALGORITHM": "hashlib.sha512",
    "AUTH_TOKEN_CHARACTER_LENGTH": 64,
    # "TOKEN_TTL": timedelta(hours=730),
    "TOKEN_TTL": None,  # Never Expire
    "USER_SERIALIZER": "knox.serializers.UserSerializer",
    "TOKEN_LIMIT_PER_USER": None,
    "AUTO_REFRESH": False,
    "MIN_REFRESH_INTERVAL": 60,
    "AUTH_HEADER_PREFIX": "Token",
    "EXPIRY_DATETIME_FORMAT": api_settings.DATETIME_FORMAT,
    "TOKEN_MODEL": "knox.AuthToken",
}

# Swagger Configuration
SWAGGER_SETTINGS = {
    "SECURITY_DEFINITIONS": {
        "Bearer": {"type": "apiKey", "name": "Authorization", "in": "header"}
    },
    "JSON_EDITOR": True,
}

# Django CORS Headers Configuration
CORS_ORIGIN_ALLOW_ALL = False
CORS_ORIGIN_WHITELIST = [
    'http://localhost:3000',  # frontend URL here
]

CORS_ALLOW_METHODS = [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
]

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Django CKEditor Configuration
CKEDITOR_UPLOAD_PATH = "ckeditor_uploads/"
CKEDITOR_CONFIGS = {
    'default': {
        'toolbar': 'full',
        'height': 300,
        'width': "100%",
    },
}

# Django Filebrowser Configuration
FILEBROWSER_DIRECTORY = ""
FILEBROWSER_ADMIN_THUMBNAIL="admin_thumbnail"
FILEBROWSER_ADMIN_VERSIONS=['thumbnail', 'small', 'medium', 'big', 'large']
FILEBROWSER_VERSION_QUALITY=90

# Django Tinymce Configuration
TINYMCE_DEFAULT_CONFIG = {
    'height': 360,
    'width': "100%",
    'cleanup_on_startup': True,
    'custom_undo_redo_levels': 10,
    'selector': 'textarea',
    'plugins': '''
        textcolor save link image media preview codesample contextmenu
        table code lists fullscreen  insertdatetime  nonbreaking
        contextmenu directionality searchreplace wordcount visualblocks
        visualchars code fullscreen autolink lists charmap print  hr
        anchor pagebreak
        ''',
    'toolbar': '''
        undo redo | formatselect | bold italic backcolor |
        alignleft aligncenter alignright alignjustify |
        bullist numlist outdent indent | removeformat | table | code | fullscreen
        ''',
    'toolbar_sticky': True,
    'skin': 'oxide',
    'menubar': True,
    'statusbar': True,
}


# ----------------------------------------------------
# *** Configurable Values ***
# ----------------------------------------------------
BLOG_WORDS_PER_MINUTE = 200
