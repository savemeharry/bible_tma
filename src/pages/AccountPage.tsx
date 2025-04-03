import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../contexts/NotesContext';
import { useBookmarks } from '../contexts/BookmarksContext';
import { useSDK } from '../utils/tma-mock';

const AccountContainer = styled.div`
  padding: 15px;
  margin-top: 10px;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 25px;
`;

const Avatar = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;
  background-color: var(--border-color);
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.h1`
  font-family: var(--font-headers);
  font-size: 1.3rem;
  color: var(--text-headers);
  margin: 0 0 5px 0;
  font-weight: 600;
`;

const UserStatus = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
`;

const Tab = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  padding: 10px 15px;
  font-size: 0.95rem;
  color: ${props => props.active ? 'var(--accent-color)' : 'var(--text-secondary)'};
  font-weight: ${props => props.active ? '600' : '400'};
  border-bottom: 2px solid ${props => props.active ? 'var(--accent-color)' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: var(--accent-color);
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
  font-size: 1.1rem;
  color: var(--text-headers);
  margin-bottom: 10px;
  font-weight: 600;
`;

const ProgressBar = styled.div`
  width: 100%;
  background-color: var(--border-color);
  border-radius: 5px;
  height: 8px;
  margin: 10px 0;
  overflow: hidden;
  
  div {
    height: 100%;
    background-color: var(--accent-color);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 15px;
`;

const StatItem = styled.div`
  background-color: var(--bg-content);
  border-radius: 8px;
  padding: 12px;
  border: 1px solid var(--border-color);
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--accent-color);
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  color: var(--text-secondary);
`;

const NoteCard = styled.div`
  background-color: var(--bg-card);
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: transform 0.1s;
  
  &:active {
    transform: scale(0.99);
  }
`;

const NoteMeta = styled.div`
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
`;

const NoteLocation = styled.div`
  font-weight: 500;
  color: var(--accent-color);
`;

const NoteContent = styled.div`
  color: var(--text-main);
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const BookmarkItem = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:active {
    opacity: 0.7;
  }
`;

const BookmarkReference = styled.div`
  font-weight: 500;
  color: var(--text-headers);
  margin-bottom: 5px;
`;

const BookmarkText = styled.div`
  font-size: 0.95rem;
  color: var(--text-main);
  line-height: 1.5;
`;

const BookmarkDate = styled.div`
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 5px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 30px 0;
  color: var(--text-secondary);
  
  svg {
    width: 50px;
    height: 50px;
    fill: var(--border-color);
    margin-bottom: 15px;
  }
`;

const EmptyStateText = styled.div`
  font-size: 1rem;
  margin-bottom: 8px;
`;

const AccountPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'notes' | 'bookmarks' | 'stats' | 'progress'>('stats');
  const { notes } = useNotes();
  const { bookmarks } = useBookmarks();
  const navigate = useNavigate();
  const sdk = useSDK();
  const [user, setUser] = useState<{firstName: string, lastName?: string, username?: string, avatarUrl?: string}>({
    firstName: 'Пользователь'
  });
  
  // Загрузка данных пользователя из Telegram
  useEffect(() => {
    const getUser = async () => {
      try {
        // Используем данные пользователя из SDK
        if (sdk && sdk.user) {
          setUser({
            firstName: sdk.user.first_name,
            lastName: sdk.user.last_name,
            username: sdk.user.username,
            avatarUrl: sdk.user.photo_url
          });
        }
      } catch (error) {
        console.error('Ошибка получения данных пользователя:', error);
        // В случае ошибки используем значения по умолчанию
        setUser({
          firstName: 'Пользователь',
          lastName: 'Telegram',
        });
      }
    };
    
    getUser();
  }, [sdk]);
  
  // Рассчитаем примерную статистику для демонстрации
  const totalBooks = 66; // количество книг в Библии
  const readBooks = 12; // количество прочитанных книг
  const totalChapters = 1189; // общее количество глав в Библии
  const readChapters = 120; // количество прочитанных глав
  const overallProgressPercent = Math.round((readChapters / totalChapters) * 100);
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'notes':
        return (
          <div>
            {notes.length > 0 ? (
              notes.map(note => (
                <NoteCard key={note.id} onClick={() => navigate(`/read/${note.book}/${note.chapter}/${note.verse}`)}>
                  <NoteMeta>
                    <NoteLocation>{`${note.book} ${note.chapter}:${note.verse}`}</NoteLocation>
                    <div>{new Date(note.date).toLocaleDateString()}</div>
                  </NoteMeta>
                  <NoteContent>{note.text}</NoteContent>
                </NoteCard>
              ))
            ) : (
              <EmptyState>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z"/>
                </svg>
                <EmptyStateText>У вас пока нет заметок</EmptyStateText>
                <div>Создавайте заметки во время чтения, чтобы видеть их здесь</div>
              </EmptyState>
            )}
          </div>
        );
        
      case 'bookmarks':
        return (
          <div>
            {bookmarks.length > 0 ? (
              bookmarks.map(bookmark => (
                <BookmarkItem key={bookmark.id} onClick={() => navigate(`/read/${bookmark.book}/${bookmark.chapter}/${bookmark.verse}`)}>
                  <BookmarkReference>{`${bookmark.book} ${bookmark.chapter}:${bookmark.verse}`}</BookmarkReference>
                  <BookmarkText>{bookmark.label || `Стих ${bookmark.verse}`}</BookmarkText>
                  <BookmarkDate>{new Date(bookmark.date).toLocaleDateString()}</BookmarkDate>
                </BookmarkItem>
              ))
            ) : (
              <EmptyState>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                </svg>
                <EmptyStateText>У вас пока нет закладок</EmptyStateText>
                <div>Добавляйте закладки во время чтения, чтобы видеть их здесь</div>
              </EmptyState>
            )}
          </div>
        );
        
      case 'stats':
        return (
          <div>
            <Card>
              <CardTitle>Статистика чтения</CardTitle>
              <StatsGrid>
                <StatItem>
                  <StatValue>{readBooks}</StatValue>
                  <StatLabel>Прочитано книг</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{totalBooks - readBooks}</StatValue>
                  <StatLabel>Осталось книг</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{readChapters}</StatValue>
                  <StatLabel>Прочитано глав</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{totalChapters - readChapters}</StatValue>
                  <StatLabel>Осталось глав</StatLabel>
                </StatItem>
              </StatsGrid>
            </Card>
            
            <Card>
              <CardTitle>Активность за последние 7 дней</CardTitle>
              {/* Здесь можно будет добавить график активности */}
              <EmptyState>
                <EmptyStateText>Данные активности скоро будут доступны</EmptyStateText>
              </EmptyState>
            </Card>
          </div>
        );
        
      case 'progress':
        return (
          <div>
            <Card>
              <CardTitle>Общий прогресс</CardTitle>
              <div>Прочитано {overallProgressPercent}% всего Писания</div>
              <ProgressBar>
                <div style={{ width: `${overallProgressPercent}%` }} />
              </ProgressBar>
            </Card>
            
            <Card>
              <CardTitle>Прогресс по разделам</CardTitle>
              <div style={{ marginBottom: '10px' }}>Ветхий Завет</div>
              <ProgressBar>
                <div style={{ width: '35%' }} />
              </ProgressBar>
              
              <div style={{ marginBottom: '10px', marginTop: '15px' }}>Новый Завет</div>
              <ProgressBar>
                <div style={{ width: '60%' }} />
              </ProgressBar>
            </Card>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <AccountContainer>
      <ProfileHeader>
        <Avatar>
          {user.avatarUrl && <img src={user.avatarUrl} alt="Аватар" />}
        </Avatar>
        <UserInfo>
          <UserName>{`${user.firstName} ${user.lastName || ''}`}</UserName>
          {user.username && <UserStatus>@{user.username}</UserStatus>}
        </UserInfo>
      </ProfileHeader>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'stats'} 
          onClick={() => setActiveTab('stats')}
        >
          Статистика
        </Tab>
        <Tab 
          active={activeTab === 'progress'} 
          onClick={() => setActiveTab('progress')}
        >
          Прогресс
        </Tab>
        <Tab 
          active={activeTab === 'notes'} 
          onClick={() => setActiveTab('notes')}
        >
          Заметки
        </Tab>
        <Tab 
          active={activeTab === 'bookmarks'} 
          onClick={() => setActiveTab('bookmarks')}
        >
          Закладки
        </Tab>
      </TabsContainer>
      
      {renderTabContent()}
    </AccountContainer>
  );
};

export default AccountPage; 