#!/bin/bash
set -e

echo "Waiting for database to be ready..."
sleep 5

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
