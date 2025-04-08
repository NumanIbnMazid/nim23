from project.router import router
from grabit.api.views import DownloadViewset, FetchMediaInfoViewSet

router.register("grabit-download", DownloadViewset, basename="grabit_download")
router.register("grabit-fetch-media-info", FetchMediaInfoViewSet, basename="grabit_fetch_media_info")
