#!/bin/sh

yarn run lint
yarn run start

exec "$@"
