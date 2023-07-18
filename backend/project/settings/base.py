# ----------------------------------------------------
# *** nim23.com - Numan Ibn Mazid's Portfolio Project's Backend Settings ***
# ----------------------------------------------------
from pathlib import Path
import os
from config import config
from rest_framework.settings import api_settings

# ----------------------------------------------------
# *** Project's BASE DIRECTORY ***
# ----------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# ----------------------------------------------------
# *** SECRET KEY ***
# ----------------------------------------------------
SECRET_KEY = config.SECRET_KEY

# ----------------------------------------------------
# *** Debug ***
# ----------------------------------------------------
DEBUG = config.MODE == "DEVELOPMENT"

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
    + LOCAL_APPS + [
        # Django Cleanup Needs to place after all apps
        "django_cleanup.apps.CleanupConfig"
    ]
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
ROOT_URLCONF = "project.urls"

# ----------------------------------------------------
# *** Templates Definition ***
# ----------------------------------------------------
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "project", "templates")],
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
WSGI_APPLICATION = "project.wsgi.application"

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

# Django Filebrowser Configuration
FILEBROWSER_DIRECTORY = ''
DIRECTORY = ''
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
BACKEND_SUBDOMAIN = "/backend"
BLOG_WORDS_PER_MINUTE = 200
LOGIN_URL = BACKEND_SUBDOMAIN + "/admin/login/"
LOGOUT_REDIRECT_URL = '/'
