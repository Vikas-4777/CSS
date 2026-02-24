#!/bin/bash

echo "==================================="
echo "Course Selection System - Quick Start"
echo "==================================="

# Check if MySQL is running
if ! pgrep -x "mysqld" > /dev/null; then
    echo "❌ MySQL is not running. Please start MySQL first."
    exit 1
fi

echo "✓ MySQL is running"

# Setup database
echo ""
echo "Setting up database..."
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS course_selection_db;"
echo "✓ Database created"

# Start backend
echo ""
echo "Starting backend..."
cd backend
mvn spring-boot:run &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 15

# Start frontend
echo ""
echo "Starting frontend..."
cd frontend
npm install
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "==================================="
echo "✓ Application started successfully!"
echo "==================================="
echo "Backend: http://localhost:8080"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"
echo "==================================="

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
