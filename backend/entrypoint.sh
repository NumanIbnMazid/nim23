#!/bin/bash

python manage.py migrate --noinput || exit 1

# run entrypoint.py to create superuser and for other required staffs
python entrypoint.py

python manage.py collectstatic --no-input

# Start Supervisor
exec supervisord -c /etc/supervisor/supervisord.conf
