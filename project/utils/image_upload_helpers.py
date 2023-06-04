import os
import time
from django.utils.text import slugify


def get_filename(filepath):
    base_name = os.path.basename(filepath)
    name, ext = os.path.splitext(base_name)

    new_filename = "{datetime}".format(datetime=time.strftime("%Y%m%d-%H%M%S"))
    final_filename = "{new_filename}{ext}".format(new_filename=new_filename, ext=ext)
    return final_filename


# User Image Path
def upload_user_image_path(instance, filename):
    new_filename = get_filename(filename)
    return "Users/{username}/Images/{final_filename}".format(
        username=slugify(instance.username[:50]), final_filename=new_filename
    )
