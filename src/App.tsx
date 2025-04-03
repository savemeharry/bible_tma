import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from './contexts/ThemeContext';
import { BibleProvider } from './contexts/BibleContext';
import { NotesProvider } from './contexts/NotesContext';
import { BookmarksProvider } from './contexts/BookmarksContext';
import { SettingsProvider } from './contexts/SettingsContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SplashScreen from './components/SplashScreen';
import HomePage from './pages/HomePage';
import ReadingPage from './pages/ReadingPage';
import NotesPage from './pages/NotesPage';
import BookmarksPage from './pages/BookmarksPage';
import PlansPage from './pages/PlansPage';
import AccountPage from './pages/AccountPage';
import './App.css';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 600px;
  margin: 0 auto;
  background-color: var(--bg-main);
  color: var(--text-main);
`;

const ContentArea = styled.main`
  flex: 1;
  padding-top: var(--header-height);
  padding-bottom: var(--footer-height);
  overflow-x: hidden;
  position: relative;
`;

const App: React.FC = () => {
  const { /* theme */ } = useTheme();
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // When route changes, scroll to top
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  // Show splash screen on initial load
  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <SettingsProvider>
      <BibleProvider>
        <NotesProvider>
          <BookmarksProvider>
            <AppContainer>
              <Header />
              <ContentArea>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/read/:book?/:chapter?/:verse?" element={<ReadingPage />} />
                  <Route path="/notes" element={<NotesPage />} />
                  <Route path="/bookmarks" element={<BookmarksPage />} />
                  <Route path="/plans" element={<PlansPage />} />
                  <Route path="/account" element={<AccountPage />} />
                </Routes>
              </ContentArea>
              <Footer />
            </AppContainer>
          </BookmarksProvider>
        </NotesProvider>
      </BibleProvider>
    </SettingsProvider>
  );
};

export default App;
