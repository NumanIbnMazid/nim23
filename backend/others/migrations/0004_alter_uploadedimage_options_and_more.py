# Generated by Django 4.0.10 on 2025-03-19 19:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('others', '0003_uploadedimage_file_alter_uploadedimage_file_name'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='uploadedimage',
            options={'ordering': ('-created_at',), 'verbose_name': 'Uploaded Image', 'verbose_name_plural': 'Uploaded Images'},
        ),
        migrations.AlterField(
            model_name='uploadedimage',
            name='file_name',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='uploadedimage',
            name='folder_path',
            field=models.CharField(default='default/', help_text='Path within IMAGE_UPLOADS/', max_length=255),
        ),
        migrations.AlterModelTable(
            name='uploadedimage',
            table='uploaded_images',
        ),
    ]
