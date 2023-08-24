import random
import string
import time
from django.utils.text import slugify
from django.db import models
from django.dispatch import receiver
import uuid
import os
import base64
from django.contrib.staticfiles import finders


def random_string_generator(size=4, chars=string.ascii_lowercase + string.digits):
    """[Generates random string]

    Args:
        size (int, optional): [size of string to generate]. Defaults to 4.
        chars ([str], optional): [characters to use]. Defaults to string.ascii_lowercase+string.digits.

    Returns:
        [str]: [Generated random string]
    """
    return "".join(random.choice(chars) for _ in range(size))


def random_number_generator(size=4, chars="1234567890"):
    """[Generates random number]

    Args:
        size (int, optional): [size of number to generate]. Defaults to 4.
        chars (str, optional): [numbers to use]. Defaults to '1234567890'.

    Returns:
        [str]: [Generated random number]
    """
    return "".join(random.choice(chars) for _ in range(size))


def simple_random_string():
    """[Generates simple random string]

    Returns:
        [str]: [Generated random string]
    """
    timestamp_m = time.strftime("%Y")
    timestamp_d = time.strftime("%m")
    timestamp_y = time.strftime("%d")
    timestamp_now = time.strftime("%H%M%S")
    random_str = random_string_generator()
    random_num = random_number_generator()
    bindings = (
        random_str
        + timestamp_d
        + random_num
        + timestamp_now
        + timestamp_y
        + random_num
        + timestamp_m
    )
    return bindings


def simple_random_string_with_timestamp(size=None):
    """[Generates random string with timestamp]

    Args:
        size ([int], optional): [Size of string]. Defaults to None.

    Returns:
        [str]: [Generated random string]
    """
    timestamp_m = time.strftime("%Y")
    timestamp_d = time.strftime("%m")
    timestamp_y = time.strftime("%d")
    random_str = random_string_generator()
    random_num = random_number_generator()
    bindings = random_str + timestamp_d + timestamp_m + timestamp_y + random_num
    if not size == None:
        return bindings[0:size]
    return bindings


# def unique_slug_generator(instance, field=None, new_slug=None):
#     """[Generates unique slug]

#     Args:
#         instance ([Model Class instance]): [Django Model class object instance].
#         field ([Django Model Field], optional): [Django Model Class Field]. Defaults to None.
#         new_slug ([str], optional): [passed new slug]. Defaults to None.

#     Returns:
#         [str]: [Generated unique slug]
#     """
#     if field == None:
#         field = instance.title
#     if new_slug is not None:
#         slug = new_slug
#     else:
#         slug = slugify(field[:50])

#     Klass = instance.__class__
#     qs_exists = Klass.objects.filter(slug=slug).exists()
#     if qs_exists:
#         new_slug = "{slug}-{randstr}".format(
#             slug=slug,
#             randstr=random_string_generator(size=4)
#         )
#         return unique_slug_generator(instance, new_slug=new_slug)
#     return slug


# def is_url(url):
#     """[Checks if a provided string is URL or Not]

#     Args:
#         url ([str]): [URL String]

#     Returns:
#         [bool]: [returns True if provided string is URL, otherwise returns False]
#     """

#     min_attr = ('scheme', 'netloc')

#     try:
#         result = urlparse(url)
#         if all([result.scheme, result.netloc]):
#             return True
#         else:
#             return False
#     except:
#         return False


# def autoUniqueIdWithField(fieldname):
#     """[Generates auto slug integrating model's field value and UUID]

#     Args:
#         fieldname ([str]): [Model field name to use to generate slug]
#     """

#     def decorator(model):
#         # some sanity checks first
#         assert hasattr(model, fieldname), f"Model has no field {fieldname}"
#         assert hasattr(model, "slug"), "Model is missing a slug field"

#         @receiver(models.signals.pre_save, sender=model, weak=False)
#         def generate_unique_id(sender, instance, *args, raw=False, **kwargs):
#             if not raw and not getattr(instance, fieldname):
#                 source = getattr(instance, fieldname)

#                 def generate():
#                     uuid = random_number_generator(size=12)
#                     Klass = instance.__class__
#                     qs_exists = Klass.objects.filter(uuid=uuid).exists()
#                     if qs_exists:
#                         generate()
#                     else:
#                         instance.uuid = uuid
#                     pass

#                 # generate uuid
#                 generate()

#         return model
#     return decorator


def autoSlugWithFieldAndUUID(fieldname):
    """[Generates auto slug integrating model's field value and UUID]

    Args:
        fieldname ([str]): [Model field name to use to generate slug]
    """

    def decorator(model):
        # some sanity checks first
        assert hasattr(model, fieldname), f"Model has no field {fieldname}"
        assert hasattr(model, "slug"), "Model is missing a slug field"

        @receiver(models.signals.pre_save, sender=model, weak=False)
        def generate_slug(sender, instance, *args, raw=False, **kwargs):
            if not raw and not instance.slug:
                source = getattr(instance, fieldname)
                if source:
                    try:
                        slug = slugify(source)[:123] + "-" + str(uuid.uuid4())
                        Klass = instance.__class__
                        qs_exists = Klass.objects.filter(slug=slug).exists()
                        if qs_exists:
                            new_slug = "{slug}-{randstr}".format(
                                slug=slug,
                                randstr=random_string_generator(size=4)
                            )
                            instance.slug = new_slug
                        else:
                            instance.slug = slug
                    except Exception as e:
                        instance.slug = simple_random_string()
                else:
                    instance.slug = str(uuid.uuid4())
        return model
    return decorator


def autoslugFromField(fieldname):
    """[Generates auto slug from model's field value]

    Args:
        fieldname ([str]): [Model's field name which would be used to generate slug]
    """

    def decorator(model):
        # some sanity checks first
        assert hasattr(model, fieldname), f"Model has no field {fieldname!r}"
        assert hasattr(model, "slug"), "Model is missing a slug field"

        @receiver(models.signals.pre_save, sender=model, weak=False)
        def generate_slug(sender, instance, *args, raw=False, **kwargs):
            if not raw and not instance.slug:
                source = getattr(instance, fieldname)
                try:
                    slug = slugify(source)
                    Klass = instance.__class__
                    qs_exists = Klass.objects.filter(slug=slug).exists()
                    if qs_exists:
                        instance.slug = slugify(source)[:123] + "-" + str(uuid.uuid4())
                    else:
                        instance.slug = slug
                except Exception as e:
                    instance.slug = simple_random_string()
        return model
    return decorator


def autoSlugFromUUID():
    def decorator(model):
        assert hasattr(model, "slug"), "Model is missing a slug field"

        @receiver(models.signals.pre_save, sender=model, weak=False)
        def generate_slug(sender, instance, *args, raw=False, **kwargs):
            if not raw and not instance.slug:
                try:
                    slug = str(uuid.uuid4())
                    Klass = instance.__class__
                    qs_exists = Klass.objects.filter(slug=slug).exists()
                    if qs_exists:
                        new_slug = "{slug}-{randstr}".format(
                            slug=slug,
                            randstr=random_string_generator(size=4)
                        )
                        instance.slug = new_slug
                    else:
                        instance.slug = slug
                except Exception as e:
                    instance.slug = simple_random_string()

        return model

    return decorator


def generate_unique_username_from_email(instance, exists=False):
    """[Generates unique username from email]

    Args:
        instance ([model class object instance]): [model class object instance]

    Raises:
        ValueError: [If found invalid email]

    Returns:
        [str]: [unique username]
    """

    # get email from instance
    email = instance.email

    if not email:
        raise ValueError("Invalid email!")

    def generate_username(email):
        if exists:
            username = slugify(email.split("@")[0][:96]) + "-" + random_string_generator(size=4)
        else:
            username = slugify(email.split("@")[0][:100])
        return username

    generated_username = generate_username(email=email)

    Klass = instance.__class__
    qs_exists = Klass.objects.filter(username=generated_username).exists()

    if qs_exists:
        # recursive call
        generate_unique_username_from_email(instance=instance, exists=True)

    return generated_username


# def image_as_base64(image_file, format='png'):
#     """
#     :param `image_file` for the complete path of image.
#     :param `format` is format for image, eg: `png` or `jpg`.
#     """
#     if not os.path.isfile(image_file):
#         return None

#     encoded_string = ''
#     with open(image_file, 'rb') as img_f:
#         encoded_string = base64.b64encode(img_f.read())
#     return 'data:image/%s;base64,%s' % (format, encoded_string)


def get_static_file_path(static_path):
    """
    Get the absolute file path for a static file.
    :param static_path: The static file path relative to the static root.
    :return: The absolute file path or None if the file is not found.
    """
    static_file = finders.find(static_path)
    if static_file:
        return static_file
    return


def image_as_base64(image_file):
    """
    :param `image_file` for the complete path of the image.
    """
    if not os.path.isfile(image_file):
        print(f"Image file not found: {image_file}")
        return

    # Get the file extension dynamically
    extension = os.path.splitext(image_file)[1][1:]
    encoded_string = ""

    with open(image_file, "rb") as img_f:
        encoded_string = base64.b64encode(img_f.read()).decode("utf-8")

    return f"data:image/{extension};base64,{encoded_string}"


def file_as_base64(file_path):
    """
    Convert a file to base64.

    :param file_path: The complete path of the file.
    :return: The base64 representation of the file.
    """
    if not os.path.isfile(file_path):
        print(f"File not found: {file_path}")
        return

    # Get the file extension dynamically
    extension = os.path.splitext(file_path)[1][1:]
    encoded_string = ""

    with open(file_path, "rb") as file:
        encoded_string = base64.b64encode(file.read()).decode("utf-8")

    return f"data:application/{extension};base64,{encoded_string}"


def get_client_ip(request):
    """
    Get the client's IP address from the request.
    """
    # Get the client's IP address from the X-Forwarded-For header
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip_address = x_forwarded_for.split(',')[0]
    else:
        ip_address = request.META.get('REMOTE_ADDR')
    return ip_address
