import React from 'react';
import Chatbot from './chatbot';

const App = () => {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%) !important', // Added !important
      minHeight: '100vh'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#1e293b', fontSize: '2.5rem' }}>Physical AI Book Platform</h1>
        <p style={{ fontSize: '1.25rem', color: '#64748b' }}>Discover the future of artificial intelligence through our innovative publications</p>
      </header>

      <main>
        <section style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ color: '#1e293b', fontSize: '1.875rem', marginBottom: '15px' }}>Featured Book: Physical AI</h2>
          <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#334155', marginBottom: '20px' }}>
            Explore the revolutionary approach to artificial intelligence that bridges the gap between
            digital computation and physical reality. This book explores how AI systems can interact with
            and learn from the physical world in ways that were previously impossible.
          </p>

          <div style={{ margin: '30px 0' }}>
            <h3 style={{ color: '#1e293b', fontSize: '1.5rem', marginBottom: '15px' }}>Key Features of Physical AI:</h3>
            <ul style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '10px', color: '#475569' }}>Embodied Cognition in AI Systems</li>
              <li style={{ marginBottom: '10px', color: '#475569' }}>Physics-Informed Neural Networks</li>
              <li style={{ marginBottom: '10px', color: '#475569' }}>Real-World Learning Algorithms</li>
              <li style={{ marginBottom: '10px', color: '#475569' }}>Robotics and Manipulation</li>
              <li style={{ marginBottom: '10px', color: '#475569' }}>Simulation-to-Reality Transfer</li>
            </ul>
          </div>
        </section>

        <section style={{ maxWidth: '800px', margin: '40px auto', textAlign: 'center' }}>
          <h2 style={{ color: '#1e293b', fontSize: '1.875rem', marginBottom: '15px' }}>About This Platform</h2>
          <p style={{ fontSize: '16px', color: '#334155', marginBottom: '15px' }}>
            Our platform provides an interactive way to explore our publications. Use the chatbot to ask
            questions about our books, their content, and how they can benefit your research or projects.
          </p>
          <p style={{ fontSize: '16px', color: '#334155' }}>
            The RAG (Retrieval-Augmented Generation) chatbot is connected to our book database and can
            provide detailed information based on the book's content.
          </p>
        </section>
      </main>

      {/* RAG Chatbot Component */}
      <Chatbot bookId="physical-ai-book" />
    </div>
  );
};

export default App;