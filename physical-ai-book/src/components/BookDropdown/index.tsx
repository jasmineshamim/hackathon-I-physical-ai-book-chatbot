import React, { useState, useRef, useEffect } from 'react';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import clsx from 'clsx';

const BookDropdown = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const modules = [
    {
      id: 'module1',
      label: 'Module 1: Introduction to Physical AI',
      path: '/docs/module1-intro',
      topics: [
        { label: '1.1 - What is Physical AI', path: '/docs/module1-intro/what-is-physical-ai' },
        { label: '1.2 - Understanding Embodied Intelligence', path: '/docs/module1-intro/understanding-embodied-intelligence' },
        { label: '1.3 - Sensors & Humanoid Robotics Fundamentals', path: '/docs/module1-intro/sensors-humanoid-robotics-fundamentals' },
        { label: '1.4 - Explore Simulated Robot', path: '/docs/module1-intro/explore-simulated-robot' },
      ]
    },
    {
      id: 'module2',
      label: 'Module 2: Core Robotics Programming with ROS 2',
      path: '/docs/module2-ros2',
      topics: [
        { label: '2.1 - Nodes, Topics, Services (Core ROS 2 Communication)', path: '/docs/module2-ros2/ros2-communication' },
        { label: '2.2 - rclpy & Python Agent Programming', path: '/docs/module2-ros2/rclpy-python-agent-programming' },
        { label: '2.3 - URDF Modeling for Humanoid Robots', path: '/docs/module2-ros2/urdf-modeling-humanoids' },
        { label: '2.4 - Control a Robot Joint', path: '/docs/module2-ros2/control-robot-joint' },
      ]
    },
    {
      id: 'module3',
      label: 'Module 3: Simulating Robots in a Virtual World',
      path: '/docs/module3-digital-twin',
      topics: [
        { label: '3.1 - Physics Simulation with Gazebo', path: '/docs/module3-digital-twin/physics-simulation-gazebo' },
        { label: '3.2 - Unity Rendering Environment', path: '/docs/module3-digital-twin/unity-rendering-environment' },
        { label: '3.3 - Sensor Simulation', path: '/docs/module3-digital-twin/sensor-simulation' },
        { label: '3.4 - Build Obstacle Course & Simulate', path: '/docs/module3-digital-twin/build-obstacle-course-simulate' },
      ]
    },
    {
      id: 'module4',
      label: 'Module 4: Building the Robot\'s Brain: AI and Navigation',
      path: '/docs/module4-ai-robot-brain',
      topics: [
        { label: '4.1 - Isaac SDK Sim Fundamentals', path: '/docs/module4-ai-robot-brain/isaac-sdk-sim-fundamentals' },
        { label: '4.2 - Isaac ROS', path: '/docs/module4-ai-robot-brain/isaac-ros' },
        { label: '4.3 - Nav2 Humanoid Path Planning', path: '/docs/module4-ai-robot-brain/nav2-humanoid-path-planning' },
        { label: '4.4 - Implement Path Planning', path: '/docs/module4-ai-robot-brain/implement-path-planning' },
        { label: '4.5 - Robotics Vision and Design', path: '/docs/module4-ai-robot-brain/robotics-vision-and-design' },
      ]
    },
    {
      id: 'module5',
      label: 'Module 5: Advanced Topics in Humanoid Robotics',
      path: '/docs/module5-advanced-topics',
      topics: [
        { label: '5.1 - Bimanual Manipulation', path: '/docs/module5-advanced-topics/bimanual-manipulation' },
        { label: '5.2 - Legged Locomotion', path: '/docs/module5-advanced-topics/legged-locomotion' },
        { label: '5.3 - Human-Robot Interaction', path: '/docs/module5-advanced-topics/human-robot-interaction' },
        { label: '5.4 - Advanced AI', path: '/docs/module5-advanced-topics/advanced-ai' },
      ]
    },
    {
      id: 'module6',
      label: 'Module 6: Hardware & Lab Setup',
      path: '/docs/hardware-lab-setup',
      topics: [
        { label: '6.1 - Workstation & GPU Requirements', path: '/docs/hardware-lab-setup/workstation-gpu-requirements' },
        { label: '6.2 - NVIDIA Jetson Setup Guide', path: '/docs/hardware-lab-setup/nvidia-jetson-setup-guide' },
        { label: '6.3 - Connecting Sensors & Robot Hardware', path: '/docs/hardware-lab-setup/connecting-sensors-robot-hardware' },
        { label: '6.4 - Cloud-based alternatives (Simulation + Training)', path: '/docs/hardware-lab-setup/cloud-alternatives' },
        { label: '6.6 - Deploy ROS 2 nodes from a PC to a Jetson device', path: '/docs/hardware-lab-setup/deploy-ros2-nodes' },
      ]
    }
  ];

  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setActiveModule(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown when navigating to a page
  useEffect(() => {
    setShowDropdown(false);
    setActiveModule(null);
  }, [location.pathname]);

  const handleModuleHover = (moduleId: string) => {
    setActiveModule(moduleId);
  };

  const handleDropdownMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleDropdownMouseLeave = () => {
    // Only close if no topic submenu is active
    if (!activeModule) {
      setShowDropdown(false);
    }
  };

  const handleTopicMouseLeave = () => {
    setActiveModule(null);
  };

  return (
    <div 
      className="navbar__item dropdown dropdown--hoverable dropdown--right"
      ref={dropdownRef}
      onMouseEnter={handleDropdownMouseEnter}
      onMouseLeave={handleDropdownMouseLeave}
    >
      <Link
        className={clsx(
          'navbar__link',
          showDropdown ? 'dropdown__link--active' : ''
        )}
        to="#"
        onClick={(e) => {
          e.preventDefault();
          setShowDropdown(!showDropdown);
        }}
      >
        Book
      </Link>
      
      {showDropdown && (
        <ul className="dropdown__menu">
          {modules.map((module) => (
            <li 
              key={module.id}
              className="dropdown__submenu"
              onMouseEnter={() => handleModuleHover(module.id)}
              onMouseLeave={handleTopicMouseLeave}
            >
              <Link 
                className="dropdown__link" 
                to={module.path}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {module.label}
              </Link>
              
              {activeModule === module.id && (
                <ul className="dropdown__menu dropdown__submenu-list">
                  {module.topics.map((topic, index) => (
                    <li key={index}>
                      <Link 
                        className="dropdown__link" 
                        to={topic.path}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        {topic.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookDropdown;