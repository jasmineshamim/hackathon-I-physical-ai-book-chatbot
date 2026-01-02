import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type FeatureItem = {
  moduleNumber: string;
  title: string;
  description: ReactNode;
  to: string;
};

const FeatureList: FeatureItem[] = [
  {
    moduleNumber: 'Module 01',
    title: 'Introduction to Physical AI',
    description: (
      <>
        Explore the fundamentals of Physical AI and embodied intelligence, understanding sensors and humanoid robotics basics.
      </>
    ),
    to: '/docs/module1-intro'
  },
  {
    moduleNumber: 'Module 02',
    title: 'Core Robotics Programming with ROS 2',
    description: (
      <>
        Master ROS 2 communication, Python agent programming, and URDF modeling for humanoid robots.
      </>
    ),
    to: '/docs/module2-ros2'
  },
  {
    moduleNumber: 'Module 03',
    title: 'Simulating Robots in a Virtual World',
    description: (
      <>
        Learn physics simulation with Gazebo, Unity rendering environments, and sensor simulation techniques.
      </>
    ),
    to: '/docs/module3-digital-twin'
  },
  {
    moduleNumber: 'Module 04',
    title: 'Building the Robot\'s Brain: AI and Navigation',
    description: (
      <>
        Implement Isaac SDK fundamentals, navigation systems, and path planning algorithms.
      </>
    ),
    to: '/docs/module4-ai-robot-brain'
  },
  {
    moduleNumber: 'Module 05',
    title: 'Advanced Topics in Humanoid Robotics',
    description: (
      <>
        Dive into bimanual manipulation, legged locomotion, human-robot interaction, and advanced AI techniques.
      </>
    ),
    to: '/docs/module5-advanced-topics'
  },
  {
    moduleNumber: 'Module 06',
    title: 'Hardware & Lab Setup',
    description: (
      <>
        Understand workstation requirements, NVIDIA Jetson setup, and deploying ROS 2 nodes on hardware.
      </>
    ),
    to: '/docs/hardware-lab-setup'
  },
];

function Feature({moduleNumber, title, description, to}: FeatureItem) {
  return (
    <div className="col col--4">
      <div className={styles.topicCard}>
        <div className={styles.moduleNumber}>{moduleNumber}</div>
        <div className={styles.topicContent}>
          <Heading as="h3" className={styles.topicTitle}>{title}</Heading>
          <p className={styles.topicDescription}>{description}</p>
          <Link to={to} className={styles.topicButton}>
            Explore Module
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="text--center padding-bottom--lg">
          <Heading as="h2" className={styles.sectionTitle}>Book Modules</Heading>
          <p className={styles.sectionSubtitle}>Explore the comprehensive curriculum covering Physical AI and Humanoid Robotics</p>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
