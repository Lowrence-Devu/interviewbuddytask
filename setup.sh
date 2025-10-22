#!/bin/bash

# Organization & Users Management System Setup Script
# This script sets up the complete full-stack application

echo "🚀 Setting up Organization & Users Management System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js (v16 or higher) first."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        print_error "Node.js version 16 or higher is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js $(node -v) is installed"
}

# Check if MySQL is installed
check_mysql() {
    if ! command -v mysql &> /dev/null; then
        print_warning "MySQL is not installed. Please install MySQL (v8.0 or higher) first."
        print_warning "You can install MySQL using:"
        print_warning "  - macOS: brew install mysql"
        print_warning "  - Ubuntu: sudo apt-get install mysql-server"
        print_warning "  - Windows: Download from https://dev.mysql.com/downloads/mysql/"
        exit 1
    fi
    
    print_success "MySQL is installed"
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd server
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    npm install
    
    if [ $? -eq 0 ]; then
        print_success "Backend dependencies installed successfully"
    else
        print_error "Failed to install backend dependencies"
        exit 1
    fi
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        print_status "Creating environment configuration..."
        cp env.example .env
        print_warning "Please edit server/.env file with your database credentials"
    else
        print_success "Environment file already exists"
    fi
    
    cd ..
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd client
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    if [ $? -eq 0 ]; then
        print_success "Frontend dependencies installed successfully"
    else
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
    
    cd ..
}

# Create database
create_database() {
    print_status "Creating database..."
    
    # Read database configuration from .env file
    if [ -f server/.env ]; then
        source server/.env
    else
        print_error "Environment file not found. Please run setup first."
        exit 1
    fi
    
    # Create database if it doesn't exist
    mysql -u "$DB_USER" -p"$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        print_success "Database '$DB_NAME' created successfully"
    else
        print_warning "Could not create database automatically. Please create it manually:"
        print_warning "mysql -u $DB_USER -p -e 'CREATE DATABASE $DB_NAME;'"
    fi
}

# Initialize database with sample data
init_database() {
    print_status "Initializing database with sample data..."
    
    cd server
    npm run init-db
    
    if [ $? -eq 0 ]; then
        print_success "Database initialized successfully"
    else
        print_error "Failed to initialize database"
        exit 1
    fi
    
    cd ..
}

# Main setup function
main() {
    echo "=========================================="
    echo "Organization & Users Management System"
    echo "Setup Script"
    echo "=========================================="
    echo
    
    # Check prerequisites
    print_status "Checking prerequisites..."
    check_node
    check_mysql
    echo
    
    # Setup backend
    setup_backend
    echo
    
    # Setup frontend
    setup_frontend
    echo
    
    # Create database
    create_database
    echo
    
    # Initialize database
    init_database
    echo
    
    # Final instructions
    print_success "Setup completed successfully! 🎉"
    echo
    echo "Next steps:"
    echo "1. Edit server/.env file with your database credentials if needed"
    echo "2. Start the backend server:"
    echo "   cd server && npm run dev"
    echo "3. Start the frontend (in a new terminal):"
    echo "   cd client && npm run dev"
    echo "4. Open http://localhost:3000 in your browser"
    echo
    echo "API endpoints will be available at http://localhost:5000"
    echo
    print_success "Happy coding! 🚀"
}

# Run main function
main
