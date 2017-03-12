#!/bin/sh

set -e

if ! [ -e venv ]; then
    ./setup.sh
fi

venv/bin/python manage.py runserver
