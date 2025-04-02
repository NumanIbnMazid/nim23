#!/bin/bash

# ================= bgutil-ytdlp-pot-provider ========================
# Start bgutil-ytdlp-pot-provider
echo "Starting bgutil-ytdlp-pot-provider..."
cd /app/bgutil-ytdlp-pot-provider/server/
npx tsc
node build/main.js --port 4416 &

# Wait for bgutil-ytdlp-pot-provider to be ready
echo "Waiting for bgutil-ytdlp-pot-provider to be ready..."
while ! nc -z 127.0.0.1 4416; do   
  sleep 0.5
done
echo "bgutil-ytdlp-pot-provider is up and running."


# ================= Django ========================
cd /app/

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
