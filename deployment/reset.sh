#!/bin/bash

echo "🧹 Cleaning up Docker..."
docker compose down -v
docker volume rm deployment_postgres_data 2>/dev/null || true
docker rmi deployment-backend 2>/dev/null || true

echo "🚀 Starting fresh..."
docker compose up --build
