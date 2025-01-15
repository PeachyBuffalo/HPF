from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db
from .auth import get_current_user

router = APIRouter(prefix="/api/v1")

@router.get("/plans/", response_model=List[schemas.HealthcarePlan])
def get_plans(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    plans = db.query(models.HealthcarePlan).offset(skip).limit(limit).all()
    return plans

@router.post("/plans/", response_model=schemas.HealthcarePlan)
def create_plan(
    plan: schemas.HealthcarePlanCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_plan = models.HealthcarePlan(**plan.dict())
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan

@router.get("/plans/{plan_id}", response_model=schemas.HealthcarePlan)
def get_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    plan = db.query(models.HealthcarePlan).filter(models.HealthcarePlan.id == plan_id).first()
    if plan is None:
        raise HTTPException(status_code=404, detail="Plan not found")
    return plan

@router.post("/plans/{plan_id}/rate", response_model=schemas.PlanRating)
def rate_plan(
    plan_id: int,
    rating: schemas.PlanRatingCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    plan = db.query(models.HealthcarePlan).filter(models.HealthcarePlan.id == plan_id).first()
    if plan is None:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    db_rating = models.PlanRating(
        **rating.dict(),
        user_id=current_user.id,
        plan_id=plan_id
    )
    db.add(db_rating)
    db.commit()
    db.refresh(db_rating)
    return db_rating

@router.post("/recommend/", response_model=List[schemas.HealthcarePlan])
def recommend_plans(
    preferences: schemas.UserPreferenceCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Recommend healthcare plans based on user preferences and profile
    """
    # Basic recommendation logic (can be enhanced with more sophisticated algorithms)
    query = db.query(models.HealthcarePlan)
    
    if preferences.preferred_providers:
        query = query.filter(models.HealthcarePlan.provider.in_(preferences.preferred_providers))
    
    # Add more filters based on user preferences and profile
    if current_user.income_level:
        # Example: Filter plans with premiums less than 10% of monthly income
        max_premium = current_user.income_level * 0.1
        query = query.filter(models.HealthcarePlan.monthly_premium <= max_premium)
    
    return query.all() 