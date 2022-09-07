#!/bin/sh

echo "Waiting for postgres..."

while ! nc -z db 5432; do
  sleep 0.1
done

echo "PostgreSQL started"

python manage.py migrate --noinput || exit 1
python manage.py collectstatic --no-input
python manage.py runserver 0.0.0.0:8000

exec "$@"
