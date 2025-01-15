from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    password_hash = Column(String(255))
    first_name = Column(String(50))
    last_name = Column(String(50))
    location = Column(String(100))
    age = Column(Integer)
    income_level = Column(Float)
    household_size = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    preferences = relationship("UserPreference", back_populates="user", uselist=False)
    ratings = relationship("PlanRating", back_populates="user")

class HealthcarePlan(Base):
    __tablename__ = "healthcare_plans"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True)
    coverage_type = Column(String(50), index=True)  # HMO, PPO, etc.
    provider = Column(String(100), index=True)
    monthly_premium = Column(Float)
    deductible = Column(Float)
    max_out_of_pocket = Column(Float)
    description = Column(Text)
    provider_network = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    ratings = relationship("PlanRating", back_populates="plan")

class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    preferred_providers = Column(JSON)
    chronic_conditions = Column(JSON)
    prescription_needs = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="preferences")

class PlanRating(Base):
    __tablename__ = "plan_ratings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    plan_id = Column(Integer, ForeignKey("healthcare_plans.id", ondelete="CASCADE"))
    rating = Column(Integer)  # 1-5 stars
    review = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="ratings")
    plan = relationship("HealthcarePlan", back_populates="ratings") 