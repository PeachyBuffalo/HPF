import React, { useEffect, useState } from 'react';
import { getPlans } from '../../services/api';

interface Plan {
  id: number;
  name: string;
  provider: string;
  monthly_premium: number;
  deductible: number;
}

const PlanList = () => {
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

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="plan-list">
      <h2>Available Plans</h2>
      <div className="plans">
        {plans.map(plan => (
          <div key={plan.id} className="plan-card">
            <h3>{plan.name}</h3>
            <p>Provider: {plan.provider}</p>
            <p>Monthly Premium: ${plan.monthly_premium}</p>
            <p>Deductible: ${plan.deductible}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanList; 