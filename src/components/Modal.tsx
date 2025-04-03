import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { createPortal } from 'react-dom';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 90;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0s linear 0.3s;
  
  &.visible {
    opacity: 1;
    visibility: visible;
    transition: opacity 0.3s ease;
  }
`;

const ModalContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  background-color: var(--bg-content);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  z-index: 100;
  box-shadow: 0 -5px 20px rgba(0,0,0,0.1);
  transform: translateY(100%);
  transition: transform 0.3s ease-out;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  
  &.visible {
    transform: translateY(0%);
  }
`;

const ModalHeader = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  font-family: var(--font-headers);
  font-size: 1.2rem;
  color: var(--text-headers);
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.8rem;
  color: var(--placeholder-color);
  cursor: pointer;
  line-height: 1;
`;

const ModalBody = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex-grow: 1;
`;

interface ModalProps {
  id: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ id, title, isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Create function to handle click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    // Create function to handle escape key
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    // Add event listeners when modal is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }
    
    // Clean up event listeners
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);
  
  // Use createPortal to render the modal at the end of the document body
  return createPortal(
    <>
      <ModalOverlay 
        className={isOpen ? 'visible' : ''} 
        onClick={onClose}
      />
      <ModalContainer 
        ref={modalRef}
        id={id} 
        className={isOpen ? 'visible' : ''}
      >
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <ModalBody>
          {children}
        </ModalBody>
      </ModalContainer>
    </>,
    document.body
  );
};

export default Modal; 