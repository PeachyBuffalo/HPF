import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

export const login = async (username: string, password: string) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  
  try {
    const response = await axios.post(`${API_URL}/token`, formData, {
      headers: {
        'Accept': 'application/json',
      }
    });
    
    console.log('Login response:', response.data); // Debug log
    
    if (response.data.access_token) {
      const token = response.data.access_token;
      localStorage.setItem('token', token);
      return token;
    } else {
      throw new Error('No access token in response');
    }
  } catch (error) {
    console.error('Login error details:', error); // Debug log
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Login failed');
    }
    throw error;
  }
};

export const getPlans = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/plans`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching plans:', error);
    throw error;
  }
}; 