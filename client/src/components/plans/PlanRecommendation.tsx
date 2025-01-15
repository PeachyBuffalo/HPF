import React, { useState } from 'react';
import { getRecommendedPlans } from '../../services/api';
import { HealthcarePlan, UserPreferences } from '../../types/api.types';

const PlanRecommendation: React.FC = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    preferred_providers: {},
    chronic_conditions: {},
    prescription_needs: {},
  });
  const [recommendations, setRecommendations] = useState<HealthcarePlan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await getRecommendedPlans(preferences);
      setRecommendations(data);
      setError(null);
    } catch (err) {
      setError('Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) return <div>Loading recommendations...</div>;

  return (
    <div className="plan-recommendation">
      <h2>Find Your Perfect Plan</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Healthcare Needs</h3>
          <div>
            <label>Preferred Providers:</label>
            <input
              type="text"
              name="preferred_providers"
              onChange={handlePreferenceChange}
              placeholder="Enter preferred providers"
            />
          </div>
          {/* Add more preference inputs */}
        </div>

        <button type="submit">Get Recommendations</button>
      </form>

      {recommendations.length > 0 && (
        <div className="recommendations">
          <h3>Recommended Plans</h3>
          {recommendations.map(plan => (
            <div key={plan.id} className="recommended-plan">
              <h4>{plan.name}</h4>
              <p>Monthly Premium: ${plan.monthly_premium}</p>
              <p>Coverage Type: {plan.coverage_type}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlanRecommendation; 