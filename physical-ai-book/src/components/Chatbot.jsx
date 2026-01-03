import { useState, useRef, useEffect } from 'react';
import styles from './chatbot.module.css';

const Chatbot = ({ bookId = 'constitution' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

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
        body: JSON.stringify({
          question: inputValue,
          book_id: bookId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Handle different possible response formats from the backend
      let botResponse = 'No response from backend';

      // Check multiple possible field names for the response
      if (data && typeof data === 'object') {
        if (data.response) {
          botResponse = data.response;
        } else if (data.answer) {
          botResponse = data.answer;
        } else if (data.result) {
          botResponse = data.result;
        } else if (data.text) {
          botResponse = data.text;
        } else if (data.content) {
          botResponse = data.content;
        } else if (data.message) {
          botResponse = data.message;
        } else {
          // If none of the common fields exist, try to stringify the entire response
          botResponse = JSON.stringify(data);
        }
      } else if (typeof data === 'string') {
        // If the response is a string directly
        botResponse = data;
      }

      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot'
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Chatbot error:', err);
      setError(err.message);
      const errorMessage = {
        id: Date.now() + 1,
        text: `Error: ${err.message || 'Failed to get response from backend'}`,
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
      {/* Chatbot Icon */}
      <button
        className={styles.chatbotIcon}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open chatbot"
        title="Open AI Assistant"
      >
        <div className={styles.iconWrapper}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="aiGradBook2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.75" />
              </linearGradient>
              <filter id="glowBook2">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <circle cx="12" cy="12" r="9" stroke="url(#aiGradBook2)" strokeWidth="1.5" fill="none" opacity="0.6"/>
            <circle cx="12" cy="12" r="6" stroke="url(#aiGradBook2)" strokeWidth="1.2" fill="none" opacity="0.8"/>
            <path d="M12 8 L12 12 L15 12" stroke="url(#aiGradBook2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#glowBook2)"/>
            <circle cx="12" cy="12" r="2" fill="url(#aiGradBook2)" filter="url(#glowBook2)"/>
            <path d="M12 4 L12 2 M12 22 L12 20 M20 12 L22 12 M2 12 L4 12" stroke="url(#aiGradBook2)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
            <path d="M17.5 6.5 L19 5 M5 19 L6.5 17.5 M17.5 17.5 L19 19 M5 5 L6.5 6.5" stroke="url(#aiGradBook2)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
          </svg>
        </div>
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className={styles.chatbotWindow}>
          <div className={styles.chatbotHeader}>
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
                <h3>Book Assistant</h3>
                <span className={styles.statusIndicator}>Ready to assist</span>
              </div>
            </div>
            <button
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className={styles.chatbotMessages}>
            {messages.length === 0 ? (
              <div className={styles.welcomeMessage}>
                <div className={styles.welcomeIcon}>
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="welcomeGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="50%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                    <circle cx="12" cy="12" r="10" stroke="url(#welcomeGrad2)" strokeWidth="1.5" fill="none" opacity="0.5"/>
                    <circle cx="12" cy="12" r="7" stroke="url(#welcomeGrad2)" strokeWidth="1.2" fill="none" opacity="0.7"/>
                    <circle cx="12" cy="12" r="4" stroke="url(#welcomeGrad2)" strokeWidth="1" fill="none" opacity="0.9"/>
                    <circle cx="12" cy="12" r="2" fill="url(#welcomeGrad2)"/>
                    <path d="M12 2 L12 4 M12 20 L12 22 M22 12 L20 12 M4 12 L2 12" stroke="url(#welcomeGrad2)" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
                    <path d="M18.5 5.5 L17 7 M7 17 L5.5 18.5 M18.5 18.5 L17 17 M7 7 L5.5 5.5" stroke="url(#welcomeGrad2)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
                  </svg>
                </div>
                <h4>Ask me anything about this book!</h4>
                <p>I can help you understand concepts, find information, and answer questions.</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`${styles.message} ${message.sender === 'user' ? styles.userMessage : styles.botMessage}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={styles.messageText}>{message.text}</div>
                  <div className={styles.messageTimestamp}>
                    {new Date(message.id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
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
            <div ref={messagesEndRef} />
          </div>

          {error && (
            <div className={styles.errorMessage}>
              <div className={styles.errorIcon}>⚠️</div>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.chatbotInputForm}>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question..."
              className={styles.chatbotInput}
              disabled={isLoading}
              rows="1"
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
            />
            <button
              type="submit"
              className={styles.sendButton}
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

export default Chatbot;