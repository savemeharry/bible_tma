import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useNotes, Note } from '../contexts/NotesContext';
import { useBible } from '../contexts/BibleContext';
import Modal from '../components/Modal';

const NotesContainer = styled.div`
  padding: 15px;
  margin-top: 10px;
`;

const AddNoteButton = styled.button`
  background-color: var(--accent-color);
  color: white;
  border: none;
  padding: 12px 18px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  transition: background-color 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 15px;
  
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
    margin-right: 8px;
  }
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

const NoteTags = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

const NoteActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid var(--border-color);
`;

const NoteActionButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background-color 0.1s, color 0.1s;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: var(--text-main);
  }
  
  svg {
    width: 16px;
    height: 16px;
    margin-right: 5px;
    vertical-align: text-bottom;
  }
`;

const EmptyNotesMessage = styled.div`
  text-align: center;
  margin: 40px 0;
  color: var(--text-secondary);
  font-size: 1.1rem;
`;

const NotesPage: React.FC = () => {
  const navigate = useNavigate();
  const notes = useNotes();
  const bible = useBible();
  
  // Modal states
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [noteText, setNoteText] = useState("");
  const [noteTags, setNoteTags] = useState("");
  const [book, setBook] = useState("Gen");
  const [chapter, setChapter] = useState(1);
  const [verse, setVerse] = useState(1);
  
  const handleAddNote = () => {
    // Reset the form for a new note
    setCurrentNote(null);
    setNoteText("");
    setNoteTags("");
    setBook("Gen");
    setChapter(1);
    setVerse(1);
    setShowNoteModal(true);
  };
  
  const handleEditNote = (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentNote(note);
    setNoteText(note.text);
    setNoteTags(note.tags.join(", "));
    setBook(note.book);
    setChapter(note.chapter);
    setVerse(note.verse);
    setShowNoteModal(true);
  };
  
  const handleDeleteNote = (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Вы уверены, что хотите удалить эту заметку?")) {
      notes.deleteNote(noteId);
    }
  };
  
  const handleSaveNote = () => {
    // Process tags (split by spaces or commas)
    const tagsList = noteTags
      .split(/[,\s]+/)
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    if (currentNote) {
      // Update existing note
      notes.editNote(currentNote.id, {
        book,
        chapter,
        verse,
        text: noteText,
        tags: tagsList
      });
    } else {
      // Add new note
      notes.addNote({
        book,
        chapter,
        verse,
        text: noteText,
        tags: tagsList
      });
    }
    
    setShowNoteModal(false);
  };
  
  const handleNoteClick = (note: Note) => {
    // Navigate to the verse
    navigate(`/read/${note.book}/${note.chapter}/${note.verse}`);
  };
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };
  
  return (
    <NotesContainer className="app-main">
      <AddNoteButton onClick={handleAddNote}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
        Новая заметка
      </AddNoteButton>
      
      {notes.notes.map(note => (
        <NoteCard key={note.id} onClick={() => handleNoteClick(note)}>
          <NoteMeta>
            <NoteLocation>
              {bible.getBookName(note.book)} {note.chapter}:{note.verse}
            </NoteLocation>
            <span>{formatDate(note.date)}</span>
          </NoteMeta>
          
          {note.tags.length > 0 && (
            <NoteTags>
              #{note.tags.join(' #')}
            </NoteTags>
          )}
          
          <NoteContent>
            {note.text}
          </NoteContent>
          
          <NoteActions>
            <NoteActionButton onClick={(e) => handleEditNote(note, e)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
              Изменить
            </NoteActionButton>
            
            <NoteActionButton onClick={(e) => handleDeleteNote(note.id, e)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
              Удалить
            </NoteActionButton>
          </NoteActions>
        </NoteCard>
      ))}
      
      {notes.notes.length === 0 && (
        <EmptyNotesMessage>
          У вас пока нет заметок. Создайте первую заметку!
        </EmptyNotesMessage>
      )}
      
      {/* Note Modal */}
      <Modal
        id="note-modal"
        title={currentNote ? "Редактировать заметку" : "Создать заметку"}
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
      >
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Место</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <select 
              style={{ 
                flex: 2,
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-main)',
                color: 'var(--text-main)'
              }}
              value={book}
              onChange={(e) => setBook(e.target.value)}
            >
              {bible.books.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              style={{ 
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-main)',
                color: 'var(--text-main)'
              }}
              value={chapter}
              onChange={(e) => setChapter(parseInt(e.target.value) || 1)}
            />
            <input
              type="number"
              min="1"
              style={{ 
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-main)',
                color: 'var(--text-main)'
              }}
              value={verse}
              onChange={(e) => setVerse(parseInt(e.target.value) || 1)}
            />
          </div>
        </div>
        
        <textarea
          placeholder="Введите вашу заметку..."
          style={{ 
            width: '100%', 
            minHeight: '150px', 
            padding: '10px',
            marginTop: '15px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            fontFamily: 'inherit',
            backgroundColor: 'var(--bg-main)',
            color: 'var(--text-main)'
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
            fontFamily: 'inherit',
            backgroundColor: 'var(--bg-main)',
            color: 'var(--text-main)'
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
        
        {currentNote && (
          <button
            style={{
              display: 'block',
              width: '100%',
              padding: '12px',
              marginTop: '10px',
              background: 'transparent',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
            onClick={() => handleDeleteNote(currentNote.id, {} as React.MouseEvent)}
          >
            Удалить заметку
          </button>
        )}
      </Modal>
    </NotesContainer>
  );
};

export default NotesPage; 