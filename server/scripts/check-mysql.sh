#!/bin/bash

host="db"
user="${MYSQL_USER}"
password="${MYSQL_PASSWORD}"
database="${MYSQL_DATABASE}"

echo "Checking MySQL connection..."
mysql -h"$host" -u"$user" -p"$password" -e "SELECT 1;" "$database" 