export interface HealthcarePlan {
  id: number;
  name: string;
  coverage_type: string;
  provider: string;
  monthly_premium: number;
  deductible: number;
  max_out_of_pocket: number;
  description?: string;
  provider_network?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface UserPreferences {
  preferred_providers?: Record<string, any>;
  chronic_conditions?: Record<string, any>;
  prescription_needs?: Record<string, any>;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
} 