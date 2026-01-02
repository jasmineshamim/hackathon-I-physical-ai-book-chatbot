import React from 'react';
import Layout from '@theme/Layout';

const PhysicalAIBookPage = () => {
  return (
    <Layout
      title="Physical AI Book"
      description="Physical AI Book with integrated RAG chatbot">
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Hackathon I - Physical AI Book</h1>

        <p>
          Welcome to the Physical AI Book project. This page integrates a RAG chatbot
          that can answer questions related to physical AI concepts.
        </p>

        <div style={{ marginTop: '30px' }}>
          <h2>About Physical AI</h2>
          <p>
            Physical AI represents the convergence of artificial intelligence with physical systems,
            particularly in the context of robotics and embodied intelligence. This field explores how
            AI agents can interact with and learn from the physical world, creating more capable and
            adaptive robotic systems.
          </p>

          <p>
            The RAG (Retrieval-Augmented Generation) chatbot on this page can help answer questions
            about physical AI concepts, robotics, and related technologies. Look for the chat icon
            in the bottom-right corner of your screen to start a conversation.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default PhysicalAIBookPage;