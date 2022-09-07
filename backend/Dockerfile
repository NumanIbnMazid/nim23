FROM python:3.9.12-alpine3.15
ENV PYTHONUNBUFFERED 1

RUN mkdir /app
WORKDIR /app

ADD requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

ADD entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ADD . /app

ENTRYPOINT [ "sh", "-c", "/app/entrypoint.sh" ]
