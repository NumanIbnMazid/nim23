# Generated by Django 4.0.10 on 2025-03-15 00:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('code_snippets', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='codesnippet',
            name='content_in_markdown',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='codesnippet',
            name='content',
            field=models.TextField(blank=True),
        ),
    ]
