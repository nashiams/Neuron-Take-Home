#!/bin/bash
set -e

echo "Waiting for database to be ready..."
until PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -U "$DB_USER" -d "postgres" -c '\q' 2>/dev/null; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 2
done

echo "Database is ready!"

echo "Dropping database if exists..."
npx sequelize-cli db:drop || true

echo "Creating database..."
npx sequelize-cli db:create

echo "Running database migrations..."
npx sequelize-cli db:migrate

echo "Seeding database..."
npx sequelize-cli db:seed:all

echo "Starting application..."
exec npm start
