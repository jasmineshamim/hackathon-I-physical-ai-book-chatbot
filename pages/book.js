import { useState, useEffect } from 'react';
import Head from 'next/head';
import Chatbot from './chatbot';

const BookPage = () => {
  const [bookContent, setBookContent] = useState('');
  const [bookTitle, setBookTitle] = useState('');

  // This is a placeholder - replace with your actual book loading logic
  useEffect(() => {
    // Example: Load book content (replace with your actual implementation)
    setBookTitle('Constitution');
    setBookContent(`
      [Constitution content would go here]

      This is where the content of the book would be displayed.
      The RAG chatbot is now available in the bottom right corner.
    `);
  }, []);

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%) !important', // Added !important
      minHeight: '100vh',
      padding: '20px'
    }}>
      <Head>
        <title>{bookTitle} - Book Reader</title>
        <meta name="description" content={`Read ${bookTitle}`} />
      </Head>

      <main style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
      }}>
        <header>
          <h1 style={{ color: '#1e293b', textAlign: 'center', marginBottom: '20px' }}>{bookTitle}</h1>
        </header>

        <article>
          <pre style={{ 
            whiteSpace: 'pre-wrap', 
            fontFamily: 'serif', 
            fontSize: '16px', 
            lineHeight: '1.6',
            color: '#334155',
            padding: '20px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            overflowX: 'auto'
          }}>
            {bookContent}
          </pre>
        </article>
      </main>

      {/* RAG Chatbot Component */}
      <Chatbot bookId="constitution" />
    </div>
  );
};

export default BookPage;