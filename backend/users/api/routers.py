from users.api.views import UserViewset
from project.router import router


router.register("users", UserViewset, basename="users")
