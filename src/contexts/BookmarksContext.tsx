import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Types
export interface Bookmark {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  label?: string;
  color?: string;
  date: number; // timestamp
}

interface BookmarksContextType {
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'date'>) => void;
  editBookmark: (id: string, updates: Partial<Omit<Bookmark, 'id' | 'date'>>) => void;
  deleteBookmark: (id: string) => void;
  getBookmarksByReference: (book: string, chapter: number, verse?: number) => Bookmark[];
  hasBookmark: (book: string, chapter: number, verse: number) => boolean;
}

// Create context
const BookmarksContext = createContext<BookmarksContextType | null>(null);

// Hook to use the context
export const useBookmarks = (): BookmarksContextType => {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarksProvider');
  }
  return context;
};

// Provider props
interface BookmarksProviderProps {
  children: ReactNode;
}

// Provider component
export const BookmarksProvider: React.FC<BookmarksProviderProps> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  
  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bible_bookmarks');
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error('Error loading bookmarks', e);
      }
    }
  }, []);
  
  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bible_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);
  
  // Add a new bookmark
  const addBookmark = (bookmark: Omit<Bookmark, 'id' | 'date'>) => {
    // Check if bookmark already exists to avoid duplicates
    const exists = bookmarks.some(
      b => b.book === bookmark.book && 
           b.chapter === bookmark.chapter && 
           b.verse === bookmark.verse
    );
    
    if (exists) {
      return; // Don't add duplicate bookmarks
    }
    
    const newBookmark: Bookmark = {
      ...bookmark,
      id: Date.now().toString(),
      date: Date.now()
    };
    
    setBookmarks(prev => [newBookmark, ...prev]);
  };
  
  // Edit an existing bookmark
  const editBookmark = (id: string, updates: Partial<Omit<Bookmark, 'id' | 'date'>>) => {
    setBookmarks(prev => 
      prev.map(bookmark => 
        bookmark.id === id 
          ? { ...bookmark, ...updates }
          : bookmark
      )
    );
  };
  
  // Delete a bookmark
  const deleteBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
  };
  
  // Check if a reference is bookmarked
  const hasBookmark = (book: string, chapter: number, verse: number): boolean => {
    return bookmarks.some(
      b => b.book === book && 
           b.chapter === chapter && 
           b.verse === verse
    );
  };
  
  // Get bookmarks by Bible reference
  const getBookmarksByReference = (book: string, chapter: number, verse?: number): Bookmark[] => {
    return bookmarks.filter(bookmark => {
      if (verse) {
        return bookmark.book === book && bookmark.chapter === chapter && bookmark.verse === verse;
      }
      return bookmark.book === book && bookmark.chapter === chapter;
    });
  };
  
  const value = {
    bookmarks,
    addBookmark,
    editBookmark,
    deleteBookmark,
    getBookmarksByReference,
    hasBookmark
  };
  
  return <BookmarksContext.Provider value={value}>{children}</BookmarksContext.Provider>;
};

export default BookmarksContext; 