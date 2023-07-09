from config.router import router
from portfolios.api.movies.views import MovieViewset


router.register("movies", MovieViewset, basename="movies")
