import React, { useState, useEffect } from 'react';
import { fetchHealthcarePlans } from '../../services/api';
import { HealthcarePlan } from '../../types/api.types';

const PlanList: React.FC = () => {
  const [plans, setPlans] = useState<HealthcarePlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadPlans = async (): Promise<void> => {
      try {
        const data = await fetchHealthcarePlans();
        setPlans(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load healthcare plans');
        setLoading(false);
      }
    };

    loadPlans();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="plan-list">
      <h2>Available Healthcare Plans</h2>
      {plans.map((plan) => (
        <div key={plan.id} className="plan-card">
          <h3>{plan.name}</h3>
          <p>Provider: {plan.provider}</p>
          <p>Coverage Type: {plan.coverage_type}</p>
          <p>Monthly Premium: ${plan.monthly_premium}</p>
          <p>Deductible: ${plan.deductible}</p>
          <p>Max Out of Pocket: ${plan.max_out_of_pocket}</p>
          {plan.description && <p>Description: {plan.description}</p>}
        </div>
      ))}
    </div>
  );
};

export default PlanList; 