import React from 'react';
import Chatbot from './chatbot';

const BookPage = () => {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '1000px', 
      margin: '0 auto',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%) !important', // Added !important
      minHeight: '100vh',
      borderRadius: '10px'
    }}>
      <h1 style={{ color: '#1e293b', textAlign: 'center', fontSize: '2.25rem', marginBottom: '20px' }}>Physical AI Book</h1>
      <p style={{ fontSize: '18px', color: '#64748b', textAlign: 'center', marginBottom: '40px' }}>
        Welcome to the official page for the Physical AI Book.
      </p>
      {/* Other page content */}

      {/* RAG Chatbot Component */}
      <Chatbot bookId="physical-ai-book" />
    </div>
  );
};

export default BookPage;