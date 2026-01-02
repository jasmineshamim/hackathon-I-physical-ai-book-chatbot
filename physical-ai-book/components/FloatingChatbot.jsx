import { useState, useRef, useEffect } from 'react';
import { Send, X, Loader2, Brain, Cpu, Copy, Check, MessageSquare, Sparkles } from 'lucide-react';

// CSS Module styles defined inline for artifact
const styles = {
  container: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 50,
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  floatingButton: {
    position: 'relative',
    width: '64px',
    height: '64px',
    background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 50%, #ec4899 100%)',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
  },
  floatingButtonHover: {
    transform: 'scale(1.1)',
    boxShadow: '0 0 40px rgba(168, 85, 247, 0.5)'
  },
  iconWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  statusBadge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    width: '20px',
    height: '20px',
    background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
    borderRadius: '50%',
    border: '2px solid white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
  },
  chatWindow: {
    display: 'flex',
    flexDirection: 'column',
    width: '420px',
    height: '650px',
    background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    borderRadius: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    overflow: 'hidden',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    animation: 'slideInFromBottom 0.3s ease-out'
  },
  header: {
    position: 'relative',
    background: 'linear-gradient(90deg, #4f46e5 0%, #9333ea 50%, #ec4899 100%)',
    padding: '24px',
    color: 'white',
    overflow: 'hidden'
  },
  headerPattern: {
    position: 'absolute',
    inset: 0,
    opacity: 0.2,
    pointerEvents: 'none'
  },
  headerContent: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  avatarContainer: {
    position: 'relative'
  },
  avatar: {
    width: '56px',
    height: '56px',
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
  },
  avatarBadge: {
    position: 'absolute',
    bottom: '-4px',
    right: '-4px',
    width: '20px',
    height: '20px',
    background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
    borderRadius: '50%',
    border: '2px solid #0f172a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
  },
  headerText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  headerTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: 0
  },
  headerStatus: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.9)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  closeButton: {
    width: '36px',
    height: '36px',
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
    color: 'white'
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)'
  },
  messageWrapper: {
    display: 'flex',
    animation: 'slideInFromBottom 0.2s ease-out'
  },
  messageWrapperUser: {
    justifyContent: 'flex-end'
  },
  messageWrapperBot: {
    justifyContent: 'flex-start'
  },
  message: {
    maxWidth: '80%',
    borderRadius: '16px',
    padding: '12px 16px',
    position: 'relative'
  },
  userMessage: {
    background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)',
    color: 'white',
    borderBottomRightRadius: '4px',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
  },
  botMessage: {
    background: 'rgba(51, 65, 85, 0.8)',
    color: 'rgb(226, 232, 240)',
    border: '1px solid rgba(168, 85, 247, 0.2)',
    borderBottomLeftRadius: '4px',
    backdropFilter: 'blur(10px)'
  },
  errorMessage: {
    background: 'rgba(239, 68, 68, 0.2)',
    color: 'rgb(252, 165, 165)',
    border: '1px solid rgba(239, 68, 68, 0.5)',
    borderBottomLeftRadius: '4px'
  },
  botMessageHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
    paddingBottom: '8px',
    borderBottom: '1px solid rgba(168, 85, 247, 0.2)'
  },
  botLabel: {
    fontSize: '12px',
    color: 'rgb(167, 139, 250)',
    fontWeight: '600'
  },
  messageText: {
    fontSize: '14px',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    margin: 0
  },
  messageFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '8px',
    gap: '8px'
  },
  messageTimestamp: {
    fontSize: '11px',
    opacity: 0.7
  },
  copyButton: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: '6px',
    padding: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    color: 'inherit'
  },
  loadingMessage: {
    display: 'flex',
    justifyContent: 'flex-start'
  },
  loadingContent: {
    background: 'rgba(51, 65, 85, 0.8)',
    color: 'rgb(226, 232, 240)',
    border: '1px solid rgba(168, 85, 247, 0.2)',
    borderRadius: '16px',
    borderBottomLeftRadius: '4px',
    padding: '12px 16px',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  loadingText: {
    fontSize: '14px',
    color: 'rgb(203, 213, 225)'
  },
  inputContainer: {
    padding: '16px',
    background: 'rgba(15, 23, 42, 0.8)',
    borderTop: '1px solid rgba(168, 85, 247, 0.2)',
    backdropFilter: 'blur(10px)'
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px'
  },
  textareaWrapper: {
    flex: 1,
    position: 'relative'
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(51, 65, 85, 0.8)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    color: 'white',
    borderRadius: '12px',
    fontSize: '14px',
    resize: 'none',
    minHeight: '44px',
    maxHeight: '128px',
    outline: 'none',
    transition: 'all 0.2s',
    fontFamily: 'inherit'
  },
  textareaDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  sendButton: {
    width: '44px',
    height: '44px',
    background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    color: 'white',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
    border: '1px solid rgba(147, 51, 234, 0.3)'
  },
  sendButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  }
};

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI assistant for Physical AI. How can I help you today?", sender: 'bot' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const copyToClipboard = async (text, messageId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleSubmit = async () => {
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
        body: JSON.stringify({ question: inputValue }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();

      const botMessage = {
        id: Date.now() + 1,
        text: data.response || 'No response received',
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'An error occurred');

      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, there was an error processing your request. Please try again.',
        sender: 'bot',
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes slideInFromBottom {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>

      {/* Floating Icon Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          onMouseEnter={() => setIsHoveringButton(true)}
          onMouseLeave={() => setIsHoveringButton(false)}
          style={{
            ...styles.floatingButton,
            ...(isHoveringButton ? styles.floatingButtonHover : {})
          }}
          title="Open AI Assistant"
        >
          <div style={styles.iconWrapper}>
            <MessageSquare color="white" size={32} />
          </div>
          <div style={styles.statusBadge}>
            <Sparkles color="white" size={12} />
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={styles.chatWindow}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerPattern}>
              <svg width="100%" height="100%" opacity="0.2">
                <pattern id="circuit" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="1" fill="white"/>
                  <circle cx="30" cy="30" r="1" fill="white"/>
                  <path d="M10 10 L30 10 L30 30" stroke="white" strokeWidth="0.5" fill="none"/>
                </pattern>
                <rect width="100%" height="100%" fill="url(#circuit)"/>
              </svg>
            </div>

            <div style={styles.headerContent}>
              <div style={styles.headerLeft}>
                <div style={styles.avatarContainer}>
                  <div style={styles.avatar}>
                    <Brain color="white" size={28} />
                  </div>
                  <div style={styles.avatarBadge}>
                    <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%' }} />
                  </div>
                </div>
                <div style={styles.headerText}>
                  <h3 style={styles.headerTitle}>
                    Physical AI Assistant
                    <Cpu color="white" size={20} style={{ animation: 'spin 4s linear infinite' }} />
                  </h3>
                  <p style={styles.headerStatus}>
                    <span style={{ position: 'relative', display: 'flex', height: '8px', width: '8px' }}>
                      <span style={{
                        position: 'absolute',
                        display: 'inline-flex',
                        height: '100%',
                        width: '100%',
                        borderRadius: '50%',
                        background: '#34d399',
                        opacity: 0.75,
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                      }} />
                      <span style={{
                        position: 'relative',
                        display: 'inline-flex',
                        borderRadius: '50%',
                        height: '8px',
                        width: '8px',
                        background: '#10b981'
                      }} />
                    </span>
                    Neural network active
                  </p>
                </div>
              </div>
              <button
                onClick={toggleChat}
                style={styles.closeButton}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={styles.messagesContainer}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  ...styles.messageWrapper,
                  ...(msg.sender === 'user' ? styles.messageWrapperUser : styles.messageWrapperBot)
                }}
              >
                <div style={{
                  ...styles.message,
                  ...(msg.sender === 'user' ? styles.userMessage : (msg.isError ? styles.errorMessage : styles.botMessage))
                }}>
                  {msg.sender === 'bot' && !msg.isError && (
                    <div style={styles.botMessageHeader}>
                      <Brain size={16} color="#a78bfa" />
                      <span style={styles.botLabel}>AI Response</span>
                    </div>
                  )}
                  <p style={styles.messageText}>{msg.text}</p>
                  <div style={styles.messageFooter}>
                    <span style={styles.messageTimestamp}>
                      {new Date(msg.id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {msg.sender === 'bot' && !msg.isError && (
                      <button
                        onClick={() => copyToClipboard(msg.text, msg.id)}
                        style={styles.copyButton}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                        title="Copy message"
                      >
                        {copiedMessageId === msg.id ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div style={styles.loadingMessage}>
                <div style={styles.loadingContent}>
                  <Loader2 size={20} color="#a78bfa" style={{ animation: 'spin 1s linear infinite' }} />
                  <span style={styles.loadingText}>Processing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={styles.inputContainer}>
            <div style={styles.inputWrapper}>
              <div style={styles.textareaWrapper}>
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  rows="1"
                  style={{
                    ...styles.textarea,
                    ...(isLoading ? styles.textareaDisabled : {})
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.5)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(168, 85, 247, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                  }}
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={isLoading || !inputValue.trim()}
                style={{
                  ...styles.sendButton,
                  ...((isLoading || !inputValue.trim()) ? styles.sendButtonDisabled : {})
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && inputValue.trim()) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(79, 70, 229, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.3)';
                }}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingChatbot;