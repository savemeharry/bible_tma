# Bible Study App for Telegram Mini Apps

This is a Bible Study application built specifically for Telegram Mini Apps. The app provides a rich interface for reading, studying, and engaging with biblical texts.

## Features

- Bible text navigation by book, chapter, and verse
- Multiple translations support
- Bookmarking and note-taking
- Text sharing
- Dark/light theme support
- Linguistic analysis (original language word studies)
- Full integration with Telegram Mini Apps SDK

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd bible-tma
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Building for Production

To create a production-ready build:

```bash
npm run build
```

This will generate optimized static files in the `build` directory.

## Deployment

### Deploying to Netlify

This app is configured for easy deployment on Netlify. The `netlify.toml` file contains the necessary configuration.

1. Push your code to a git repository (GitHub, GitLab, or Bitbucket)
2. Connect Netlify to your repository
3. Netlify will automatically detect the build settings from the toml file

### Deploying to Telegram Mini Apps

1. Create your bot with BotFather on Telegram
2. Use the `/newapp` command to create a new mini app
3. Provide the URL of your deployed application
4. Configure the app settings as needed

## Technical Implementation

### Telegram Web App SDK Integration

The app uses the official Telegram Web App SDK to integrate with Telegram's features:

- Automatic theme adaptation
- Native share functionality
- Popup notifications
- Main button integration

### Modal System

The app implements a custom modal system that mimics browser-native popups while maintaining a consistent look and feel with the Telegram interface.

## License

[MIT License](LICENSE)

## Acknowledgements

- [Telegram Mini Apps Documentation](https://core.telegram.org/bots/webapps)
- [React](https://reactjs.org/)
- [Styled Components](https://styled-components.com/)
# bible_tma
