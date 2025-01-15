# Healthcare Plan Finder

A full-stack application that helps users find and compare healthcare plans based on their needs and preferences. Built with FastAPI (Python) backend and React.js frontend.

## Project Structure 

```
healthcare-plan-finder/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── LoginForm.js
│   │   │   └── plans/
│   │   │       ├── PlanList.js
│   │   │       └── PlanRecommendation.js
│   │   ├── services/
│   │   │   └── api.js
│   │   └── App.js
│   └── package.json
│
├── server/                  # FastAPI backend
│   ├── app/
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   └── plan.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── database.py
│   │   └── main.py
│   └── requirements.txt
│
└── docker-compose.yml
```

## Prerequisites

- Python 3.8+
- Node.js 14+
- MySQL 8.0+
- Docker and Docker Compose (optional)

## Features

- User authentication with JWT
- Healthcare plan browsing with filters
- Plan recommendations based on user preferences
- Plan details and comparisons
- User preference management

## Installation

### Quick Setup

Using Make commands:

```bash
# For Docker setup
make setup-docker

# For local setup
make setup

# To start services
make start

# To stop services
make stop

# To clean everything
make clean
```

### Option 1: Using Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/peachybuffalo/healthcare-plan-finder.git
cd healthcare-plan-finder
```

2. Create a `.env` file in the root directory or copy the .env.example file and rename it to .env:
```env
# Backend
DATABASE_URL=mysql+pymysql://root:password@db/healthcare_db
SECRET_KEY=your-secret-key-here

# Frontend
REACT_APP_API_URL=http://localhost:8000/api/v1
```

3. Build and run the Docker containers:
```bash
docker-compose up --build
```

The services will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Option 2: Manual Setup

#### Backend Setup

1. Set up a virtual environment and install dependencies:
```bash
cd server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. Set up MySQL database:
```bash
mysql -u root -p
CREATE DATABASE healthcare_db;
```

3. Start the FastAPI server:
```bash
uvicorn app.main:app --reload
```

#### Frontend Setup

1. Install dependencies:
```bash
cd client
npm install
```

2. Start the development server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /token` - Get authentication token

### Healthcare Plans
- `GET /api/v1/plans/` - List all healthcare plans
- `POST /api/v1/plans/` - Create a new plan
- `GET /api/v1/plans/{plan_id}` - Get plan details
- `POST /api/v1/plans/{plan_id}/rate` - Rate a plan
- `POST /api/v1/recommend/` - Get plan recommendations

## Database Schema

### Users
- id (Primary Key)
- username
- email
- password_hash
- first_name
- last_name
- location
- age
- income_level
- household_size

### Healthcare Plans
- id (Primary Key)
- name
- coverage_type
- provider
- monthly_premium
- deductible
- max_out_of_pocket
- description
- provider_network
- is_active

### User Preferences
- id (Primary Key)
- user_id (Foreign Key)
- preferred_providers
- chronic_conditions
- prescription_needs

### Plan Ratings
- id (Primary Key)
- user_id (Foreign Key)
- plan_id (Foreign Key)
- rating
- review

## Development

### Running Tests

Backend tests:
```bash
cd server
pytest
```

Frontend tests:
```bash
cd client
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request


