import React, { JSX } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HolographicRobot from '@site/src/components/HolographicRobot/HolographicRobot';

import Heading from '@theme/Heading';

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

        {/* Right Hero - Holographic Robot */}
        <div className="hero-image-content">
          <HolographicRobot />
        </div>
      </div>
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
