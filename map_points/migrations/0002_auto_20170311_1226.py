# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2017-03-11 12:26
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('map_points', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='mappoint',
            old_name='long',
            new_name='lng',
        ),
    ]
