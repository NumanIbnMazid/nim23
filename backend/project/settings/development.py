from project.settings.base import *

# ----------------------------------------------------
# *** Allowed Hosts ***
# ----------------------------------------------------
ALLOWED_HOSTS = ["*"]

# ----------------------------------------------------
# *** Static and Media Files Configuration ***
# ----------------------------------------------------
# STATIC & MEDIA URL
STATIC_URL = "/static/"
MEDIA_URL = "/media/"
PUBLIC_ROOT = os.path.join(BASE_DIR, "public/")
# STATIC & MEDIA ROOT
MEDIA_ROOT = os.path.join(PUBLIC_ROOT, "media/")
STATIC_ROOT = os.path.join(PUBLIC_ROOT, "static/")
# Static Files Directories
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, "public/", "staticfiles/"),
)

# ----------------------------------------------------
# *** Security ***
# ----------------------------------------------------
CORS_ORIGIN_ALLOW_ALL = False
CORS_ORIGIN_WHITELIST = (
    'http://localhost:3000',  # frontend URL here
)
CORS_ALLOW_METHODS = (
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
)
CORS_ALLOW_HEADERS = (
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
)

# ----------------------------------------------------
# *** Site Info ***
# ----------------------------------------------------
BACKEND_BASE_URL = "http://localhost:8000"
FRONTEND_BASE_URL = "http://localhost:3000"

# ----------------------------------------------------
# *** Other Definitions ***
# ----------------------------------------------------
LOGIN_URL = "/admin/login/"
