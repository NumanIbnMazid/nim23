#!/bin/sh

# Currently using remote DB. Uncomment while use Docker DB.
# echo "Waiting for postgres..."

# while ! nc -z db 5432; do
#   sleep 0.1
# done

# echo "PostgreSQL started"

python manage.py migrate --noinput || exit 1

# run entrypoint.py to create superuser and for other required staffs
python entrypoint.py

python manage.py collectstatic --no-input
# python manage.py runserver 0.0.0.0:8000

# Start Gunicorn server with increased timeout
gunicorn --bind 0.0.0.0:8000 \
         --workers 3 \
         --threads 3 \
         --timeout 120 \
         --access-logfile - \
         --error-logfile - \
         project.wsgi:application

exec "$@"
