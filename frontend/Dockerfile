FROM node:16.17.0-alpine

RUN apk update && apk add --update yarn
RUN yarn global add webpack

WORKDIR /app

COPY package*.json /app
COPY yarn.lock /app

RUN yarn install

ADD entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

COPY . /app

ENTRYPOINT [ "sh", "-c", "/app/entrypoint.sh" ]
