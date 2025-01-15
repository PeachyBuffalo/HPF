from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, List
from datetime import datetime

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# User schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr
    first_name: str
    last_name: str
    location: Optional[str]
    age: Optional[int]
    income_level: Optional[float]
    household_size: Optional[int]

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True

# Healthcare Plan schemas
class HealthcarePlanBase(BaseModel):
    name: str
    coverage_type: str
    provider: str
    monthly_premium: float
    deductible: float
    max_out_of_pocket: float
    description: Optional[str]
    provider_network: Optional[str]
    is_active: bool = True

class HealthcarePlanCreate(HealthcarePlanBase):
    pass

class HealthcarePlan(HealthcarePlanBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True

# User Preference schemas
class UserPreferenceBase(BaseModel):
    preferred_providers: Optional[Dict]
    chronic_conditions: Optional[Dict]
    prescription_needs: Optional[Dict]

class UserPreferenceCreate(UserPreferenceBase):
    pass

class UserPreference(UserPreferenceBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True

# Plan Rating schemas
class PlanRatingBase(BaseModel):
    rating: int
    review: Optional[str]

class PlanRatingCreate(PlanRatingBase):
    plan_id: int

class PlanRating(PlanRatingBase):
    id: int
    user_id: int
    plan_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True 