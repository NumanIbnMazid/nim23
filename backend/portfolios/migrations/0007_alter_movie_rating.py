# Generated by Django 4.0.10 on 2023-07-25 19:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('portfolios', '0006_professionalexperience_job_location_type_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movie',
            name='rating',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
