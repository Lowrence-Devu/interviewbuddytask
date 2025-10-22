#!/bin/bash

# Development Start Script
# This script starts both backend and frontend servers for development

echo "🚀 Starting Organization & Users Management System..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Function to start backend
start_backend() {
    print_status "Starting backend server..."
    cd server
    npm run dev &
    BACKEND_PID=$!
    cd ..
    print_success "Backend server started (PID: $BACKEND_PID)"
}

# Function to start frontend
start_frontend() {
    print_status "Starting frontend server..."
    cd client
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    print_success "Frontend server started (PID: $FRONTEND_PID)"
}

# Function to cleanup on exit
cleanup() {
    echo
    print_status "Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    print_success "Servers stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start servers
start_backend
sleep 2
start_frontend

echo
print_success "Both servers are running!"
echo
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
wait
