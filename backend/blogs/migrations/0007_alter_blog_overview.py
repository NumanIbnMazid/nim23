# Generated by Django 4.0.10 on 2023-08-16 14:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blogs', '0006_alter_blog_options'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blog',
            name='overview',
            field=models.TextField(blank=True, null=True),
        ),
    ]