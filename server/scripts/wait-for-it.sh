#!/bin/bash
# wait-for-it.sh

set -e

host="$1"
shift
cmd="$@"

echo "Waiting for MySQL at host: $host"
echo "Will execute command: $cmd"

max_attempts=30
attempt=1

# Remove the port from the host if it's included
host_without_port=$(echo $host | cut -d: -f1)

until nc -z -v -w30 "$host_without_port" 3306 || [ $attempt -gt $max_attempts ]
do
  echo "Attempt $attempt of $max_attempts: Waiting for database connection at $host_without_port:3306..."
  # Try to get more information about the database
  nc -zv "$host_without_port" 3306 2>&1 || echo "Connection attempt failed"
  attempt=$((attempt + 1))
  sleep 5
done

if [ $attempt -gt $max_attempts ]; then
  echo "Failed to connect to database after $max_attempts attempts"
  exit 1
fi

echo "Database is up - waiting 5s for it to be ready..."
sleep 5

echo "Starting application..."
exec $cmd 