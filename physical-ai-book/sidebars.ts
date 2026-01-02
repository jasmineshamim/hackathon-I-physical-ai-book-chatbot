import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Explicitly define the sidebar structure for the book
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Module 1: Introduction to Physical AI',
      link: {type: 'doc', id: 'module1-intro/index'}, // Link to the intro page for this module
      items: [
        'module1-intro/what-is-physical-ai',
        'module1-intro/understanding-embodied-intelligence',
        'module1-intro/sensors-humanoid-robotics-fundamentals',
        'module1-intro/explore-simulated-robot',
      ],
    },
    {
      type: 'category',
      label: 'Module 2: Core Robotics Programming with ROS 2',
      link: {type: 'doc', id: 'module2-ros2/index'},
      items: [
        'module2-ros2/ros2-communication',
        'module2-ros2/rclpy-python-agent-programming',
        'module2-ros2/urdf-modeling-humanoids',
        'module2-ros2/control-robot-joint',
      ],
    },
    {
      type: 'category',
      label: 'Module 3: Simulating Robots in a Virtual World',
      link: {type: 'doc', id: 'module3-digital-twin/index'},
      items: [
        'module3-digital-twin/physics-simulation-gazebo',
        'module3-digital-twin/unity-rendering-environment',
        'module3-digital-twin/sensor-simulation',
        'module3-digital-twin/build-obstacle-course-simulate',
      ],
    },
    {
      type: 'category',
      label: 'Module 4: Building the Robot\'s Brain: AI and Navigation',
      link: {type: 'doc', id: 'module4-ai-robot-brain/index'},
      items: [
        'module4-ai-robot-brain/isaac-sdk-sim-fundamentals',
        'module4-ai-robot-brain/isaac-ros',
        'module4-ai-robot-brain/nav2-humanoid-path-planning',
        'module4-ai-robot-brain/implement-path-planning',
        'module4-ai-robot-brain/robotics-vision-and-design',
      ],
    },
    {
      type: 'category',
      label: 'Module 5: Vision-Language-Action (VLA)',
      link: {type: 'doc', id: 'module5-advanced-topics/index'},
      items: [
        'module5-advanced-topics/bimanual-manipulation',
        'module5-advanced-topics/legged-locomotion',
        'module5-advanced-topics/human-robot-interaction',
        'module5-advanced-topics/advanced-ai',
        'module5-advanced-topics/capstone-example',
      ],
    },
    {
      type: 'category',
      label: 'Module 6: Hardware & Lab Setup',
      link: {type: 'doc', id: 'hardware-lab-setup/index'},
      items: [
        'hardware-lab-setup/workstation-gpu-requirements',
        'hardware-lab-setup/nvidia-jetson-setup-guide',
        'hardware-lab-setup/connecting-sensors-robot-hardware',
        'hardware-lab-setup/cloud-alternatives',
        'hardware-lab-setup/deploy-ros2-nodes',
      ],
    },
  ],
};

export default sidebars;
