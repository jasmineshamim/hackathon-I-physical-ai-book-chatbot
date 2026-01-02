import React, { useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import FloatingChatbot from '../components/FloatingChatbot';

const PageSpecificChatbot = () => {
  const location = useLocation();

  // For baseUrl '/hackathon-I-physical-ai-book/', the actual paths will be:
  // Homepage: '/' -> should show chatbot
  // Docs: '/docs/...' -> should show chatbot
  // Since the baseUrl is stripped from the pathname in Docusaurus router
  const isPhysicalAIBookPage =
    location.pathname === '/' ||
    location.pathname.startsWith('/docs');

  if (!isPhysicalAIBookPage) {
    return null;
  }

  return <FloatingChatbot />;
};

export default PageSpecificChatbot;