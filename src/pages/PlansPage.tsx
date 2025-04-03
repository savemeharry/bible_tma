import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const PlansContainer = styled.div`
  padding: 15px;
  margin-top: 10px;
`;

const PlanCard = styled.div`
  background-color: var(--bg-card);
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 15px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
`;

const PlanTitle = styled.h2`
  font-family: var(--font-headers);
  font-size: 1.1rem;
  color: var(--text-headers);
  margin-bottom: 10px;
  font-weight: 600;
`;

const PlanInfo = styled.p`
  color: var(--text-main);
  margin: 5px 0;
  line-height: 1.5;
`;

const PlanReading = styled.p`
  margin: 5px 0 10px;
  color: var(--text-main);
`;

const LocationLink = styled.span`
  color: var(--link-color);
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  background-color: var(--border-color);
  border-radius: 5px;
  height: 8px;
  margin-top: 10px;
  overflow: hidden;
  
  div {
    height: 100%;
    background-color: var(--secondary-accent);
  }
`;

const PrimaryButton = styled.button`
  background-color: var(--accent-color);
  color: white;
  border: none;
  padding: 12px 18px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  transition: background-color 0.2s, transform 0.1s;
  margin-top: 15px;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

interface ReadingPlan {
  id: string;
  title: string;
  progress: number;
  day: number;
  totalDays: number;
  currentReading: {
    reference: string;
    displayText: string;
  };
}

const PlansPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Sample plans - in a real app this would come from state/context/API
  const readingPlans: ReadingPlan[] = [
    {
      id: 'year',
      title: 'Библия за год',
      progress: 5,
      day: 18,
      totalDays: 365,
      currentReading: {
        reference: 'Exo 5:1',
        displayText: 'Исход 5-7'
      }
    },
    {
      id: 'nt90',
      title: 'Новый Завет за 90 дней',
      progress: 12,
      day: 11,
      totalDays: 90,
      currentReading: {
        reference: 'Mat 20:1',
        displayText: 'Матфея 20-21'
      }
    }
  ];
  
  const handleReadingLocation = (reference: string) => {
    // Example: "Exo 5:1" -> "/read/Exo/5/1"
    const match = reference.match(/([a-zA-Z]+)\s*(\d+)(?::(\d+))?/);
    
    if (match) {
      const book = match[1];
      const chapter = match[2];
      const verse = match[3] || "1";
      navigate(`/read/${book}/${chapter}/${verse}`);
    }
  };
  
  return (
    <PlansContainer className="app-main">
      {readingPlans.map(plan => (
        <PlanCard key={plan.id}>
          <PlanTitle>{plan.title}</PlanTitle>
          <PlanInfo>Прогресс: {plan.progress}% (День {plan.day} из {plan.totalDays})</PlanInfo>
          <PlanReading>
            Сегодня: <LocationLink onClick={() => handleReadingLocation(plan.currentReading.reference)}>
              {plan.currentReading.displayText}
            </LocationLink>
          </PlanReading>
          <ProgressBar>
            <div style={{ width: `${plan.progress}%` }}></div>
          </ProgressBar>
          <PrimaryButton onClick={() => handleReadingLocation(plan.currentReading.reference)}>
            Продолжить чтение
          </PrimaryButton>
        </PlanCard>
      ))}
      
      {readingPlans.length === 0 && (
        <div style={{ textAlign: 'center', margin: '40px 0', color: 'var(--text-secondary)' }}>
          У вас пока нет планов чтения. Выберите план, чтобы начать!
        </div>
      )}
      
      {/* Here you could add a button or section to browse and add new reading plans */}
    </PlansContainer>
  );
};

export default PlansPage; 