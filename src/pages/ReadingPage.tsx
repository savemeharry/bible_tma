import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useBible } from '../contexts/BibleContext';
import { useNotes } from '../contexts/NotesContext';
import { useBookmarks } from '../contexts/BookmarksContext';
import { useSettings } from '../contexts/SettingsContext';
import BibleService from '../services/bibleService';
import Modal from '../components/Modal';
import { useSDK } from '../utils/tma-mock';

const ReadingContainer = styled.div`
  padding-bottom: 70px; /* Space for action panel */
`;

const ReadingContent = styled.div`
  padding: 0 20px;
`;

interface BibleTextProps {
  fontSize?: number;
  fontFamily?: string;
  lineHeight?: number;
}

const BibleText = styled.div<BibleTextProps>`
  font-family: ${props => props.fontFamily || 'var(--font-text)'};
  font-size: ${props => props.fontSize ? `${props.fontSize}px` : '1rem'};
  line-height: ${props => props.lineHeight || 'var(--base-line-height)'};
  color: var(--text-main);
  margin-bottom: 30px;
  
  p {
    margin-bottom: 1.2em;
  }
  
  sup {
    font-size: 0.65em;
    vertical-align: super;
    margin: 0 1px 0 3px;
    color: var(--link-color);
    font-weight: 600;
    cursor: pointer;
    user-select: none;
  }
  
  .word {
    cursor: pointer;
    border-bottom: 1px dotted var(--accent-color);
    transition: background-color 0.2s;
    
    &:hover {
      background-color: rgba(52, 152, 219, 0.1);
    }
  }
  
  .bookmark-icon {
    display: inline-block;
    color: var(--accent-color);
    margin-left: 2px;
    font-size: 0.8em;
  }
`;

interface ActionPanelProps {
  visible: boolean;
}

const ActionPanel = styled.div<ActionPanelProps>`
  position: fixed;
  bottom: var(--footer-height);
  left: 0;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  background-color: var(--bg-content);
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 8px 0;
  box-shadow: var(--shadow);
  z-index: 5;
  transform: ${props => props.visible ? 'translateY(0)' : 'translateY(100%)'};
  transition: transform 0.3s ease-in-out;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: var(--text-main);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;
  
  svg {
    width: 22px;
    height: 22px;
    fill: currentColor;
  }
  
  &.active {
    color: var(--accent-color);
  }
`;

const ReadingPage: React.FC = () => {
  const { book, chapter, verse } = useParams<{book?: string, chapter?: string, verse?: string}>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const sdk = useSDK();
  
  // References to verse elements
  const verseRefs = useRef<{[key: string]: HTMLElement | null}>({});
  
  // Use contexts
  const bible = useBible();
  const notes = useNotes();
  const bookmarks = useBookmarks();
  const { settings } = useSettings();
  
  // Bible state
  const [bibleText, setBibleText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentVerseNumber, setCurrentVerseNumber] = useState<number>(1);
  
  // Modal states
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showWordModal, setShowWordModal] = useState(false);
  const [currentWord, setCurrentWord] = useState<any>(null);
  
  // Form states
  const [noteText, setNoteText] = useState("");
  const [noteTags, setNoteTags] = useState("");
  const [bookmarkLabel, setBookmarkLabel] = useState("");
  
  // Effect to load Bible text when params change
  useEffect(() => {
    loadBibleText();
    // Scroll to top when chapter changes
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book, chapter, verse, bible.currentTranslation]);
  
  // Scroll handling to show/hide action panel
  useEffect(() => {
    const handleScroll = () => {
      const st = window.scrollY;
      if (st > lastScrollTop && st > 50) {
        // Scrolling down
        setShowActions(false);
      } else {
        // Scrolling up
        setShowActions(true);
      }
      setLastScrollTop(st <= 0 ? 0 : st);
      
      // Determine which verse is currently in view
      if (verseRefs.current) {
        for (const [verseNum, element] of Object.entries(verseRefs.current)) {
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
              setCurrentVerseNumber(parseInt(verseNum));
              break;
            }
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);
  
  // Function to load Bible text
  const loadBibleText = async () => {
    try {
      setLoading(true);
      
      // Use the current location from context if no params provided
      const bookId = book || bible.currentLocation.book;
      const chapterNum = chapter ? parseInt(chapter) : bible.currentLocation.chapter;
      const verseNum = verse ? parseInt(verse) : bible.currentLocation.verse;
      
      // Update the current location in context
      if (bookId && chapterNum) {
        bible.setLocation({
          book: bookId,
          chapter: chapterNum,
          verse: verseNum
        });
      }
      
      // Get chapter data from the service
      const chapterData = await BibleService.getChapter(
        bookId,
        chapterNum,
        bible.currentTranslation.id
      );
      
      // Format the chapter data with bookmark indicators
      let formattedText = '';
      chapterData.verses.forEach(v => {
        const hasBookmark = bookmarks.hasBookmark(bookId, chapterNum, v.verse);
        const bookmarkIcon = hasBookmark ? `<span class="bookmark-icon">🔖</span>` : '';
        formattedText += `<p data-verse="${v.verse}"><sup>${v.verse}</sup> ${v.text}${bookmarkIcon}</p>`;
      });
      
      setBibleText(formattedText);
      setCurrentVerseNumber(verseNum || 1);
    } catch (error) {
      console.error("Error loading Bible text:", error);
      setBibleText("<p>Произошла ошибка при загрузке текста. Пожалуйста, попробуйте еще раз.</p>");
    } finally {
      setLoading(false);
    }
  };
  
  // Set up refs for verse elements after rendering
  useEffect(() => {
    if (!loading) {
      const verseElements = document.querySelectorAll('[data-verse]');
      verseElements.forEach(element => {
        const verseNum = element.getAttribute('data-verse');
        if (verseNum) {
          verseRefs.current[verseNum] = element as HTMLElement;
        }
      });
    }
  }, [loading, bibleText]);
  
  // Word click handler (for linguistic analysis)
  const handleWordClick = async (e: React.MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).classList.contains('word')) {
      const wordId = (e.target as HTMLElement).getAttribute('data-word-id');
      if (wordId) {
        console.log("Analyzing word:", (e.target as HTMLElement).textContent, "ID:", wordId);
        
        // Get the word data
        const wordData = await BibleService.getWordData(wordId);
        if (wordData) {
          setCurrentWord(wordData);
          setShowWordModal(true);
        }
      }
    }
    
    // Check if verse number was clicked (for verse-specific actions)
    if ((e.target as HTMLElement).tagName === 'SUP') {
      const verseElement = (e.target as HTMLElement).closest('[data-verse]');
      if (verseElement) {
        const verseNum = verseElement.getAttribute('data-verse');
        if (verseNum) {
          setCurrentVerseNumber(parseInt(verseNum));
        }
      }
    }
  };
  
  // Handlers for action buttons
  const handleAddBookmark = () => {
    // Reset the form
    setBookmarkLabel("");
    setShowBookmarkModal(true);
  };
  
  const handleSaveBookmark = () => {
    const currentBook = bible.currentLocation.book;
    const currentChapter = bible.currentLocation.chapter;
    
    bookmarks.addBookmark({
      book: currentBook,
      chapter: currentChapter,
      verse: currentVerseNumber,
      label: bookmarkLabel
    });
    
    setShowBookmarkModal(false);
    
    // Show confirmation using Telegram PopupButton if available
    if (sdk.tg && sdk.tg.showPopup) {
      sdk.tg.showPopup({
        title: 'Готово',
        message: `Закладка добавлена для ${bible.getBookName(currentBook)} ${currentChapter}:${currentVerseNumber}`,
        buttons: [{ type: 'ok' }]
      });
    } else {
      alert(`Закладка добавлена для ${bible.getBookName(currentBook)} ${currentChapter}:${currentVerseNumber}`);
    }
    
    // Reload the Bible text to show the bookmark icon
    loadBibleText();
  };
  
  const handleAddNote = () => {
    // Reset the form
    setNoteText("");
    setNoteTags("");
    setShowNoteModal(true);
  };
  
  const handleSaveNote = () => {
    const currentBook = bible.currentLocation.book;
    const currentChapter = bible.currentLocation.chapter;
    
    // Process tags (split by spaces or commas)
    const tagsList = noteTags
      .split(/[,\s]+/)
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    notes.addNote({
      book: currentBook,
      chapter: currentChapter,
      verse: currentVerseNumber,
      text: noteText,
      tags: tagsList
    });
    
    setShowNoteModal(false);
    
    // Show confirmation using Telegram PopupButton if available
    if (sdk.tg && sdk.tg.showPopup) {
      sdk.tg.showPopup({
        title: 'Готово',
        message: `Заметка сохранена для ${bible.getBookName(currentBook)} ${currentChapter}:${currentVerseNumber}`,
        buttons: [{ type: 'ok' }]
      });
    } else {
      alert(`Заметка сохранена для ${bible.getBookName(currentBook)} ${currentChapter}:${currentVerseNumber}`);
    }
  };
  
  const handleShare = () => {
    setShowShareModal(true);
    
    // Use Telegram native share if available
    if (sdk.tg && sdk.tg.shareText) {
      const { book, chapter } = bible.currentLocation;
      const bookName = bible.getBookName(book);
      
      // Get the text of the current verse
      const verseElement = verseRefs.current[currentVerseNumber.toString()];
      let verseText = '';
      if (verseElement) {
        verseText = verseElement.textContent || '';
        // Remove the verse number from the text
        verseText = verseText.replace(/^\d+\s*/, '');
      }
      
      const shareText = `${bookName} ${chapter}:${currentVerseNumber} - "${verseText}" (${bible.currentTranslation.shortName})`;
      
      try {
        sdk.tg.shareText(shareText);
      } catch (error) {
        console.error("Error sharing with Telegram:", error);
        
        // Fallback to clipboard
        handleCopyText();
      }
    }
  };
  
  const handleCopyText = () => {
    const { book, chapter } = bible.currentLocation;
    const bookName = bible.getBookName(book);
    
    // Get the text of the current verse
    const verseElement = verseRefs.current[currentVerseNumber.toString()];
    let verseText = '';
    if (verseElement) {
      verseText = verseElement.textContent || '';
      // Remove the verse number from the text
      verseText = verseText.replace(/^\d+\s*/, '');
    }
    
    const textToCopy = `${bookName} ${chapter}:${currentVerseNumber} - "${verseText}" (${bible.currentTranslation.shortName})`;
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        if (sdk.tg && sdk.tg.showPopup) {
          sdk.tg.showPopup({
            title: 'Скопировано',
            message: 'Текст скопирован в буфер обмена',
            buttons: [{ type: 'ok' }]
          });
        } else {
          alert('Текст скопирован в буфер обмена');
        }
        setShowShareModal(false);
      })
      .catch(err => {
        console.error('Не удалось скопировать текст: ', err);
        if (sdk.tg && sdk.tg.showPopup) {
          sdk.tg.showPopup({
            title: 'Ошибка',
            message: 'Не удалось скопировать текст',
            buttons: [{ type: 'ok' }]
          });
        } else {
          alert('Не удалось скопировать текст');
        }
      });
  };
  
  const handleShareTelegram = () => {
    const { book, chapter } = bible.currentLocation;
    const bookName = bible.getBookName(book);
    
    // Get the text of the current verse
    const verseElement = verseRefs.current[currentVerseNumber.toString()];
    let verseText = '';
    if (verseElement) {
      verseText = verseElement.textContent || '';
      // Remove the verse number from the text
      verseText = verseText.replace(/^\d+\s*/, '');
    }
    
    const shareText = `${bookName} ${chapter}:${currentVerseNumber} - "${verseText}" (${bible.currentTranslation.shortName})`;
    
    if (sdk.tg && sdk.tg.shareText) {
      try {
        sdk.tg.shareText(shareText);
        setShowShareModal(false);
      } catch (error) {
        console.error("Error sharing with Telegram:", error);
      }
    } else {
      // Fallback to clipboard
      handleCopyText();
    }
  };
  
  const handleParallelReading = () => {
    // Show a notification using Telegram PopupButton if available
    if (sdk.tg && sdk.tg.showPopup) {
      sdk.tg.showPopup({
        title: 'Скоро',
        message: 'Функция параллельного чтения будет доступна в следующей версии',
        buttons: [{ type: 'ok' }]
      });
    } else {
      alert("Функция параллельного чтения будет доступна в следующей версии");
    }
  };
  
  const handleAudio = () => {
    // Show a notification using Telegram PopupButton if available
    if (sdk.tg && sdk.tg.showPopup) {
      sdk.tg.showPopup({
        title: 'Скоро',
        message: 'Аудио версия будет доступна в следующей версии',
        buttons: [{ type: 'ok' }]
      });
    } else {
      alert("Аудио версия будет доступна в следующей версии");
    }
  };
  
  return (
    <ReadingContainer className="app-main">
      <ReadingContent>
        {loading ? (
          <div>Загрузка...</div>
        ) : (
          <BibleText 
            dangerouslySetInnerHTML={{ __html: bibleText }} 
            onClick={handleWordClick}
            fontSize={settings.fontSize}
            fontFamily={settings.fontFamily}
            lineHeight={settings.lineHeight}
          />
        )}
      </ReadingContent>
      
      <ActionPanel visible={showActions}>
        <ActionButton 
          title="Добавить закладку" 
          onClick={handleAddBookmark}
          className={bookmarks.hasBookmark(bible.currentLocation.book, bible.currentLocation.chapter, currentVerseNumber) ? 'active' : ''}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/>
          </svg>
        </ActionButton>
        
        <ActionButton title="Создать заметку" onClick={handleAddNote}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </ActionButton>
        
        <ActionButton title="Копировать/Поделиться" onClick={handleShare}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 8.81C7.5 8.31 6.79 8 6 8c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
          </svg>
        </ActionButton>
        
        <ActionButton title="Параллельное чтение" onClick={handleParallelReading}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 18V6h8v12H4zm10 0V6h6v12h-6z"/>
          </svg>
        </ActionButton>
        
        <ActionButton title="Аудио версия" onClick={handleAudio}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M15 11V5l-3-3-3 3v6H5v12h14V11h-4zm-5 0V5.5l2-2 2 2V11H10z"/>
          </svg>
        </ActionButton>
      </ActionPanel>
      
      {/* Note Modal */}
      <Modal
        id="note-modal"
        title="Создать заметку"
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
      >
        <p>Создание заметки для {bible.getBookName(bible.currentLocation.book)} {bible.currentLocation.chapter}:{currentVerseNumber}</p>
        <textarea
          placeholder="Введите вашу заметку..."
          style={{ 
            width: '100%', 
            minHeight: '150px', 
            padding: '10px',
            marginTop: '15px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            fontFamily: 'inherit'
          }}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />
        <input
          type="text"
          placeholder="Теги (через пробел или запятую)"
          style={{ 
            width: '100%', 
            padding: '10px',
            marginTop: '15px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            fontFamily: 'inherit'
          }}
          value={noteTags}
          onChange={(e) => setNoteTags(e.target.value)}
        />
        <button
          style={{
            display: 'block',
            width: '100%',
            padding: '12px',
            marginTop: '15px',
            background: 'var(--accent-color)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
          onClick={handleSaveNote}
          disabled={!noteText.trim()}
        >
          Сохранить
        </button>
      </Modal>
      
      {/* Bookmark Modal */}
      <Modal
        id="bookmark-modal"
        title="Добавить закладку"
        isOpen={showBookmarkModal}
        onClose={() => setShowBookmarkModal(false)}
      >
        <p>Закладка для {bible.getBookName(bible.currentLocation.book)} {bible.currentLocation.chapter}:{currentVerseNumber}</p>
        <input
          type="text"
          placeholder="Добавить метку (опционально)"
          style={{ 
            width: '100%', 
            padding: '10px',
            marginTop: '15px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            fontFamily: 'inherit'
          }}
          value={bookmarkLabel}
          onChange={(e) => setBookmarkLabel(e.target.value)}
        />
        <button
          style={{
            display: 'block',
            width: '100%',
            padding: '12px',
            marginTop: '15px',
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
      </Modal>
      
      {/* Share Modal */}
      <Modal
        id="share-modal"
        title="Поделиться"
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      >
        <p>Поделиться {bible.getBookName(bible.currentLocation.book)} {bible.currentLocation.chapter}:{currentVerseNumber}</p>
        <div style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button
            style={{
              padding: '12px',
              background: 'var(--accent-color)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={handleCopyText}
          >
            Копировать
          </button>
          <button
            style={{
              padding: '12px',
              background: 'var(--accent-color)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={handleShareTelegram}
          >
            Telegram
          </button>
        </div>
      </Modal>
      
      {/* Word Analysis Modal */}
      <Modal
        id="word-modal"
        title="Лингв. анализ"
        isOpen={showWordModal}
        onClose={() => setShowWordModal(false)}
      >
        {currentWord && (
          <>
            <h2 style={{ fontFamily: "'GFS Neohellenic', serif", textAlign: 'center', marginBottom: '10px' }}>
              {currentWord.original}
            </h2>
            <p style={{ textAlign: 'center', fontStyle: 'italic', marginBottom: '15px', color: 'var(--text-secondary)' }}>
              [{currentWord.transliteration}]
            </p>
            <div>
              <p><strong>Морфология:</strong> {currentWord.morphology}</p>
              <p><strong>Стронг:</strong> {currentWord.strongId}</p>
              <p><strong>Значение:</strong> {currentWord.definition}</p>
              <p><strong>Частота:</strong> {currentWord.frequency || 'Н/Д'}</p>
              <p style={{ color: 'var(--placeholder-color)', marginTop: '15px', textAlign: 'center' }}>
                (Больше возможностей в полной версии)
              </p>
            </div>
          </>
        )}
      </Modal>
    </ReadingContainer>
  );
};

export default ReadingPage; 