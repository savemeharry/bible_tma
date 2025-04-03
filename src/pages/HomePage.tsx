import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useBible } from '../contexts/BibleContext';
import BibleService from '../services/bibleService';

const HomeContainer = styled.div`
  padding: 15px;
  margin-top: 10px;
`;

const QuickSearch = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-main);
  color: var(--text-main);
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
  
  &::placeholder {
    color: var(--placeholder-color);
  }
`;

const SearchButton = styled.button`
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;
  
  svg {
    width: 24px;
    height: 24px;
    fill: currentColor;
  }
`;

const Card = styled.div`
  background-color: var(--bg-card);
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 15px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
`;

const CardTitle = styled.h2`
  font-family: var(--font-headers);
  font-size: 1.05rem;
  color: var(--text-headers);
  margin-bottom: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    width: 18px;
    height: 18px;
    fill: var(--text-secondary);
  }
`;

const Blockquote = styled.blockquote`
  font-family: var(--font-text);
  font-size: 1.1rem;
  margin: 10px 0;
  padding-left: 15px;
  border-left: 3px solid var(--accent-color);
  line-height: 1.6;
`;

const MetaInfo = styled.p`
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 10px;
`;

const LocationLink = styled.span`
  color: var(--link-color);
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
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
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  svg {
    width: 18px;
    height: 18px;
    fill: white;
  }
`;

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [verseOfTheDay, setVerseOfTheDay] = useState<{ text: string, reference: string }>({
    text: '',
    reference: ''
  });
  const navigate = useNavigate();
  const bible = useBible();
  
  // Load verse of the day
  useEffect(() => {
    const loadVerseOfTheDay = async () => {
      const verse = await BibleService.getVerseOfTheDay();
      if (verse) {
        const bookName = bible.getBookName(verse.book);
        setVerseOfTheDay({
          text: verse.text,
          reference: `${bookName} ${verse.chapter}:${verse.verse} (${bible.currentTranslation.shortName})`
        });
      }
    };
    
    loadVerseOfTheDay();
  }, [bible]);
  
  const handleSearch = () => {
    if (searchQuery.trim()) {
      alert(`Поиск по запросу: "${searchQuery}" будет доступен в следующей версии`);
    }
  };
  
  const handleReadingLocation = (location: string) => {
    // Example: "Gen 1:1" -> "/read/Gen/1/1"
    const match = location.match(/([a-zA-Z0-9]+)\s*(\d+)(?::(\d+))?/);
    
    if (match) {
      const book = match[1];
      const chapter = match[2];
      const verse = match[3] || "1";
      navigate(`/read/${book}/${chapter}/${verse}`);
    }
  };
  
  const handleStartReading = () => {
    // Navigate to the current location saved in context
    const { book, chapter, verse } = bible.currentLocation;
    navigate(`/read/${book}/${chapter}/${verse}`);
  };
  
  // Format a timestamp to a relative time string (e.g. "2 hours ago")
  const formatRelativeTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} дн. назад`;
    if (hours > 0) return `${hours} ч. назад`;
    if (minutes > 0) return `${minutes} мин. назад`;
    return 'только что';
  };
  
  return (
    <HomeContainer className="app-main">
      <QuickSearch>
        <SearchInput 
          type="text" 
          placeholder="Поиск по Библии..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
        />
        <SearchButton title="Начать поиск" onClick={handleSearch}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </SearchButton>
      </QuickSearch>
      
      <Card className="verse-of-the-day">
        <CardTitle>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          Стих дня
        </CardTitle>
        <Blockquote>{verseOfTheDay.text || "Загрузка..."}</Blockquote>
        <MetaInfo>
          <LocationLink onClick={() => handleReadingLocation("Joh 3:16")}>
            {verseOfTheDay.reference || "Иоанна 3:16 (Синодальный)"}
          </LocationLink>
        </MetaInfo>
      </Card>
      
      <Card className="continue-reading">
        <CardTitle>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
          </svg>
          Продолжить чтение
        </CardTitle>
        <p>
          {bible.getBookName(bible.currentLocation.book)} {bible.currentLocation.chapter}:{bible.currentLocation.verse}
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9em' }}> ({bible.currentTranslation.shortName})</span>
        </p>
        <PrimaryButton onClick={handleStartReading}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"/>
          </svg>
          Продолжить чтение
        </PrimaryButton>
      </Card>
      
      <Card className="recent-reading">
        <CardTitle>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
          Недавние места
        </CardTitle>
        
        {bible.recentLocations.length === 0 ? (
          <p>Нет недавних мест</p>
        ) : (
          bible.recentLocations.slice(0, 3).map((loc, idx) => {
            const translation = bible.translations.find(t => t.id === loc.translationId);
            return (
              <p key={idx}>
                <LocationLink 
                  onClick={() => navigate(`/read/${loc.book}/${loc.chapter}/${loc.verse}`)}
                >
                  {bible.getBookName(loc.book)} {loc.chapter}:{loc.verse}
                </LocationLink>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9em' }}>
                  {' '}({translation?.shortName || loc.translationId})
                  {' • '}{formatRelativeTime(loc.timestamp)}
                </span>
              </p>
            );
          })
        )}
        
        {bible.recentLocations.length > 3 && (
          <MetaInfo style={{ marginTop: '10px', cursor: 'pointer' }}>
            Посмотреть всю историю...
          </MetaInfo>
        )}
      </Card>
      
      <Card className="daily-plan">
        <CardTitle>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7-.25c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zM12 19c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm-1-7.5h2v4h-2v-4zm0-2h2v1h-2v-1z"/>
          </svg>
          План чтения
        </CardTitle>
        <p>
          План "Библия за год": <LocationLink onClick={() => handleReadingLocation("Psa 118:1")}>
            Псалом 118:1-16
          </LocationLink>
        </p>
        <MetaInfo>Прогресс: 15%</MetaInfo>
        <PrimaryButton onClick={() => handleReadingLocation("Psa 118:1")}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"/>
          </svg>
          Продолжить
        </PrimaryButton>
      </Card>
    </HomeContainer>
  );
};

export default HomePage; 