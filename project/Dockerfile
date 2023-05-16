FROM python:3.9.12-alpine3.15
ENV PYTHONUNBUFFERED 1

# Install required dependencies
RUN apk update && apk add gcc musl-dev libffi-dev

RUN mkdir /app
WORKDIR /app

ADD requirements.txt /app/requirements.txt

# Update pip to latest version
RUN python -m pip install --upgrade pip

# Install required python packages from requirements.txt
RUN pip install -r requirements.txt

# Add entrypoint.sh and make it executable
ADD entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ADD . /app

ENTRYPOINT [ "sh", "-c", "/app/entrypoint.sh" ]
