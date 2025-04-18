import subprocess


def run():
    subprocess.run(
        [
            "gunicorn",
            "project.asgi:application",  # Your ASGI app path
            "--worker-class",
            "uvicorn.workers.UvicornWorker",  # Use Uvicorn worker for ASGI
            "--bind",
            "localhost:8000",
            "--reload",  # Enable autoreload in development
            "--timeout",
            "300",
            "--log-level",
            "debug"
        ]
    )


if __name__ == "__main__":
    run()
