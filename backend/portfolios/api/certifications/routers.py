from project.router import router
from portfolios.api.certifications.views import CertificationViewset


router.register("certifications", CertificationViewset, basename="certifications")
