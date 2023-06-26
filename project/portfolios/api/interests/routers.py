from config.router import router
from portfolios.api.interests.views import InterestViewset


router.register("interests", InterestViewset, basename="interests")
