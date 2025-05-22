import { useState } from 'react';
import QuizForm from './QuizForm';
import QuizHistory from './QuizHistory';

export default function SMSQuiz() {
  // Use as a trigger to refresh the message history when a new quiz is sent
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const handleQuizSent = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <QuizForm onQuizSent={handleQuizSent} />
      <QuizHistory refreshTrigger={refreshTrigger} />
    </div>
  );
}