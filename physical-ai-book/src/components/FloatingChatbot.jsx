import { useState, useRef, useEffect } from 'react';
import styles from './FloatingChatbot.module.css';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! I\'m your AI assistant for Physical AI. How can I help you today?', sender: 'bot' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const messagesEndRef = useRef(null);

  // Toggle chat window open/close
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Copy message text to clipboard
  const copyToClipboard = async (text, messageId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Add user message to chat
    const userMessage = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://hackathon-i-physical-ai-book-chatbot-production.up.railway.app/api/query", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: inputValue }), // Using 'question' as specified in requirements
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();

      // Add bot response to chat
      const botMessage = {
        id: Date.now() + 1,
        text: data.response || 'No response received',
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'An error occurred while sending the message');

      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, there was an error processing your request. Please try again.',
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <>
      {/* Floating chat icon */}
      <div className={styles.chatIcon} onClick={toggleChat} title="Open AI Assistant">
        <div className={styles.iconWrapper}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="aiGradSrc" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.75" />
              </linearGradient>
              <filter id="glowSrc">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <circle cx="12" cy="12" r="9" stroke="url(#aiGradSrc)" strokeWidth="1.5" fill="none" opacity="0.6"/>
            <circle cx="12" cy="12" r="6" stroke="url(#aiGradSrc)" strokeWidth="1.2" fill="none" opacity="0.8"/>
            <path d="M12 8 L12 12 L15 12" stroke="url(#aiGradSrc)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#glowSrc)"/>
            <circle cx="12" cy="12" r="2" fill="url(#aiGradSrc)" filter="url(#glowSrc)"/>
            <path d="M12 4 L12 2 M12 22 L12 20 M20 12 L22 12 M2 12 L4 12" stroke="url(#aiGradSrc)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
            <path d="M17.5 6.5 L19 5 M5 19 L6.5 17.5 M17.5 17.5 L19 19 M5 5 L6.5 6.5" stroke="url(#aiGradSrc)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
          </svg>
        </div>
      </div>

      {/* Chat window - only render when open */}
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <div className={styles.headerContent}>
              <div className={styles.headerIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="8" stroke="white" strokeWidth="1.5" fill="none" opacity="0.6"/>
                  <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="1.2" fill="none" opacity="0.9"/>
                  <circle cx="12" cy="12" r="2" fill="white"/>
                  <path d="M12 4 L12 2 M12 22 L12 20 M20 12 L22 12 M2 12 L4 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
                </svg>
              </div>
              <div className={styles.headerText}>
                <h3>AI Assistant</h3>
                <span className={styles.statusIndicator}>Ready to assist</span>
              </div>
            </div>
            <button onClick={toggleChat} className={styles.closeButton} aria-label="Close chat">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className={styles.chatMessages}>
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`${styles.message} ${msg.sender === 'user' ? styles.userMessage : styles.botMessage}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.messageText}>{msg.text}</div>
                {msg.sender === 'bot' && (
                  <div className={styles.messageActions}>
                    <button
                      className={styles.copyButton}
                      onClick={() => copyToClipboard(msg.text, msg.id)}
                      title="Copy message"
                    >
                      {copiedMessageId === msg.id ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16 12H12M12 12H8M12 12V8M12 12V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <rect x="6" y="6" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      )}
                    </button>
                  </div>
                )}
                <div className={styles.messageTimestamp}>
                  {new Date(msg.id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className={`${styles.message} ${styles.botMessage} ${styles.typingContainer}`}>
                <div className={styles.messageText}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className={`${styles.message} ${styles.errorMessage}`}>
                <div className={styles.messageText}>
                  <div className={styles.errorIcon}>⚠️</div>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className={styles.inputForm}>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              className={styles.inputField}
              disabled={isLoading}
              rows="1"
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
            />
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading || !inputValue.trim()}
              aria-label="Send message"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;