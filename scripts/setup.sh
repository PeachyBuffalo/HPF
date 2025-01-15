#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting up Healthcare Plan Finder...${NC}"

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}Error: Docker is not running${NC}"
        echo -e "${YELLOW}Please start Docker Desktop and try again${NC}"
        exit 1
    fi
}

# Check if .env exists, if not create it from example
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file from example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}Created .env file. Please update it with your configurations.${NC}"
fi

# Check if running with Docker
if [ "$1" = "--docker" ]; then
    echo -e "${GREEN}Setting up with Docker...${NC}"
    check_docker
    docker-compose up --build -d
    echo -e "${GREEN}Docker containers are running!${NC}"
    echo -e "${GREEN}Frontend: http://localhost:3000${NC}"
    echo -e "${GREEN}Backend: http://localhost:8000${NC}"
    exit 0
fi

# Local setup
echo -e "${GREEN}Setting up local development environment...${NC}"

# Backend setup
echo -e "${YELLOW}Setting up Python virtual environment...${NC}"
cd server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Initialize database
echo -e "${YELLOW}Initializing database...${NC}"
python scripts/init_db.py

# Frontend setup
echo -e "${YELLOW}Setting up frontend...${NC}"
cd ../client
npm install

echo -e "${GREEN}Setup complete!${NC}"
echo -e "${YELLOW}To start the application:${NC}"
echo "1. Backend: cd server && source venv/bin/activate && uvicorn app.main:app --reload"
echo "2. Frontend: cd client && npm start" 