# Modern Chatbot UI

This is a modern, production-ready Chatbot UI for a RAG-based assistant built with React and Tailwind CSS.

## Folder Structure

```
backend/
├── ModernChatbot.jsx        # Main chatbot component
├── Message.jsx              # Message component
└── TypingIndicator.jsx      # Typing indicator component
```

## Features

- **Responsive Design**: Works on mobile, tablet, and desktop
- **Conversation History**: Toggleable panel for previous conversations
- **Sources Display**: Shows sources used in bot responses
- **Clear Chat**: With confirmation modal
- **Error Handling**: Friendly error messages with retry option
- **Accessibility**: Full keyboard navigation and ARIA attributes
- **Animations**: Smooth transitions and loading states
- **Modern UI**: Clean, professional design with consistent spacing

## Components

### ModernChatbot.jsx
The main chatbot component that includes:
- Header with title and controls
- Conversation history panel
- Messages display area
- Input area with send button
- Clear chat confirmation modal

### Message.jsx
Handles the display of individual messages with:
- Different styling for user vs bot messages
- Sources section for bot responses
- Error state handling

### TypingIndicator.jsx
Shows animated typing indicators when the bot is "thinking"

## Usage

```jsx
import ModernChatbot from './backend/ModernChatbot';

function App() {
  return (
    <div className="App">
      <ModernChatbot position="bottom-right" />
    </div>
  );
}
```

## Position Options

The chatbot can be positioned in different corners:
- `bottom-right` (default)
- `bottom-left`
- `top-right`
- `top-left`

## Design Principles

- **Consistent Branding**: Uses the same color palette as the existing homepage
- **Minimal Design**: Clean, professional interface
- **User-Focused**: Intuitive conversation flow
- **Performance**: Optimized for smooth interactions
- **Accessibility**: Full keyboard navigation and screen reader support