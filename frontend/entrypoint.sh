#!/bin/sh

yarn run lint
yarn run start --host

exec "$@"
