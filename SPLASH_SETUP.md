# Splash Screen Setup

## Overview
This document explains how to implement the splash screen animation that appears when the app starts. The animation sequentially displays the cross, "THE", "BIBLE", and "Telegram Edition" elements with a smooth fade-in effect.

## Installation Steps

1. **Place the images in the assets folder**
   - Copy all the provided image files to the `public/assets/` directory:
     - `Cross.png`: The cross icon
     - `the_word.png`: "THE" text
     - `Bible_word.png`: "BIBLE" text
     - `TelegramEdition_word.png`: "Telegram Edition" text

2. **Verify Component Files**
   - Make sure the `SplashScreen.tsx` component exists in the `src/components/` directory
   - Ensure the App.tsx has been updated to include the splash screen logic

3. **Customizing the Animation**
   - You can adjust animation timing in the `SplashScreen.tsx` file by modifying the setTimeout values:
     ```jsx
     const crossTimer = setTimeout(() => setShowCross(true), 300);
     const theTimer = setTimeout(() => setShowThe(true), 1100);
     const bibleTimer = setTimeout(() => setShowBible(true), 1600);
     const telegramTimer = setTimeout(() => setShowTelegramEdition(true), 2100);
     
     // Complete animation and call onFinish
     const finishTimer = setTimeout(() => {
       onFinish();
     }, 3500);
     ```

   - To adjust element sizes, modify the width values in the styled components:
     ```jsx
     const CrossImg = styled.img<{ visible: boolean }>`
       width: 120px;
       // ... other styles
     `;
     ```

## Troubleshooting

If images aren't appearing:
1. Check that the images are correctly placed in `public/assets/`
2. Verify file names match exactly, including case sensitivity
3. Check browser console for any errors
4. Ensure the paths are correct in the SplashScreen component 