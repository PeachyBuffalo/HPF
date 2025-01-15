import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/auth/LoginForm';
import PlanList from './components/plans/PlanList';
import PlanRecommendation from './components/plans/PlanRecommendation';
import Navigation from './components/common/Navigation';
import './App.css';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem('token')
  );

  const handleLogin = (): void => {
    setIsAuthenticated(true);
  };

  const handleLogout = (): void => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="App">
        <Navigation 
          isAuthenticated={isAuthenticated} 
          onLogout={handleLogout} 
        />
        
        <main>
          <Routes>
            <Route 
              path="/login" 
              element={
                !isAuthenticated ? (
                  <LoginForm onLogin={handleLogin} />
                ) : (
                  <Navigate to="/dashboard" />
                )
              } 
            />
            <Route 
              path="/plans" 
              element={
                isAuthenticated ? (
                  <PlanList />
                ) : (
                  <Navigate to="/login" />
                )
              } 
            />
            <Route 
              path="/recommend" 
              element={
                isAuthenticated ? (
                  <PlanRecommendation />
                ) : (
                  <Navigate to="/login" />
                )
              } 
            />
            <Route path="/" element={<Navigate to="/plans" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App; 