# Generated by Django 4.2.1 on 2023-06-14 19:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0002_user_is_portfolio_user"),
    ]

    operations = [
        migrations.RenameField(
            model_name="user",
            old_name="nick_name",
            new_name="nickname",
        ),
    ]