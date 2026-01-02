import React from 'react';
import Layout from '@theme/Layout';
import GlobalChatbot from './Chatbot/GlobalChatbot';

const PhysicalAIBookLayout = ({ children, ...props }) => {
  return (
    <>
      <Layout {...props}>
        {children}
      </Layout>
      <GlobalChatbot />
    </>
  );
};

export default PhysicalAIBookLayout;