import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Types
export interface Note {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  tags: string[];
  date: number; // timestamp
}

interface NotesContextType {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'date'>) => void;
  editNote: (id: string, updates: Partial<Omit<Note, 'id' | 'date'>>) => void;
  deleteNote: (id: string) => void;
  getNotesByReference: (book: string, chapter: number, verse?: number) => Note[];
}

// Create context
const NotesContext = createContext<NotesContextType | null>(null);

// Hook to use the context
export const useNotes = (): NotesContextType => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

// Provider props
interface NotesProviderProps {
  children: ReactNode;
}

// Provider component
export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  
  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('bible_notes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error('Error loading notes', e);
      }
    }
  }, []);
  
  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bible_notes', JSON.stringify(notes));
  }, [notes]);
  
  // Add a new note
  const addNote = (note: Omit<Note, 'id' | 'date'>) => {
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      date: Date.now()
    };
    
    setNotes(prev => [newNote, ...prev]);
  };
  
  // Edit an existing note
  const editNote = (id: string, updates: Partial<Omit<Note, 'id' | 'date'>>) => {
    setNotes(prev => 
      prev.map(note => 
        note.id === id 
          ? { ...note, ...updates }
          : note
      )
    );
  };
  
  // Delete a note
  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };
  
  // Get notes by Bible reference
  const getNotesByReference = (book: string, chapter: number, verse?: number): Note[] => {
    return notes.filter(note => {
      if (verse) {
        return note.book === book && note.chapter === chapter && note.verse === verse;
      }
      return note.book === book && note.chapter === chapter;
    });
  };
  
  const value = {
    notes,
    addNote,
    editNote,
    deleteNote,
    getNotesByReference
  };
  
  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};

export default NotesContext; 