function build-stack {
    docker-compose -p <PROJECT NAME> build $@
}

function bootstrap-backend {
    docker-compose run backend django-admin.py startproject <PROJECT NAME> \
        && cp -r backend/<PROJECT NAME>/* backend \
        && rm backend/<PROJECT NAME>/manage.py \
        && rm -rf backend/<PROJECT NAME>/<PROJECT NAME> \
        && docker-compose run backend ./manage.py startapp api
}

function bootstrap {
    build-stack
    bootstrap-backend
}

function start-stack {
    docker-compose -p <PROJECT NAME> up -d
}

function stop-stack {
    docker-compose -p <PROJECT NAME> kill
}

function restart-stack {
    stop-stack && start-stack
}

function logs {
    docker-compose -p <PROJECT NAME> logs -f $@
}

function db-make-migrations {
    docker exec <PROJECT NAME>_backend_1 python manage.py makemigrations api
}

function db-migrate {
    docker exec <PROJECT NAME>_backend_1 python manage.py migrate
}

function create-su {
    docker exec -it <PROJECT NAME>_backend_1 python manage.py createsuperuser
}

echo -e "

Available commands:

\tbootstrap

\tbuild-stack
\tbootstrap-backend
\tstart-stack
\tstop-stack
\trestar-stack
\tlogs
\tdb-make-migrations
\tdb-migrate
\tcreate-su

"
