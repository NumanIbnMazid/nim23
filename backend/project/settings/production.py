from project.settings.base import *

# ----------------------------------------------------
# *** Allowed Hosts ***
# ----------------------------------------------------
ALLOWED_HOSTS = [
    "https://nim23.com"
]

# ----------------------------------------------------
# *** Static and Media Files Configuration ***
# ----------------------------------------------------
# STATIC & MEDIA URL
STATIC_URL = "/static/"
MEDIA_URL = "/media/"
PUBLIC_ROOT = os.path.join(BASE_DIR, "/home/nimcom/public_html/")
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
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_SAMESITE = 'Strict'
SESSION_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
X_FRAME_OPTIONS = 'DENY'
# set low, but when site is ready for deployment, set to at least 15768000 (6 months)
SECURE_HSTS_SECONDS = 15768000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Neededf for CorsHeader
CORS_ORIGIN_ALLOW_ALL = False
CORS_ORIGIN_WHITELIST = (
    "https://nim23.com"
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
CORS_ALLOW_METHODS = (
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS'
)

# ----------------------------------------------------
# *** Site Info ***
# ----------------------------------------------------
BACKEND_BASE_URL = "https://nim23.com/backend"
FRONTEND_BASE_URL = "https://nim23.com"

# ----------------------------------------------------
# *** Other Definitions ***
# ----------------------------------------------------
LOGIN_URL = "/backend/admin/login/"
