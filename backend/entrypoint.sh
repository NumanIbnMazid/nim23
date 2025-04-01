#!/bin/sh

# Currently using remote DB. Uncomment while use Docker DB.
# echo "Waiting for postgres..."

# while ! nc -z db 5432; do
#   sleep 0.1
# done

# echo "PostgreSQL started"

echo "Starting Tor in the background..."
tor &  # Start Tor in the background

# Wait until Tor's SOCKS5 proxy (9050) is ready
echo "Waiting for Tor to start..."
while ! nc -z 127.0.0.1 9050; do
  sleep 1
done
echo "Tor is running!"

python manage.py migrate --noinput || exit 1

# run entrypoint.py to create superuser and for other required staffs
python entrypoint.py

python manage.py collectstatic --no-input
python manage.py runserver 0.0.0.0:8000

exec "$@"
