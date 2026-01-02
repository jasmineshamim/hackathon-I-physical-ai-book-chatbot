import React from 'react';
import Chatbot from './chatbot';

const BookDetailPage = () => {
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
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#1e293b', fontSize: '2.25rem' }}>Physical AI: A New Paradigm</h1>
        <p style={{ fontSize: '18px', color: '#64748b' }}>Exploring the intersection of artificial intelligence and physical reality</p>
      </header>

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
          <h2 style={{ color: '#1e293b', fontSize: '1.75rem' }}>About the Book</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#334155', marginBottom: '15px' }}>
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
              <h3 style={{ color: '#1e293b', fontSize: '1.25rem' }}>Key Topics</h3>
              <ul style={{ paddingLeft: '20px' }}>
                <li style={{ marginBottom: '8px', color: '#475569' }}>Embodied Cognition in AI Systems</li>
                <li style={{ marginBottom: '8px', color: '#475569' }}>Physics-Informed Neural Networks</li>
                <li style={{ marginBottom: '8px', color: '#475569' }}>Real-World Learning Algorithms</li>
                <li style={{ marginBottom: '8px', color: '#475569' }}>Robotics and Manipulation</li>
                <li style={{ marginBottom: '8px', color: '#475569' }}>Simulation-to-Reality Transfer</li>
              </ul>
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ color: '#1e293b', fontSize: '1.25rem' }}>Target Audience</h3>
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

      <div style={{ marginTop: '40px' }}>
        <h2 style={{ color: '#1e293b', fontSize: '1.75rem', marginBottom: '15px' }}>Table of Contents</h2>
        <ol style={{ paddingLeft: '20px', color: '#334155' }}>
          <li style={{ marginBottom: '8px' }}>Introduction to Physical AI</li>
          <li style={{ marginBottom: '8px' }}>Embodied Cognition and AI</li>
          <li style={{ marginBottom: '8px' }}>Physics-Informed Machine Learning</li>
          <li style={{ marginBottom: '8px' }}>Real-World Learning Algorithms</li>
          <li style={{ marginBottom: '8px' }}>Robotics and Manipulation</li>
          <li style={{ marginBottom: '8px' }}>Simulation and Reality Transfer</li>
          <li style={{ marginBottom: '8px' }}>Applications in Healthcare</li>
          <li style={{ marginBottom: '8px' }}>Industrial Applications</li>
          <li style={{ marginBottom: '8px' }}>Future Directions</li>
          <li style={{ marginBottom: '8px' }}>Conclusion</li>
        </ol>
      </div>

      {/* RAG Chatbot Component */}
      <Chatbot bookId="physical-ai-book" />
    </div>
  );
};

export default BookDetailPage;