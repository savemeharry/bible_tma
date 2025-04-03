import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useBookmarks, Bookmark } from '../contexts/BookmarksContext';
import { useBible } from '../contexts/BibleContext';
import Modal from '../components/Modal';

const BookmarksContainer = styled.div`
  padding: 15px;
  margin-top: 10px;
`;

const BookmarkCard = styled.div`
  background-color: var(--bg-card);
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: transform 0.1s;
  display: flex;
  align-items: center;
  
  &:active {
    transform: scale(0.99);
  }
`;

const BookmarkIcon = styled.div`
  font-size: 1.4rem;
  color: var(--accent-color);
  margin-right: 12px;
`;

const BookmarkContent = styled.div`
  flex: 1;
`;

const BookmarkLocation = styled.div`
  font-weight: 600;
  color: var(--text-headers);
  font-size: 1rem;
  margin-bottom: 4px;
`;

const BookmarkLabel = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const BookmarkActions = styled.div`
  display: flex;
  padding-left: 10px;
`;

const BookmarkAction = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  transition: color 0.2s;
  
  &:hover {
    color: var(--text-main);
  }
  
  svg {
    width: 18px;
    height: 18px;
    fill: currentColor;
  }
`;

const EmptyBookmarksMessage = styled.div`
  text-align: center;
  margin: 40px 0;
  color: var(--text-secondary);
  font-size: 1.1rem;
`;

const BookmarksPage: React.FC = () => {
  const navigate = useNavigate();
  const bookmarks = useBookmarks();
  const bible = useBible();
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentBookmark, setCurrentBookmark] = useState<Bookmark | null>(null);
  const [bookmarkLabel, setBookmarkLabel] = useState('');
  
  const handleBookmarkClick = (bookmark: Bookmark) => {
    // Navigate to the verse
    navigate(`/read/${bookmark.book}/${bookmark.chapter}/${bookmark.verse}`);
  };
  
  const handleEditBookmark = (bookmark: Bookmark, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentBookmark(bookmark);
    setBookmarkLabel(bookmark.label || '');
    setShowEditModal(true);
  };
  
  const handleDeleteBookmark = (bookmarkId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Вы уверены, что хотите удалить эту закладку?')) {
      bookmarks.deleteBookmark(bookmarkId);
    }
  };
  
  const handleSaveBookmark = () => {
    if (currentBookmark) {
      bookmarks.editBookmark(currentBookmark.id, {
        label: bookmarkLabel
      });
      setShowEditModal(false);
    }
  };
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };
  
  return (
    <BookmarksContainer className="app-main">
      <h1 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--text-headers)' }}>
        Мои закладки
      </h1>
      
      {bookmarks.bookmarks.map(bookmark => (
        <BookmarkCard key={bookmark.id} onClick={() => handleBookmarkClick(bookmark)}>
          <BookmarkIcon>🔖</BookmarkIcon>
          <BookmarkContent>
            <BookmarkLocation>
              {bible.getBookName(bookmark.book)} {bookmark.chapter}:{bookmark.verse}
            </BookmarkLocation>
            {bookmark.label && (
              <BookmarkLabel>{bookmark.label}</BookmarkLabel>
            )}
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '5px' }}>
              {formatDate(bookmark.date)}
            </div>
          </BookmarkContent>
          <BookmarkActions>
            <BookmarkAction onClick={(e) => handleEditBookmark(bookmark, e)} title="Редактировать">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </BookmarkAction>
            <BookmarkAction onClick={(e) => handleDeleteBookmark(bookmark.id, e)} title="Удалить">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </BookmarkAction>
          </BookmarkActions>
        </BookmarkCard>
      ))}
      
      {bookmarks.bookmarks.length === 0 && (
        <EmptyBookmarksMessage>
          У вас пока нет закладок. Добавьте их при чтении Библии!
        </EmptyBookmarksMessage>
      )}
      
      {/* Edit Bookmark Modal */}
      <Modal
        id="edit-bookmark-modal"
        title="Редактировать закладку"
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      >
        {currentBookmark && (
          <>
            <p>
              Закладка для {bible.getBookName(currentBookmark.book)} {currentBookmark.chapter}:{currentBookmark.verse}
            </p>
            <input
              type="text"
              placeholder="Метка (опционально)"
              style={{ 
                width: '100%', 
                padding: '10px',
                marginTop: '15px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontFamily: 'inherit',
                backgroundColor: 'var(--bg-main)',
                color: 'var(--text-main)'
              }}
              value={bookmarkLabel}
              onChange={(e) => setBookmarkLabel(e.target.value)}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <button
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'var(--accent-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
                onClick={handleSaveBookmark}
              >
                Сохранить
              </button>
              <button
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
                onClick={() => handleDeleteBookmark(currentBookmark.id, {} as React.MouseEvent)}
              >
                Удалить
              </button>
            </div>
          </>
        )}
      </Modal>
    </BookmarksContainer>
  );
};

export default BookmarksPage; 