#!/bin/sh

set -e

if [ ! -d "venv" ]; then
    ./setup.sh
fi

venv/bin/python manage.py runserver
