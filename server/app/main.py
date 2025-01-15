from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import plan, auth
from .database import engine, Base
from . import models
import os
import datetime

# Create database tables
def init_db():
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully!")
    except Exception as e:
        print(f"Error creating database tables: {e}")

# Initialize the FastAPI app
app = FastAPI(title="Healthcare Plan Finder API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(plan.router)

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Healthcare Plan Finder API!"}

@app.get("/health")
def health_check():
    """Health check endpoint"""
    try:
        # Try to make a database query
        with engine.connect() as conn:
            conn.execute("SELECT 1")
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": str(e),
            "timestamp": datetime.datetime.now().isoformat()
        } 