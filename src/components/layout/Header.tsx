import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useSDK } from '../../utils/tma-mock';
import { useTheme } from '../../contexts/ThemeContext';
import { useBible } from '../../contexts/BibleContext';
import { useSettings } from '../../contexts/SettingsContext';
import Modal from '../Modal';

const HeaderContainer = styled.header`
  height: var(--header-height);
  background-color: var(--bg-content);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  box-shadow: var(--shadow);
  max-width: 600px;
  margin: 0 auto;
`;

const HeaderTitle = styled.h1`
  font-family: var(--font-headers);
  font-size: 1.15rem;
  color: var(--text-headers);
  font-weight: 600;
  margin: 0;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: var(--text-main);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;
  line-height: 0;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const ReadingHeaderCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

const LocationTitle = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-headers);
`;

const TranslationButton = styled.button`
  background: none;
  border: none;
  color: var(--accent-color);
  font-size: 0.85rem;
  font-family: var(--font-interface);
  cursor: pointer;
  padding: 2px 5px;
  border-radius: 4px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(52, 152, 219, 0.1);
  }
`;

// Simple Modal for book selection
const SelectionModal = styled.div<{show: boolean}>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.show ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 20;
`;

const ModalContent = styled.div`
  background-color: var(--bg-content);
  border-radius: 8px;
  width: 90%;
  max-width: 350px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 20px;
  box-shadow: var(--shadow);
`;

const ModalTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: var(--text-headers);
`;

const ModalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const SelectionItem = styled.button`
  background-color: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 8px 4px;
  text-align: center;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text-main);
  transition: all 0.2s;
  
  &:hover {
    background-color: var(--accent-color);
    color: white;
  }
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const SettingLabel = styled.label`
  font-weight: 500;
  font-size: 1rem;
`;

const ThemeSwitch = styled.div`
  display: flex;
  align-items: center;
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  margin-left: 10px;
`;

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background-color: var(--accent-color);
  }
  
  &:checked + span:before {
    transform: translateX(20px);
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
  
  &:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
`;

const FontSizeControl = styled.div`
  display: flex;
  align-items: center;
`;

const FontSizeButton = styled.button`
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  width: 32px;
  height: 32px;
  font-size: 1.3rem;
  border-radius: 50%;
  cursor: pointer;
  margin: 0 6px;
  line-height: 30px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--border-color);
  }
`;

const FontSizeLabel = styled.span`
  min-width: 40px;
  text-align: center;
  font-weight: 500;
  font-size: 0.9rem;
`;

const FontSelect = styled.select`
  padding: 8px 12px;
  border-radius: 6px;
  background-color: var(--bg-main);
  border: 1px solid var(--border-color);
  color: var(--text-main);
`;

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const sdk = useSDK();
  const bible = useBible();
  const { settings, updateSettings } = useSettings();
  
  // Modal states
  const [showBooksModal, setShowBooksModal] = useState(false);
  const [showTranslationsModal, setShowTranslationsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  const isReadingPage = location.pathname.startsWith('/read');
  const currentTitle = getPageTitle(location.pathname);
  
  // Get current Bible location and info from context
  const currentBookObj = bible.getBookById(bible.currentLocation.book);
  const currentBook = currentBookObj ? currentBookObj.name : bible.currentLocation.book;
  const currentChapter = bible.currentLocation.chapter;
  const currentTranslation = bible.currentTranslation.shortName;
  
  const handleBackClick = () => {
    navigate(-1);
  };
  
  const handleSettingsClick = () => {
    // Open settings modal
    setShowSettingsModal(true);
  };
  
  const handleLocationClick = () => {
    // Open book selection modal
    setShowBooksModal(true);
  };
  
  const handleTranslationClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Open translation selection modal
    setShowTranslationsModal(true);
  };
  
  const handleNextChapter = () => {
    const book = bible.currentLocation.book;
    const chapter = bible.currentLocation.chapter;
    const bookObj = bible.getBookById(book);
    
    if (bookObj) {
      // If we're at the last chapter of the book
      if (chapter >= bookObj.chapters) {
        // Find the next book
        const allBooks = bible.books;
        const currentIndex = allBooks.findIndex(b => b.id === book);
        
        if (currentIndex < allBooks.length - 1) {
          // Go to the first chapter of the next book
          const nextBook = allBooks[currentIndex + 1];
          navigate(`/read/${nextBook.id}/1`);
        }
      } else {
        // Go to the next chapter of the current book
        navigate(`/read/${book}/${chapter + 1}`);
      }
    }
  };
  
  const handlePrevChapter = () => {
    const book = bible.currentLocation.book;
    const chapter = bible.currentLocation.chapter;
    const bookObj = bible.getBookById(book);
    
    if (bookObj) {
      // If we're at the first chapter of the book
      if (chapter <= 1) {
        // Find the previous book
        const allBooks = bible.books;
        const currentIndex = allBooks.findIndex(b => b.id === book);
        
        if (currentIndex > 0) {
          // Go to the last chapter of the previous book
          const prevBook = allBooks[currentIndex - 1];
          navigate(`/read/${prevBook.id}/${prevBook.chapters}`);
        }
      } else {
        // Go to the previous chapter of the current book
        navigate(`/read/${book}/${chapter - 1}`);
      }
    }
  };
  
  const handleSelectBook = (bookId: string) => {
    setShowBooksModal(false);
    navigate(`/read/${bookId}/1`);
  };
  
  const handleSelectTranslation = (translationId: string) => {
    bible.setTranslation(translationId);
    setShowTranslationsModal(false);
  };
  
  const handleToggleTheme = () => {
    toggleTheme();
  };
  
  const handleDecreaseFontSize = () => {
    if (settings.fontSize > 12) {
      updateSettings({ fontSize: settings.fontSize - 1 });
    }
  };
  
  const handleIncreaseFontSize = () => {
    if (settings.fontSize < 24) {
      updateSettings({ fontSize: settings.fontSize + 1 });
    }
  };
  
  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ fontFamily: e.target.value });
  };
  
  if (isReadingPage) {
    return (
      <>
        <HeaderContainer>
          <IconButton onClick={handleBackClick} title="Назад">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </IconButton>
          <ReadingHeaderCenter onClick={handleLocationClick}>
            <LocationTitle>{currentBook} {currentChapter}</LocationTitle>
            <TranslationButton onClick={handleTranslationClick}>
              {currentTranslation} ▼
            </TranslationButton>
          </ReadingHeaderCenter>
          <IconButton onClick={handleNextChapter} title="Следующая глава">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </IconButton>
        </HeaderContainer>
        
        <SelectionModal show={showBooksModal} onClick={() => setShowBooksModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalTitle>Выберите книгу</ModalTitle>
            <ModalGrid>
              {bible.books.map(book => (
                <SelectionItem 
                  key={book.id} 
                  onClick={() => handleSelectBook(book.id)}
                >
                  {book.name}
                </SelectionItem>
              ))}
            </ModalGrid>
          </ModalContent>
        </SelectionModal>
        
        <SelectionModal show={showTranslationsModal} onClick={() => setShowTranslationsModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalTitle>Выберите перевод</ModalTitle>
            <ModalGrid>
              {bible.translations.map(trans => (
                <SelectionItem 
                  key={trans.id} 
                  onClick={() => handleSelectTranslation(trans.id)}
                >
                  {trans.shortName}
                </SelectionItem>
              ))}
            </ModalGrid>
          </ModalContent>
        </SelectionModal>
        
        <Modal
          id="settings-modal"
          title="Настройки"
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
        >
          <SettingRow>
            <SettingLabel htmlFor="theme-toggle">Темная тема</SettingLabel>
            <ThemeSwitch>
              <Switch>
                <SwitchInput 
                  type="checkbox" 
                  id="theme-toggle" 
                  checked={theme === 'dark'} 
                  onChange={handleToggleTheme}
                />
                <Slider />
              </Switch>
            </ThemeSwitch>
          </SettingRow>
          
          <SettingRow>
            <SettingLabel>Размер шрифта</SettingLabel>
            <FontSizeControl>
              <FontSizeButton onClick={handleDecreaseFontSize}>-</FontSizeButton>
              <FontSizeLabel>{settings.fontSize}px</FontSizeLabel>
              <FontSizeButton onClick={handleIncreaseFontSize}>+</FontSizeButton>
            </FontSizeControl>
          </SettingRow>
          
          <SettingRow>
            <SettingLabel htmlFor="font-select">Шрифт текста</SettingLabel>
            <FontSelect 
              id="font-select" 
              value={settings.fontFamily}
              onChange={handleFontFamilyChange}
            >
              <option value="'PT Serif', serif">PT Serif</option>
              <option value="'Noto Serif', serif">Noto Serif</option>
              <option value="'Inter', sans-serif">Inter</option>
            </FontSelect>
          </SettingRow>
        </Modal>
      </>
    );
  }
  
  return (
    <HeaderContainer>
      <HeaderTitle>{currentTitle}</HeaderTitle>
      <div>
        <IconButton onClick={handleSettingsClick} title="Настройки">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
          </svg>
        </IconButton>
      </div>
      
      <Modal
        id="settings-modal"
        title="Настройки"
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      >
        <SettingRow>
          <SettingLabel htmlFor="theme-toggle">Темная тема</SettingLabel>
          <ThemeSwitch>
            <Switch>
              <SwitchInput 
                type="checkbox" 
                id="theme-toggle" 
                checked={theme === 'dark'} 
                onChange={handleToggleTheme}
              />
              <Slider />
            </Switch>
          </ThemeSwitch>
        </SettingRow>
        
        <SettingRow>
          <SettingLabel>Размер шрифта</SettingLabel>
          <FontSizeControl>
            <FontSizeButton onClick={handleDecreaseFontSize}>-</FontSizeButton>
            <FontSizeLabel>{settings.fontSize}px</FontSizeLabel>
            <FontSizeButton onClick={handleIncreaseFontSize}>+</FontSizeButton>
          </FontSizeControl>
        </SettingRow>
        
        <SettingRow>
          <SettingLabel htmlFor="font-select">Шрифт текста</SettingLabel>
          <FontSelect 
            id="font-select" 
            value={settings.fontFamily}
            onChange={handleFontFamilyChange}
          >
            <option value="'PT Serif', serif">PT Serif</option>
            <option value="'Noto Serif', serif">Noto Serif</option>
            <option value="'Inter', sans-serif">Inter</option>
          </FontSelect>
        </SettingRow>
      </Modal>
    </HeaderContainer>
  );
};

// Helper function to get the page title based on route
function getPageTitle(pathname: string): string {
  switch (true) {
    case pathname.startsWith('/read'):
      return 'Чтение';
    case pathname.startsWith('/notes'):
      return 'Мои заметки';
    case pathname.startsWith('/bookmarks'):
      return 'Мои закладки';
    case pathname.startsWith('/plans'):
      return 'Планы чтения';
    case pathname.startsWith('/account'):
      return 'Мой профиль';
    default:
      return 'Библия';
  }
}

export default Header; 