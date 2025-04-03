import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import BibleService, { BibleBook, BibleTranslation, BibleVerse } from '../services/bibleService';

// Types
interface BibleLocation {
  book: string;
  chapter: number;
  verse: number;
}

interface RecentLocation extends BibleLocation {
  translationId: string;
  timestamp: number;
}

interface BibleContextType {
  // Current state
  currentLocation: BibleLocation;
  currentTranslation: BibleTranslation;
  
  // Data
  books: BibleBook[];
  translations: BibleTranslation[];
  recentLocations: RecentLocation[];
  
  // Methods
  setLocation: (location: Partial<BibleLocation>) => void;
  setTranslation: (translationId: string) => void;
  getBookName: (bookId: string) => string;
  getBookById: (bookId: string) => BibleBook | undefined;
  getChapterCount: (bookId: string) => number;
  addToRecent: (location: BibleLocation) => void;
}

const BibleContext = createContext<BibleContextType | undefined>(undefined);

interface BibleProviderProps {
  children: ReactNode;
}

export const BibleProvider: React.FC<BibleProviderProps> = ({ children }) => {
  // Initialize current location and translation
  const [currentLocation, setCurrentLocation] = useState<BibleLocation>({
    book: 'Gen',
    chapter: 1,
    verse: 1
  });
  
  const [currentTranslation, setCurrentTranslation] = useState<BibleTranslation>({
    id: 'synodal',
    name: 'Синодальный перевод',
    shortName: 'Синод.',
    language: 'ru'
  });
  
  // Data storage
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [translations, setTranslations] = useState<BibleTranslation[]>([]);
  const [recentLocations, setRecentLocations] = useState<RecentLocation[]>([]);
  
  // Load data
  useEffect(() => {
    // Load books
    const allBooks = BibleService.getBooks();
    setBooks(allBooks);
    
    // Load translations
    const allTranslations = BibleService.getTranslations();
    setTranslations(allTranslations);
    
    // Load recent locations from localStorage
    const savedRecent = localStorage.getItem('recentLocations');
    if (savedRecent) {
      try {
        setRecentLocations(JSON.parse(savedRecent));
      } catch (e) {
        console.error('Error loading recent locations', e);
      }
    }
    
    // Load last location from localStorage
    const savedLocation = localStorage.getItem('lastLocation');
    if (savedLocation) {
      try {
        setCurrentLocation(JSON.parse(savedLocation));
      } catch (e) {
        console.error('Error loading last location', e);
      }
    }
    
    // Load last translation from localStorage
    const savedTranslation = localStorage.getItem('lastTranslation');
    if (savedTranslation) {
      try {
        const trans = BibleService.getTranslation(savedTranslation);
        if (trans) {
          setCurrentTranslation(trans);
        }
      } catch (e) {
        console.error('Error loading last translation', e);
      }
    }
  }, []);
  
  // Save recent locations to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('recentLocations', JSON.stringify(recentLocations));
  }, [recentLocations]);
  
  // Save current location to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('lastLocation', JSON.stringify(currentLocation));
  }, [currentLocation]);
  
  // Save current translation to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('lastTranslation', currentTranslation.id);
  }, [currentTranslation]);
  
  // Methods
  const setLocation = (location: Partial<BibleLocation>) => {
    setCurrentLocation(prev => ({
      ...prev,
      ...location
    }));
    
    // Add to recent locations
    if (location.book && location.chapter) {
      addToRecent({
        book: location.book,
        chapter: location.chapter,
        verse: location.verse || currentLocation.verse
      });
    }
  };
  
  const setTranslation = (translationId: string) => {
    const trans = BibleService.getTranslation(translationId);
    if (trans) {
      setCurrentTranslation(trans);
    }
  };
  
  const getBookName = (bookId: string): string => {
    const book = books.find(b => b.id === bookId);
    return book ? book.name : bookId;
  };
  
  const getBookById = (bookId: string): BibleBook | undefined => {
    return books.find(b => b.id === bookId);
  };
  
  const getChapterCount = (bookId: string): number => {
    const book = books.find(b => b.id === bookId);
    return book ? book.chapters : 0;
  };
  
  const addToRecent = (location: BibleLocation) => {
    // Create a new recent location
    const newRecent: RecentLocation = {
      ...location,
      translationId: currentTranslation.id,
      timestamp: Date.now()
    };
    
    // Add to recent locations (avoiding duplicates and keeping only the 10 most recent)
    setRecentLocations(prev => {
      // Filter out duplicate locations (same book and chapter)
      const filtered = prev.filter(
        loc => !(loc.book === location.book && loc.chapter === location.chapter)
      );
      
      // Add the new location at the beginning
      return [newRecent, ...filtered].slice(0, 10);
    });
  };
  
  const value = {
    currentLocation,
    currentTranslation,
    books,
    translations,
    recentLocations,
    setLocation,
    setTranslation,
    getBookName,
    getBookById,
    getChapterCount,
    addToRecent
  };
  
  return <BibleContext.Provider value={value}>{children}</BibleContext.Provider>;
};

// Hook
export const useBible = (): BibleContextType => {
  const context = useContext(BibleContext);
  if (!context) {
    throw new Error('useBible must be used within a BibleProvider');
  }
  return context;
};

export default BibleContext; 