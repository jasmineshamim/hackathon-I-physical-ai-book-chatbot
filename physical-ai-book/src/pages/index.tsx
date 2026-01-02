import React, { JSX } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import Chatbot from '@site/components/Chatbot';
import FloatingChatbot from '../FloatingChatbot';

const HomepageHeader = () => {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary homepage-hero')}>
      <div className="container hero-container">
        {/* Left Text Content */}
        <div className="hero-text-content">
          <Heading as="h1" className="hero__title hero-title">
            Physical AI & Humanoid Robotics
          </Heading>
          <p className="hero__subtitle hero-subtitle">
            Exploring Embodied Intelligence and Robotics
          </p>
          <div className="hero-buttons">
            <Link
              className="button button--secondary button--lg glow-button"
              to="/docs/intro"
            >
              Start Reading <span className="arrow-icon">→</span>
            </Link>
          </div>
        </div>

        {/* Right Hero Image */}
        <div className="hero-image-content">
          <img
            src="/img/home.png"
            alt="Physical AI and Humanoid Robotics"
            className="hero-image"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.style.display = 'none';
                // Also adjust the text content to be centered when image is removed
                const textContent = document.querySelector('.hero-text-content');
                if (textContent) {
                  textContent.classList.add('text-centered');
                }
              }
            }}
          />
          {/* Glow effect */}
          <div className="hero-glow-effect"></div>
        </div>
      </div>
      <FloatingChatbot/>
    </header>
  
  );
};

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Physical AI and Humanoid Robotics`}
      description="Comprehensive curriculum covering Physical AI and Humanoid Robotics"
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
