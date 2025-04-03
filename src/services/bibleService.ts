// Bible data types
export interface BibleBook {
  id: string;
  name: string;
  chapters: number;
  testament: 'old' | 'new';
}

export interface BibleTranslation {
  id: string;
  name: string;
  shortName: string;
  language: string;
}

export interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

// Mock data for the prototype
const bibleBooks: BibleBook[] = [
  { id: 'Gen', name: 'Бытие', chapters: 50, testament: 'old' },
  { id: 'Exo', name: 'Исход', chapters: 40, testament: 'old' },
  { id: 'Lev', name: 'Левит', chapters: 27, testament: 'old' },
  { id: 'Num', name: 'Числа', chapters: 36, testament: 'old' },
  { id: 'Deu', name: 'Второзаконие', chapters: 34, testament: 'old' },
  { id: 'Jos', name: 'Иисус Навин', chapters: 24, testament: 'old' },
  { id: 'Jdg', name: 'Судьи', chapters: 21, testament: 'old' },
  { id: 'Rut', name: 'Руфь', chapters: 4, testament: 'old' },
  { id: '1Sa', name: '1-я Царств', chapters: 31, testament: 'old' },
  { id: '2Sa', name: '2-я Царств', chapters: 24, testament: 'old' },
  { id: '1Ki', name: '3-я Царств', chapters: 22, testament: 'old' },
  { id: '2Ki', name: '4-я Царств', chapters: 25, testament: 'old' },
  { id: '1Ch', name: '1-я Паралипоменон', chapters: 29, testament: 'old' },
  { id: '2Ch', name: '2-я Паралипоменон', chapters: 36, testament: 'old' },
  { id: 'Ezr', name: 'Ездра', chapters: 10, testament: 'old' },
  { id: 'Neh', name: 'Неемия', chapters: 13, testament: 'old' },
  { id: 'Est', name: 'Есфирь', chapters: 10, testament: 'old' },
  { id: 'Job', name: 'Иов', chapters: 42, testament: 'old' },
  { id: 'Psa', name: 'Псалтирь', chapters: 150, testament: 'old' },
  { id: 'Pro', name: 'Притчи', chapters: 31, testament: 'old' },
  { id: 'Ecc', name: 'Екклесиаст', chapters: 12, testament: 'old' },
  { id: 'Sng', name: 'Песнь песней', chapters: 8, testament: 'old' },
  { id: 'Isa', name: 'Исаия', chapters: 66, testament: 'old' },
  { id: 'Jer', name: 'Иеремия', chapters: 52, testament: 'old' },
  { id: 'Lam', name: 'Плач Иеремии', chapters: 5, testament: 'old' },
  { id: 'Ezk', name: 'Иезекииль', chapters: 48, testament: 'old' },
  { id: 'Dan', name: 'Даниил', chapters: 12, testament: 'old' },
  { id: 'Hos', name: 'Осия', chapters: 14, testament: 'old' },
  { id: 'Jol', name: 'Иоиль', chapters: 3, testament: 'old' },
  { id: 'Amo', name: 'Амос', chapters: 9, testament: 'old' },
  { id: 'Oba', name: 'Авдий', chapters: 1, testament: 'old' },
  { id: 'Jon', name: 'Иона', chapters: 4, testament: 'old' },
  { id: 'Mic', name: 'Михей', chapters: 7, testament: 'old' },
  { id: 'Nah', name: 'Наум', chapters: 3, testament: 'old' },
  { id: 'Hab', name: 'Аввакум', chapters: 3, testament: 'old' },
  { id: 'Zep', name: 'Софония', chapters: 3, testament: 'old' },
  { id: 'Hag', name: 'Аггей', chapters: 2, testament: 'old' },
  { id: 'Zec', name: 'Захария', chapters: 14, testament: 'old' },
  { id: 'Mal', name: 'Малахия', chapters: 4, testament: 'old' },
  { id: 'Mat', name: 'От Матфея', chapters: 28, testament: 'new' },
  { id: 'Mar', name: 'От Марка', chapters: 16, testament: 'new' },
  { id: 'Luk', name: 'От Луки', chapters: 24, testament: 'new' },
  { id: 'Joh', name: 'От Иоанна', chapters: 21, testament: 'new' },
  { id: 'Act', name: 'Деяния', chapters: 28, testament: 'new' },
  { id: 'Rom', name: 'К Римлянам', chapters: 16, testament: 'new' },
  { id: '1Co', name: '1-е Коринфянам', chapters: 16, testament: 'new' },
  { id: '2Co', name: '2-е Коринфянам', chapters: 13, testament: 'new' },
  { id: 'Gal', name: 'К Галатам', chapters: 6, testament: 'new' },
  { id: 'Eph', name: 'К Ефесянам', chapters: 6, testament: 'new' },
  { id: 'Php', name: 'К Филиппийцам', chapters: 4, testament: 'new' },
  { id: 'Col', name: 'К Колоссянам', chapters: 4, testament: 'new' },
  { id: '1Th', name: '1-е Фессалоникийцам', chapters: 5, testament: 'new' },
  { id: '2Th', name: '2-е Фессалоникийцам', chapters: 3, testament: 'new' },
  { id: '1Ti', name: '1-е Тимофею', chapters: 6, testament: 'new' },
  { id: '2Ti', name: '2-е Тимофею', chapters: 4, testament: 'new' },
  { id: 'Tit', name: 'К Титу', chapters: 3, testament: 'new' },
  { id: 'Phm', name: 'К Филимону', chapters: 1, testament: 'new' },
  { id: 'Heb', name: 'К Евреям', chapters: 13, testament: 'new' },
  { id: 'Jas', name: 'Иакова', chapters: 5, testament: 'new' },
  { id: '1Pe', name: '1-е Петра', chapters: 5, testament: 'new' },
  { id: '2Pe', name: '2-е Петра', chapters: 3, testament: 'new' },
  { id: '1Jo', name: '1-е Иоанна', chapters: 5, testament: 'new' },
  { id: '2Jo', name: '2-е Иоанна', chapters: 1, testament: 'new' },
  { id: '3Jo', name: '3-е Иоанна', chapters: 1, testament: 'new' },
  { id: 'Jud', name: 'Иуды', chapters: 1, testament: 'new' },
  { id: 'Rev', name: 'Откровение', chapters: 22, testament: 'new' },
];

const bibleTranslations: BibleTranslation[] = [
  { id: 'synodal', name: 'Синодальный перевод', shortName: 'Синод.', language: 'ru' },
  { id: 'rbo', name: 'Современный перевод РБО', shortName: 'РБО', language: 'ru' },
  { id: 'nrt', name: 'Новый русский перевод', shortName: 'НРП', language: 'ru' },
  { id: 'kjv', name: 'King James Version', shortName: 'KJV', language: 'en' },
  { id: 'niv', name: 'New International Version', shortName: 'NIV', language: 'en' },
  { id: 'wlc', name: 'Древнееврейский (WLC)', shortName: 'Heb', language: 'he' },
  { id: 'tr', name: 'Древнегреческий (TR)', shortName: 'Grk', language: 'el' },
];

// Sample first chapter of Genesis for demo
const sampleChapter = {
  book: 'Gen',
  chapter: 1,
  verses: [
    { verse: 1, text: 'В <span class="word" data-word-id="g746">начале</span> сотворил Бог небо и землю.' },
    { verse: 2, text: 'Земля же была безвидна и пуста, и тьма над бездною, и Дух Божий носился над водою.' },
    { verse: 3, text: 'И сказал Бог: да будет свет. И стал свет.' },
    { verse: 4, text: 'И увидел Бог свет, что он хорош, и отделил Бог свет от тьмы.' },
    { verse: 5, text: 'И назвал Бог свет днем, а тьму ночью. И был вечер, и было утро: день один.' },
    // Add more verses as needed
  ]
};

// Sample word data for linguistic analysis
export interface WordData {
  id: string;
  original: string;
  transliteration: string;
  morphology: string;
  strongNumber: string;
  definition: string;
  usage: number;
}

const sampleWordData: Record<string, WordData> = {
  'g746': {
    id: 'g746',
    original: 'ἀρχῇ',
    transliteration: 'archē',
    morphology: 'Сущ., Дат.п., ед.ч., ж.р.',
    strongNumber: 'G746',
    definition: 'начало, власть',
    usage: 55
  }
};

// Bible Service Functions
export const BibleService = {
  // Get all books
  getBooks: (): BibleBook[] => {
    return bibleBooks;
  },
  
  // Get books by testament
  getBooksByTestament: (testament: 'old' | 'new'): BibleBook[] => {
    return bibleBooks.filter(book => book.testament === testament);
  },
  
  // Get a single book by ID
  getBook: (id: string): BibleBook | undefined => {
    return bibleBooks.find(book => book.id === id);
  },
  
  // Get all translations
  getTranslations: (): BibleTranslation[] => {
    return bibleTranslations;
  },
  
  // Get translations by language
  getTranslationsByLanguage: (language: string): BibleTranslation[] => {
    return bibleTranslations.filter(translation => translation.language === language);
  },
  
  // Get a single translation by ID
  getTranslation: (id: string): BibleTranslation | undefined => {
    return bibleTranslations.find(translation => translation.id === id);
  },
  
  // Get chapter text
  getChapter: (bookId: string, chapter: number, translationId: string = 'synodal'): Promise<{ verses: { verse: number, text: string }[] }> => {
    // This would be an API call in a real app
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(sampleChapter);
      }, 300); // Simulate network delay
    });
  },
  
  // Get a single verse
  getVerse: (bookId: string, chapter: number, verse: number, translationId: string = 'synodal'): Promise<BibleVerse | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const verseData = sampleChapter.verses.find(v => v.verse === verse);
        if (verseData) {
          resolve({
            book: bookId,
            chapter,
            verse,
            text: verseData.text
          });
        } else {
          resolve(null);
        }
      }, 300);
    });
  },
  
  // Get word data for linguistic analysis
  getWordData: (wordId: string): Promise<WordData | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(sampleWordData[wordId] || null);
      }, 300);
    });
  },
  
  // Get verse of the day
  getVerseOfTheDay: (): Promise<BibleVerse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          book: 'Joh',
          chapter: 3,
          verse: 16,
          text: 'Ибо так возлюбил Бог мир, что отдал Сына Своего Единородного, дабы всякий верующий в Него, не погиб, но имел жизнь вечную.'
        });
      }, 300);
    });
  },
  
  // Search the Bible text
  search: (query: string, translationId: string = 'synodal'): Promise<BibleVerse[]> => {
    // This would be an API call in a real app
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return some sample search results
        resolve([
          {
            book: 'Joh',
            chapter: 3,
            verse: 16,
            text: 'Ибо так возлюбил Бог мир, что отдал Сына Своего Единородного, дабы всякий верующий в Него, не погиб, но имел жизнь вечную.'
          },
          {
            book: 'Rom',
            chapter: 8,
            verse: 28,
            text: 'Притом знаем, что любящим Бога, призванным по Его изволению, все содействует ко благу.'
          }
        ]);
      }, 500);
    });
  }
};

export default BibleService; 