

"""
----------------------- * Custom Model Admin Mixins * -----------------------
"""


class CustomModelAdminMixin(object):
    """
    DOCSTRING for CustomModelAdminMixin:
    This model mixing automatically displays all fields of a model in admin panel following the criteria.
    code: @ Numan Ibn Mazid
    """

    def __init__(self, model, admin_site):
        self.list_display = [
            field.name
            for field in model._meta.fields
            if field.get_internal_type() != "TextField"
        ]
        super(CustomModelAdminMixin, self).__init__(model, admin_site)
