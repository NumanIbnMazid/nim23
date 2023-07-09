from config.router import router
from portfolios.api.skills.views import SkillViewset


router.register("skills", SkillViewset, basename="skills")
