from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import time

# Get database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL")

def create_db_engine(retries=5, delay=5):
    for attempt in range(retries):
        try:
            print(f"Attempting to connect to database: {DATABASE_URL}")
            engine = create_engine(
                DATABASE_URL,
                pool_pre_ping=True,
                pool_recycle=3600,
                pool_size=5,
                max_overflow=10,
                echo=bool(os.getenv("DEBUG", False))
            )
            # Test the connection
            with engine.connect() as conn:
                conn.execute("SELECT 1")
            print("Database connection successful!")
            return engine
        except Exception as e:
            if attempt < retries - 1:
                print(f"Database connection attempt {attempt + 1} failed: {str(e)}")
                print(f"Retrying in {delay} seconds...")
                time.sleep(delay)
            else:
                print(f"Failed to connect to database after {retries} attempts: {str(e)}")
                raise

engine = create_db_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 