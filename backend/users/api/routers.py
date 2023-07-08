from .views import UserViewset
from config.router import router


router.register("users", UserViewset, basename="users")
