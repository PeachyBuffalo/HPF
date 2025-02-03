import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginForm from './components/auth/LoginForm';
import PlanList from './components/plans/PlanList';
import Questionnaire from './components/questionnaire/Questionnaire';
import Modal from './components/common/Modal';
import './App.css';

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isPlansOpen, setIsPlansOpen] = useState(false);
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [userPreferences, setUserPreferences] = useState<Record<string, any> | null>(null);

  const handleQuestionnaireComplete = (answers: Record<string, any>) => {
    setUserPreferences(answers);
    setIsQuestionnaireOpen(false);
    setIsPlansOpen(true);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <header className="App-header">
            <h1>Healthcare Plan Finder</h1>
            <nav>
              <ul>
                <li><button onClick={() => setIsQuestionnaireOpen(true)}>Find Plans</button></li>
                <li><button onClick={() => setIsPlansOpen(true)}>View All Plans</button></li>
                <li><button onClick={() => setIsLoginOpen(true)}>Login</button></li>
              </ul>
            </nav>
          </header>

          <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
            <LoginForm onSuccess={() => setIsLoginOpen(false)} />
          </Modal>

          <Modal isOpen={isQuestionnaireOpen} onClose={() => setIsQuestionnaireOpen(false)}>
            <Questionnaire onComplete={handleQuestionnaireComplete} />
          </Modal>

          <Modal isOpen={isPlansOpen} onClose={() => setIsPlansOpen(false)}>
            <PlanList userPreferences={userPreferences} />
          </Modal>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
