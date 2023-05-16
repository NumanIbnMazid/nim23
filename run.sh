#!/usr/bin/env bash

docker-compose run --rm --entrypoint '/bin/sh' django_app -c 'python manage.py collectstatic --no-input'
