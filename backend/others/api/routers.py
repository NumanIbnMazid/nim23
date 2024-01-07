from project.router import router
from others.api.views import NewsletterSubscriptionViewset


router.register("newsletter-subscription", NewsletterSubscriptionViewset, basename="newsletter_subscription")
