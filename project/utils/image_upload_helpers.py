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
def get_user_image_path(instance, filename):
    new_filename = get_filename(filename)
    return "Users/{username}/Images/{final_filename}".format(
        username=slugify(instance.username[:50]), final_filename=new_filename
    )


# Professional Experience Company Image Path
def get_professional_experience_company_image_path(instance, filename):
    new_filename = get_filename(filename)
    return "ProfessionalExperiences/{company}/Images/{final_filename}".format(
        company=slugify(instance.company[:50]), final_filename=new_filename
    )


# Skill Image Path
def get_skill_image_path(instance, filename):
    new_filename = get_filename(filename)
    return "Skills/{title}/Images/{final_filename}".format(
        title=slugify(instance.title[:50]), final_filename=new_filename
    )


# Education School Image Path
def get_education_school_image_path(instance, filename):
    new_filename = get_filename(filename)
    return "Educations/{school}/Images/{final_filename}".format(
        school=slugify(instance.school[:50]), final_filename=new_filename
    )

def get_education_media_path(instance, filename):
    new_filename = get_filename(filename)
    return "Educations/{school}/Media/{final_filename}".format(
        school=slugify(instance.education.school[:50]), final_filename=new_filename
    )


# Certification Image Path
def get_certification_image_path(instance, filename):
    new_filename = get_filename(filename)
    return "Certifications/{organization}/Images/{final_filename}".format(
        organization=slugify(instance.organization[:50]), final_filename=new_filename
    )

def get_certification_media_path(instance, filename):
    new_filename = get_filename(filename)
    return "Certifications/{organization}/Media/{final_filename}".format(
        organization=slugify(instance.certification.organization[:50]), final_filename=new_filename
    )
