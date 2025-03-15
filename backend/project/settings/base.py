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
    "blogs",
    "others",
]
INSTALLED_APPS = (
    [
        # Django Admin Interface: Needs to be placed before django.contrib.admin
        # Django Admin Interface: Starts
        "admin_interface",
        "colorfield",
        # Django Admin Interface: Ends
        "django.contrib.admin",
        "django.contrib.auth",
        "django.contrib.contenttypes",
        "django.contrib.sessions",
        "django.contrib.messages",
        "django.contrib.staticfiles",
        # Django Cloudinary Storage
        # going to use it only for media files though, it is django.contrib.staticfiles which has to be first
        "cloudinary_storage",
        "cloudinary"
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
    # Whitenoise Middleware
    "whitenoise.middleware.WhiteNoiseMiddleware",
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
TIME_ZONE = "Asia/Dhaka"
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
            "level": config.DJANGO_LOG_LEVEL,
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        }
    },
    "loggers": {
        "django": {
            "handlers": [],
            "level": config.DJANGO_LOG_LEVEL,
            "propagate": True,
        },
    },
    "root": {"level": config.DJANGO_LOG_LEVEL, "handlers": ["console"]},
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

# Django Tinymce Configuration
TINYMCE_DEFAULT_CONFIG = {
    'height': "70vh",
    'width': "100%",
    # 'theme': "advanced",
    'cleanup_on_startup': True,
    'custom_undo_redo_levels': 10,
    'selector': '.tinymce',
    'plugins': '''
        textcolor save link image media preview codesample contextmenu
        table code lists fullscreen  insertdatetime  nonbreaking
        contextmenu directionality searchreplace wordcount visualblocks
        visualchars code fullscreen autolink lists charmap print  hr
        anchor pagebreak
        ''',
    'codesample_languages': [
        {'text': 'Python', 'value': 'python'},
        {'text': 'Markdown', 'value': 'markdown'},
        {'text': 'Bash', 'value': 'bash'},
        {'text': 'JSON', 'value': 'json'},
        {'text': 'JavaScript', 'value': 'javascript'},
        {'text': 'TypeScript', 'value': 'typescript'},
        {'text': 'HTML/XML', 'value': 'markup'},
        {'text': 'CSS', 'value': 'css'},
        {'text': 'SCSS', 'value': 'scss'},
        {'text': 'Sass', 'value': 'sass'},
        {'text': 'Less', 'value': 'less'},
        {'text': 'JSX', 'value': 'jsx'},
        {'text': 'TSX', 'value': 'tsx'},
        {'text': 'C', 'value': 'c'},
        {'text': 'C++', 'value': 'cpp'},
        {'text': 'C#', 'value': 'csharp'},
        {'text': 'Go', 'value': 'go'},
        {'text': 'Ruby', 'value': 'ruby'},
        {'text': 'Rust', 'value': 'rust'},
        {'text': 'CSV', 'value': 'csv'},
        {'text': 'Docker', 'value': 'docker'},
        {'text': 'nginx', 'value': 'nginx'},
        {'text': 'MongoDB', 'value': 'mongodb'},
        {'text': 'Makefile', 'value': 'makefile'},
        {'text': 'Lua', 'value': 'lua'},
        {'text': 'LaTeX', 'value': 'latex'},
        {'text': '.ignore', 'value': 'ignore'},
        {'text': 'GraphQL', 'value': 'graphql'},
        {'text': 'PowerShell', 'value': 'powershell'},
        {'text': 'React JSX', 'value': 'jsx'},
        {'text': 'React TSX', 'value': 'tsx'},
        {'text': 'Regex', 'value': 'regex'},
        {'text': 'SQL', 'value': 'sql'},
        {'text': 'TOML', 'value': 'toml'},
        {'text': 'vim', 'value': 'vim'},
        {'text': 'YAML', 'value': 'yaml'},
    ],
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
TINYMCE_SPELLCHECKER = False  # Need to install libenchant package on linux
TINYMCE_COMPRESSOR = False

# Django Admin Interface Configuration
X_FRAME_OPTIONS = "SAMEORIGIN"
SILENCED_SYSTEM_CHECKS = ["security.W019"]

# Django Cloudinary
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': config.CLOUDINARY_CLOUD_NAME,
    'API_KEY': config.CLOUDINARY_API_KEY,
    'API_SECRET': config.CLOUDINARY_API_SECRET
    # 'API_SECRET': os.getenv("CLOUDINARY_API_SECRET")
}
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

# ----------------------------------------------------
# *** Configurable Values ***
# ----------------------------------------------------
BACKEND_SUBDOMAIN = "/backend"
BLOG_WORDS_PER_MINUTE = 200
LOGIN_URL = BACKEND_SUBDOMAIN + "/admin/login/"
LOGOUT_REDIRECT_URL = '/'
