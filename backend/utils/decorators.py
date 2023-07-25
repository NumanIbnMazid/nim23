from django.contrib.auth.decorators import login_required, user_passes_test
from django.conf import settings

# ----------------------------------------------------
# *** authenticated_user_required ***
# ----------------------------------------------------

def authenticated_user_required(view_func):
    return login_required(view_func, login_url=settings.LOGIN_URL)

# ----------------------------------------------------
# *** is_superuser_required ***
# ----------------------------------------------------

is_superuser = user_passes_test(
    lambda user: user.is_superuser is True, login_url=settings.LOGIN_URL
)

def is_superuser_required(view_func):
    decorated_view_func = login_required(is_superuser(view_func))
    return decorated_view_func

# ----------------------------------------------------
# *** is_staff_required ***
# ----------------------------------------------------

is_staff = user_passes_test(
    lambda user: user.is_staff is True, login_url=settings.LOGIN_URL
)

def is_staff_required(view_func):
    decorated_view_func = login_required(is_staff(view_func))
    return decorated_view_func
