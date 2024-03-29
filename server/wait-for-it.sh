#!/bin/sh

set -e

host="$1"
shift
cmd="$@"

until nc -z -v -w30 "$host" 3306; do
  >&2 echo "MySQL is unavailable - waiting"
  sleep 1
done

>&2 echo "MySQL is up - executing command"
exec $cmd
