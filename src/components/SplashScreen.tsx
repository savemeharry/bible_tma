import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

// Используем пути к изображениям в публичной директории
const CrossImg = process.env.PUBLIC_URL + '/images/Cross.png';
const TheWordImg = process.env.PUBLIC_URL + '/images/the_word.png';  
const BibleWordImg = process.env.PUBLIC_URL + '/images/Bible_word.png';
const TelegramEditionImg = process.env.PUBLIC_URL + '/images/TelegramEdition_word.png';

interface SplashScreenProps {
  onFinish: () => void;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const SplashContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Cross = styled.img<{ visible: boolean }>`
  width: 120px;
  height: auto;
  margin-bottom: 50px;
  opacity: ${props => (props.visible ? 1 : 0)};
  animation: ${props => (props.visible ? fadeIn : 'none')} 0.8s ease-out forwards;
`;

const TheWord = styled.img<{ visible: boolean }>`
  width: 70px;
  height: auto;
  margin-bottom: 10px;
  opacity: ${props => (props.visible ? 1 : 0)};
  animation: ${props => (props.visible ? fadeIn : 'none')} 0.8s ease-out forwards;
`;

const BibleWord = styled.img<{ visible: boolean }>`
  width: 160px;
  height: auto;
  margin-bottom: 30px;
  opacity: ${props => (props.visible ? 1 : 0)};
  animation: ${props => (props.visible ? fadeIn : 'none')} 0.8s ease-out forwards;
`;

const TelegramEdition = styled.img<{ visible: boolean }>`
  width: 140px;
  height: auto;
  opacity: ${props => (props.visible ? 1 : 0)};
  animation: ${props => (props.visible ? fadeIn : 'none')} 0.8s ease-out forwards;
`;

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [showCross, setShowCross] = useState(false);
  const [showThe, setShowThe] = useState(false);
  const [showBible, setShowBible] = useState(false);
  const [showTelegramEdition, setShowTelegramEdition] = useState(false);

  useEffect(() => {
    // Sequence animation timings
    const crossTimer = setTimeout(() => setShowCross(true), 300);
    const theTimer = setTimeout(() => setShowThe(true), 1100);
    const bibleTimer = setTimeout(() => setShowBible(true), 1600);
    const telegramTimer = setTimeout(() => setShowTelegramEdition(true), 2100);
    
    // Complete animation and call onFinish
    const finishTimer = setTimeout(() => {
      onFinish();
    }, 3500);

    // Cleanup timers
    return () => {
      clearTimeout(crossTimer);
      clearTimeout(theTimer);
      clearTimeout(bibleTimer);
      clearTimeout(telegramTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <SplashContainer>
      <ImageContainer>
        <Cross 
          src={CrossImg}
          alt="Cross"
          visible={showCross}
        />
        
        <TheWord 
          src={TheWordImg}
          alt="THE"
          visible={showThe}
        />
        
        <BibleWord 
          src={BibleWordImg}
          alt="BIBLE"
          visible={showBible}
        />
        
        <TelegramEdition 
          src={TelegramEditionImg}
          alt="Telegram Edition"
          visible={showTelegramEdition}
        />
      </ImageContainer>
    </SplashContainer>
  );
};

export default SplashScreen; 