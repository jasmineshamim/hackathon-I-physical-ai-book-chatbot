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
      const response = await fetch('http://127.0.0.1:8000/api/query', {
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

  return (
    <>
      {/* Chatbot Icon */}
      <button
        className={styles.chatbotIcon}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open chatbot"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V7C1.9 7 1 7.9 1 9V11.81C1.61 11.41 2.28 11.15 3 11.15C4.66 11.15 6 12.5 6 14.17C6 15.85 4.66 17.19 3 17.19C2.28 16.92 1.61 16.66 1 16.26V19.5C1 20.6 1.9 21.5 3 21.5H4.04C4.24 22.23 4.92 22.75 5.7 22.75C6.48 22.75 7.16 22.23 7.36 21.5H16.64C16.84 22.23 17.52 22.75 18.3 22.75C19.08 22.75 19.76 22.23 19.96 21.5H21C22.1 21.5 23 20.6 23 19.5V9C23 7.9 22.1 7 21 7V9ZM5 15C5 14.45 4.55 14 4 14S3 14.45 3 15 3.45 16 4 16 5 15.55 5 15ZM5 18.5C4.17 18.5 3.5 17.83 3.5 17C3.5 16.17 4.17 15.5 5 15.5S6.5 16.17 6.5 17 5.83 18.5 5 18.5ZM19 17.5H17V19.5H19V17.5ZM19 15.5H17V17.5H19V15.5ZM16 15.5H14V17.5H16V15.5ZM16 13.5H14V15.5H16V13.5ZM19 13.5H17V15.5H19V13.5Z" fill="currentColor"/>
        </svg>
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className={styles.chatbotWindow}>
          <div className={styles.chatbotHeader}>
            <h3>RAG Chatbot</h3>
            <button
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              ×
            </button>
          </div>

          <div className={styles.chatbotMessages}>
            {messages.length === 0 ? (
              <div className={styles.welcomeMessage}>
                Ask me anything about this book!
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`${styles.message} ${message.sender === 'user' ? styles.userMessage : styles.botMessage}`}
                >
                  <div className={styles.messageText}>{message.text}</div>
                </div>
              ))
            )}
            {isLoading && (
              <div className={styles.message + ' ' + styles.botMessage}>
                <div className={styles.messageText}>
                  <span className={styles.typingIndicator}>
                    RAG Chatbot is analyzing
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {error && (
            <div className={styles.errorMessage}>
              Connection error: {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.chatbotInputForm}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your question..."
              className={styles.chatbotInput}
              disabled={isLoading}
            />
            <button
              type="submit"
              className={styles.sendButton}
              disabled={isLoading || !inputValue.trim()}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;