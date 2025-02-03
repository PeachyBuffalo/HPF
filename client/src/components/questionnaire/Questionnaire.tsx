import React, { useState } from 'react';
import './Questionnaire.css';

interface Question {
  id: string;
  text: string;
  type: 'single' | 'multiple' | 'number' | 'medication-list' | 'surgery-list';
  options?: string[];
  min?: number;
  max?: number;
}

// Common medications for autocomplete
const commonMedications = [
  'Lisinopril', 'Metformin', 'Amlodipine', 'Metoprolol', 'Omeprazole',
  'Simvastatin', 'Losartan', 'Gabapentin', 'Sertraline', 'Levothyroxine',
  'Atorvastatin', 'Pantoprazole', 'Escitalopram', 'Fluoxetine', 'Furosemide'
];

// Common surgeries for autocomplete
const commonSurgeries = [
  'Appendectomy', 'Cholecystectomy', 'Cesarean Section', 'Hysterectomy',
  'Tonsillectomy', 'Hip Replacement', 'Knee Replacement', 'Cataract Surgery',
  'Coronary Artery Bypass', 'Hernia Repair', 'Spinal Fusion', 'Thyroidectomy'
];

interface QuestionnaireProps {
  onComplete: (answers: Record<string, any>) => void;
}

const questions: Question[] = [
  {
    id: 'age',
    text: 'What is your age?',
    type: 'number',
    min: 0,
    max: 120
  },
  {
    id: 'health_status',
    text: 'How would you describe your overall health?',
    type: 'single',
    options: ['Excellent', 'Good', 'Fair', 'Poor']
  },
  {
    id: 'chronic_conditions',
    text: 'Do you have any chronic health conditions?',
    type: 'multiple',
    options: [
      'None',
      'Diabetes',
      'Heart Disease',
      'Asthma',
      'Arthritis',
      'Other'
    ]
  },
  {
    id: 'medications',
    text: 'List the prescriptions you take daily',
    type: 'medication-list'
  },
  {
    id: 'surgeries',
    text: 'List any surgeries you have had',
    type: 'surgery-list'
  },
  {
    id: 'doctor_visits',
    text: 'How often do you visit the doctor?',
    type: 'single',
    options: [
      'Rarely (once a year or less)',
      'Occasionally (2-3 times a year)',
      'Regularly (4-6 times a year)',
      'Frequently (monthly or more)'
    ]
  },
  {
    id: 'budget',
    text: 'What is your monthly budget for health insurance?',
    type: 'number',
    min: 0,
    max: 2000
  }
];

const Questionnaire: React.FC<QuestionnaireProps> = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentAnswer, setCurrentAnswer] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleNext = () => {
    if (currentAnswer !== null) {
      setAnswers(prev => ({
        ...prev,
        [questions[currentQuestionIndex].id]: currentAnswer
      }));

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setCurrentAnswer(answers[questions[currentQuestionIndex + 1].id] || null);
        setSearchTerm('');
      } else {
        onComplete({ ...answers, [questions[currentQuestionIndex].id]: currentAnswer });
      }
    }
  };

  const handleListItemAdd = (item: string, list: string[]) => {
    if (item && !list.includes(item)) {
      setCurrentAnswer([...(currentAnswer || []), item]);
      setSearchTerm('');
    }
  };

  const handleListItemRemove = (itemToRemove: string) => {
    setCurrentAnswer((currentAnswer || []).filter((item: string) => item !== itemToRemove));
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const getFilteredSuggestions = () => {
    if (!searchTerm) return [];
    const list = currentQuestion.type === 'medication-list' ? commonMedications : commonSurgeries;
    return list.filter(item => 
      item.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !(currentAnswer || []).includes(item)
    );
  };

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'single':
        return (
          <div className="question-options">
            {currentQuestion.options?.map(option => (
              <button
                key={option}
                onClick={() => setCurrentAnswer(option)}
                className={`option-button ${currentAnswer === option ? 'selected' : ''}`}
              >
                {option}
              </button>
            ))}
          </div>
        );

      case 'multiple':
        return (
          <div className="question-options">
            {currentQuestion.options?.map(option => (
              <label key={option} className="checkbox-label">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    const current = currentAnswer || [];
                    if (e.target.checked) {
                      if (option === 'None') {
                        setCurrentAnswer(['None']);
                      } else {
                        setCurrentAnswer([
                          ...current.filter((a: string) => a !== 'None'),
                          option
                        ]);
                      }
                    } else {
                      setCurrentAnswer(
                        current.filter((a: string) => a !== option)
                      );
                    }
                  }}
                  checked={
                    (currentAnswer || []).includes(option)
                  }
                />
                {option}
              </label>
            ))}
          </div>
        );

      case 'number':
        return (
          <div className="question-number">
            <input
              type="number"
              min={currentQuestion.min}
              max={currentQuestion.max}
              value={currentAnswer || ''}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value >= (currentQuestion.min || 0) && value <= (currentQuestion.max || Infinity)) {
                  setCurrentAnswer(value);
                }
              }}
              className="number-input"
            />
          </div>
        );

      case 'medication-list':
      case 'surgery-list':
        const suggestions = getFilteredSuggestions();
        return (
          <div className="list-input">
            <div className="search-container">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search ${currentQuestion.type === 'medication-list' ? 'medications' : 'surgeries'}...`}
                className="search-input"
              />
              {suggestions.length > 0 && (
                <ul className="suggestions-list">
                  {suggestions.map(item => (
                    <li
                      key={item}
                      onClick={() => handleListItemAdd(item, currentAnswer || [])}
                      className="suggestion-item"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="selected-items">
              {(currentAnswer || []).map((item: string) => (
                <div key={item} className="selected-item">
                  {item}
                  <button
                    onClick={() => handleListItemRemove(item)}
                    className="remove-item"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="questionnaire">
      <div className="progress-bar">
        <div
          className="progress"
          style={{
            width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`
          }}
        />
      </div>
      <h3 className="question-text">{currentQuestion.text}</h3>
      {renderQuestion()}
      <button
        onClick={handleNext}
        disabled={currentAnswer === null || (Array.isArray(currentAnswer) && currentAnswer.length === 0)}
        className="next-button"
      >
        {isLastQuestion ? 'Finish' : 'Next'}
      </button>
    </div>
  );
};

export default Questionnaire; 