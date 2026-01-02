import Head from 'next/head';
import Link from 'next/link';
import Chatbot from './chatbot';

export default function Home() {
  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%) !important', // Added !important
      minHeight: '100vh',
      padding: '20px'
    }}>
      <Head>
        <title>Book Reader App</title>
        <meta name="description" content="Read books with AI assistance" />
      </Head>

      <main style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#1e293b', fontSize: '2.5rem', marginBottom: '20px' }}>Welcome to the Book Reader</h1>
        <p style={{ fontSize: '1.25rem', color: '#64748b', marginBottom: '30px' }}>Choose a book to read with AI assistance:</p>

        <nav>
          <Link href="/book">
            <a style={{
              display: 'inline-block',
              padding: '15px 30px',
              backgroundColor: '#4f46e5',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '1.125rem',
              transition: 'all 0.2s ease'
            }}>Read Constitution</a>
          </Link>
        </nav>
      </main>

      {/* RAG Chatbot Component - Available on all pages */}
      <Chatbot bookId="constitution" />
    </div>
  );
}