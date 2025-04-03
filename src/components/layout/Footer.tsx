import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  height: var(--footer-height);
  background-color: var(--bg-content);
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  z-index: 10;
  box-shadow: 0 -4px 10px rgba(0,0,0,0.05);
`;

const FooterButton = styled(NavLink)`
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.75rem;
  text-align: center;
  opacity: 0.8;
  transition: opacity 0.2s, color 0.2s, transform 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
  padding: 8px 0;
  text-decoration: none;
  
  &.active {
    color: var(--accent-color);
    opacity: 1;
    font-weight: 600;
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  svg {
    width: 26px;
    height: 26px;
    fill: currentColor;
    margin-bottom: 2px;
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterButton to="/" end>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
        Главная
      </FooterButton>
      
      <FooterButton to="/read">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M18,2H6C4.9,2,4,2.9,4,4v16c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V4C20,2.9,19.1,2,18,2z M6,4h5v8l-2.5-1.5L6,12V4z M18,20H6V14h12V20z"/>
        </svg>
        Читать
      </FooterButton>
      
      <FooterButton to="/plans">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
        </svg>
        Планы
      </FooterButton>
      
      <FooterButton to="/account">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
        </svg>
        Профиль
      </FooterButton>
    </FooterContainer>
  );
};

export default Footer; 