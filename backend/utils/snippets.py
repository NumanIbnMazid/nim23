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
from urllib.parse import urlparse
from bs4 import BeautifulSoup
import markdown2
import markdown
import markdownify
import requests


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
    Convert an image file or URL to a base64-encoded string.
    
    :param image_file: The path to the image file or URL of the image.
    :return: Base64-encoded image string in the format 'data:image/{extension};base64,{encoded_string}'.
    """
    # Determine if the input is a URL or a file path
    if urlparse(image_file).scheme in ['http', 'https']:
        # Handle image URL
        try:
            response = requests.get(image_file)
            response.raise_for_status()  # Raise an exception for HTTP errors
            image_data = response.content
        except requests.RequestException as e:
            return
    else:
        # Handle file path
        if not os.path.isfile(image_file):
            return
        with open(image_file, "rb") as img_f:
            image_data = img_f.read()
    
    # Get the file extension dynamically
    extension = os.path.splitext(image_file)[1][1:] if not urlparse(image_file).scheme else image_file.split('.')[-1]
    
    # Encode the image data to base64
    encoded_string = base64.b64encode(image_data).decode("utf-8")
    
    return f"data:image/{extension};base64,{encoded_string}"


def file_as_base64(file_path):
    """
    Convert a file or URL to base64.

    :param file_path: The path to the file or URL of the file.
    :return: Base64 representation of the file in the format 'data:application/{extension};base64,{encoded_string}'.
    """
    # Determine if the input is a URL or a file path
    if urlparse(file_path).scheme in ['http', 'https']:
        # Handle file URL
        try:
            response = requests.get(file_path)
            response.raise_for_status()  # Raise an exception for HTTP errors
            file_data = response.content
        except requests.RequestException as e:
            return
    else:
        # Handle local file path
        if not os.path.isfile(file_path):
            return
        with open(file_path, "rb") as file:
            file_data = file.read()
    
    # Get the file extension dynamically
    extension = os.path.splitext(file_path)[1][1:] if not urlparse(file_path).scheme else file_path.split('.')[-1]
    
    # Define MIME type based on extension
    mime_types = {
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'pdf': 'application/pdf',
        'txt': 'text/plain',
        'json': 'application/json',
        'xml': 'application/xml'
    }
    mime_type = mime_types.get(extension, 'application/octet-stream')

    # Encode the file data to base64
    encoded_string = base64.b64encode(file_data).decode("utf-8")
    
    return f"data:{mime_type};base64,{encoded_string}"


def get_client_ip(request):
    """
    Get the client's IP address from the request.
    """
    # Get the client's IP address from the X-Forwarded-For header
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        clientID = x_forwarded_for.split(',')[0]
    else:
        clientID = request.META.get('REMOTE_ADDR')
    return clientID


def markdown_to_html(md_text):
    """
    Convert Markdown to clean HTML while ensuring correct lists, line breaks, steps, and syntax highlighting.
    Uses BOTH markdown (for better code highlighting) and markdown2 (for better lists & formatting).
    """

    if not md_text.strip():
        return ""

    # **Fix: If Markdown starts with a code block, prepend a hidden paragraph & line break**
    prepend_hidden_p = False
    if md_text.strip().startswith("```"):
        md_text = '<p style="display:none;">hidden-content</p>\n\n' + md_text  # Add hidden content
        prepend_hidden_p = True

    # **Step 1: Convert Markdown Using markdown (Better Code Highlighting)**
    md_html = markdown.markdown(
        md_text.strip(),
        extensions=["fenced_code", "codehilite"]
    )

    # **Step 2: Convert Markdown Using markdown2 (Better Lists & Formatting)**
    md2_html = markdown2.markdown(md_text.strip(), extras=[
        "fenced-code-blocks",
        "tables",
        "strike",
        "code-friendly",
        "footnotes",
        "cuddled-lists",
        "metadata",
        "header-ids",
        "break-on-newline",
        "inline-code",
    ])

    # **Step 3: Merge The Best Parts of Both Outputs**
    soup = BeautifulSoup(md2_html, "html.parser")  # Start with markdown2 output

    # **Find All Code Blocks in markdown Output**
    md_soup = BeautifulSoup(md_html, "html.parser")
    md_code_blocks = md_soup.find_all("pre")

    # **Find All Code Blocks in markdown2 Output**
    md2_code_blocks = soup.find_all("pre")

    # **Replace markdown2 Code Blocks With Proper markdown Code Blocks**
    for md2_block, md_block in zip(md2_code_blocks, md_code_blocks):
        md2_block.replace_with(md_block)

    # **Ensure Language Classes Are Applied Correctly**
    for pre in soup.find_all("pre"):
        code_block = pre.find("code")

        if code_block:
            # Extract language class from `<code>`
            class_attr = code_block.get("class", [])
            language = "plaintext"

            for cls in class_attr:
                if cls.startswith("language-"):
                    language = cls.replace("language-", "")

            # **Move language class to `<pre>` and remove from `<code>`**
            pre["class"] = f"language-{language}"
            del code_block["class"]

    # **Ensure an extra line break after the hidden paragraph if added**
    if prepend_hidden_p:
        first_pre = soup.find("pre")
        if first_pre:
            first_pre.insert_before("\n")

    final_html = str(soup)
    return final_html.strip()



def html_to_markdown(html_text):
    """
    Convert HTML to clean Markdown while ensuring:
    - Correct fenced code blocks (```python)
    - Proper indentation & spacing
    - Fixes inline `<code>` formatting
    - Preserves ordered/unordered lists
    """

    markdown_text = markdownify.markdownify(
        html_text,
        code_language_callback=lambda el: el.get("class", [""])[0].replace("language-", "") if el.has_attr("class") else "",
        heading_style="ATX",  # Ensures headings are converted properly (e.g., ## Title)
        bullets="-",  # Uses `-` for unordered lists
        autolinks=True,  # Keeps automatic links formatted correctly
        default_title=False,  # Avoids setting default titles in links
        escape_asterisks=False,  # Prevents escaping `*`
        escape_underscores=False,  # Prevents escaping `_`
        newline_style="BACKSLASH",  # Ensures correct line breaks
    )
    return markdown_text.strip()