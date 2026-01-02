import React, { useState } from 'react';

const BookPage = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = { text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userMessage.text,
          book_id: "physical-ai-book"  // Fixed book_id parameter
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      // Assuming the backend returns a response in a 'response' field
      // Adjust this based on your actual backend response structure
      const botResponse = data.response || data.answer || data.result || 'No response from backend';
      const botMessage = { text: botResponse, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = { text: `Error: ${error.message || 'Could not get response from the server.'}`, sender: 'bot' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      position: 'relative',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%) !important', // Force gradient with !important
      minHeight: '100vh',
      borderRadius: '10px'
    }}>
      <div style={{ marginBottom: '80px', padding: '20px', borderRadius: '10px' }}>
        <h1 style={{ 
          textAlign: 'center', 
          color: '#1e293b', 
          fontSize: '2.5em', 
          marginBottom: '30px' 
        }}>
          Physical AI: A New Paradigm
        </h1>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
          <div style={{ flex: '0 0 250px' }}>
            <div style={{
              width: '100%',
              height: '350px',
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              color: '#64748b',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
            }}>
              Book Cover
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ color: '#1e293b', fontSize: '1.75rem', marginBottom: '15px' }}>About the Book</h2>
            <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#334155', marginBottom: '20px' }}>
              Physical AI represents a revolutionary approach to artificial intelligence that bridges the gap between
              digital computation and physical reality. This book explores how AI systems can interact with and learn
              from the physical world in ways that were previously impossible.
            </p>
            <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#334155', marginBottom: '20px' }}>
              Through detailed examples and case studies, readers will discover how Physical AI is transforming robotics,
              manufacturing, healthcare, and other industries where physical interaction is crucial.
            </p>
            <div style={{ display: 'flex', gap: '30px', marginTop: '20px' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: '#1e293b', fontSize: '1.25rem', marginBottom: '10px' }}>Key Topics</h3>
                <ul style={{ paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '8px', color: '#475569' }}>Embodied Cognition in AI Systems</li>
                  <li style={{ marginBottom: '8px', color: '#475569' }}>Physics-Informed Neural Networks</li>
                  <li style={{ marginBottom: '8px', color: '#475569' }}>Real-World Learning Algorithms</li>
                  <li style={{ marginBottom: '8px', color: '#475569' }}>Robotics and Manipulation</li>
                  <li style={{ marginBottom: '8px', color: '#475569' }}>Simulation-to-Reality Transfer</li>
                </ul>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: '#1e293b', fontSize: '1.25rem', marginBottom: '10px' }}>Target Audience</h3>
                <ul style={{ paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '8px', color: '#475569' }}>AI Researchers</li>
                  <li style={{ marginBottom: '8px', color: '#475569' }}>Robotics Engineers</li>
                  <li style={{ marginBottom: '8px', color: '#475569' }}>Computer Scientists</li>
                  <li style={{ marginBottom: '8px', color: '#475569' }}>Industry Professionals</li>
                  <li style={{ marginBottom: '8px', color: '#475569' }}>Graduate Students</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {chatOpen ? (
        <div style={{ 
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          width: '350px',
          height: '500px',
          border: '1px solid #cbd5e1',
          borderRadius: '12px',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
        }}>
          <div style={{ 
            padding: '15px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
            color: 'white',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>Book Assistant</span>
            <button 
              onClick={toggleChat} 
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>
          <div style={{ 
            padding: '15px',
            overflowY: 'auto',
            flex: 1,
            backgroundColor: '#f8fafc'
          }}>
            {messages.map((msg, index) => (
              <div key={index} style={
                msg.sender === 'user' 
                  ? { 
                      padding: '10px',
                      background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
                      color: 'white',
                      borderRadius: '12px',
                      alignSelf: 'flex-end',
                      marginBottom: '10px',
                      maxWidth: '80%',
                      marginLeft: 'auto'
                    } 
                  : { 
                      padding: '10px',
                      backgroundColor: '#f1f5f9',
                      color: '#334155',
                      borderRadius: '12px',
                      alignSelf: 'flex-start',
                      marginBottom: '10px',
                      maxWidth: '80%'
                    }
              }>
                {msg.text}
              </div>
            ))}
            {isLoading && <div style={{ 
              padding: '10px',
              backgroundColor: '#f1f5f9',
              color: '#334155',
              borderRadius: '12px',
              alignSelf: 'flex-start',
              marginBottom: '10px',
              maxWidth: '80%'
            }}>Thinking...</div>}
          </div>
          <div style={{ 
            display: 'flex',
            padding: '10px',
            borderTop: '1px solid #cbd5e1',
            backgroundColor: 'white'
          }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about the book..."
              style={{ 
                flex: 1,
                padding: '10px',
                border: '1px solid #cbd5e1',
                borderRadius: '20px'
              }}
            />
            <button 
              onClick={sendMessage} 
              style={{
                marginLeft: '10px',
                padding: '10px 15px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer'
              }}
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={toggleChat} 
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
            color: 'white',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
          }}
        >
          💬
        </button>
      )}
    </div>
  );
};

const styles = {
  pageContainer: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    position: 'relative',
    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    minHeight: '100vh',
  },
  bookContainer: {
    marginBottom: '80px',
    padding: '20px',
    borderRadius: '10px',
  },
  title: {
    textAlign: 'center',
    color: '#1e293b',
    fontSize: '2.5em',
    marginBottom: '30px',
  },
  bookInfo: {
    display: 'flex',
    gap: '30px',
    alignItems: 'flex-start',
  },
  bookCover: {
    flex: '0 0 250px',
  },
  coverPlaceholder: {
    width: '100%',
    height: '350px',
    backgroundColor: '#f8fafc',
    border: '1px solid #cbd5e1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    color: '#64748b',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  },
  bookDetails: {
    flex: 1,
  },
  bookDetails h2: {
    color: '#1e293b',
    marginBottom: '15px',
    fontSize: '1.75rem',
  },
  bookDetails p: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#334155',
    marginBottom: '20px',
  },
  bookFeatures: {
    display: 'flex',
    gap: '30px',
    marginTop: '20px',
  },
  feature: {
    flex: 1,
  },
  feature h3: {
    color: '#1e293b',
    marginBottom: '10px',
    fontSize: '1.25rem',
  },
  feature ul: {
    paddingLeft: '20px',
  },
  feature li: {
    marginBottom: '8px',
    color: '#475569',
  },
  floatingButton: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
    color: 'white',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    zIndex: 1000,
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
  },
  chatContainer: {
    position: 'fixed',
    bottom: '80px',
    right: '20px',
    width: '350px',
    height: '500px',
    border: '1px solid #cbd5e1',
    borderRadius: '12px',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
  },
  chatHeader: {
    padding: '15px',
    background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
    color: 'white',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '20px',
    cursor: 'pointer',
  },
  messagesContainer: {
    padding: '15px',
    overflowY: 'auto',
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  userMessage: {
    padding: '10px',
    background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
    color: 'white',
    borderRadius: '12px',
    alignSelf: 'flex-end',
    marginBottom: '10px',
    maxWidth: '80%',
    marginLeft: 'auto',
  },
  botMessage: {
    padding: '10px',
    backgroundColor: '#f1f5f9',
    color: '#334155',
    borderRadius: '12px',
    alignSelf: 'flex-start',
    marginBottom: '10px',
    maxWidth: '80%',
  },
  inputContainer: {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #cbd5e1',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #cbd5e1',
    borderRadius: '20px',
  },
  sendButton: {
    marginLeft: '10px',
    padding: '10px 15px',
    background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
  },
};

export default BookPage;