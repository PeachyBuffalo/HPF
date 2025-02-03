import React, { useEffect, useState } from 'react';
import { getPlans } from '../../services/api';

interface Plan {
  id: number;
  name: string;
  provider: string;
  monthly_premium: number;
  deductible: number;
}

interface PlanListProps {
  userPreferences?: Record<string, any> | null;
}

const PlanList: React.FC<PlanListProps> = ({ userPreferences }) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getPlans();
        setPlans(data);
      } catch (err) {
        setError('Failed to load plans');
        console.error('Error fetching plans:', err);
      }
    };

    fetchPlans();
  }, []);

  const calculatePlanScore = (plan: Plan, preferences: Record<string, any>): number => {
    let score = 0;

    // Budget match (higher score for plans within budget)
    if (preferences.budget && plan.monthly_premium <= preferences.budget) {
      score += 30;
      // Bonus points for being well under budget
      if (plan.monthly_premium <= preferences.budget * 0.8) {
        score += 10;
      }
    }

    // Health status consideration
    if (preferences.health_status) {
      switch (preferences.health_status) {
        case 'Excellent':
          // Prefer high deductible plans for healthy people
          if (plan.deductible > 2000) score += 20;
          break;
        case 'Poor':
          // Prefer low deductible plans for less healthy people
          if (plan.deductible < 1000) score += 20;
          break;
      }
    }

    // Chronic conditions consideration
    if (preferences.chronic_conditions && preferences.chronic_conditions.length > 0 && 
        !preferences.chronic_conditions.includes('None')) {
      // Prefer low deductible plans for people with chronic conditions
      if (plan.deductible < 1000) score += 15;
    }

    // Medications consideration
    if (preferences.medications && preferences.medications > 0) {
      // Prefer low deductible plans for people with regular medications
      if (plan.deductible < 1500) score += preferences.medications * 2;
    }

    // Doctor visits consideration
    if (preferences.doctor_visits) {
      switch (preferences.doctor_visits) {
        case 'Frequently (monthly or more)':
          if (plan.deductible < 1000) score += 25;
          break;
        case 'Regularly (4-6 times a year)':
          if (plan.deductible < 1500) score += 20;
          break;
        case 'Occasionally (2-3 times a year)':
          if (plan.deductible < 2000) score += 15;
          break;
        case 'Rarely (once a year or less)':
          if (plan.deductible > 2000) score += 15;
          break;
      }
    }

    return score;
  };

  const sortedPlans = userPreferences
    ? [...plans].sort((a, b) => 
        calculatePlanScore(b, userPreferences) - calculatePlanScore(a, userPreferences)
      )
    : plans;

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="plan-list">
      <h2>{userPreferences ? 'Recommended Plans' : 'Available Plans'}</h2>
      <div className="plans">
        {sortedPlans.map(plan => {
          const score = userPreferences ? calculatePlanScore(plan, userPreferences) : null;
          return (
            <div key={plan.id} className="plan-card">
              {score !== null && (
                <div className="match-score" style={{
                  backgroundColor: score > 50 ? '#4caf50' : score > 30 ? '#ff9800' : '#f44336',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  marginBottom: '10px'
                }}>
                  Match Score: {score}%
                </div>
              )}
              <h3>{plan.name}</h3>
              <p>Provider: {plan.provider}</p>
              <p>Monthly Premium: ${plan.monthly_premium}</p>
              <p>Deductible: ${plan.deductible}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlanList; 