#!/bin/bash

# run migrations
python manage.py makemigrations --noinput || exit 1
python manage.py migrate --noinput || exit 1

# run entrypoint.py to create superuser and for other required staffs
python entrypoint.py

# collect static files
python manage.py collectstatic --no-input

# Start Supervisor
# Start Supervisor if not already running
if ! ps aux | grep -q "[s]upervisor"; then
    echo "Starting supervisor service ⏳"
    exec /usr/bin/supervisord -nc /etc/supervisor/supervisord.conf
    echo "Supervisor started ✅"
else
    echo "Supervisor is currently running ✅"
fi

exec "$@"
