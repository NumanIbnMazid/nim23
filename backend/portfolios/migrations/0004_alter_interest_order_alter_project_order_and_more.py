# Generated by Django 4.0.10 on 2023-07-23 21:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('portfolios', '0003_alter_interest_order_alter_project_order_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='interest',
            name='order',
            field=models.PositiveIntegerField(blank=True),
        ),
        migrations.AlterField(
            model_name='project',
            name='order',
            field=models.PositiveIntegerField(blank=True),
        ),
        migrations.AlterField(
            model_name='skill',
            name='order',
            field=models.PositiveIntegerField(blank=True),
        ),
    ]
