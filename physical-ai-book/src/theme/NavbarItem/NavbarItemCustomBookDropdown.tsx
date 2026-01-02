import React, { useState, useRef, useEffect } from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';

const NavbarItemCustomBookDropdown = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Module data - this is pure UI data, not referencing actual docs paths
  const modules = [
    {
      id: 'module1',
      label: 'Module 1: Introduction to Physical AI',
      topics: [
        { label: '1.1 - What is Physical AI' },
        { label: '1.2 - Understanding Embodied Intelligence' },
        { label: '1.3 - Sensors & Humanoid Robotics Fundamentals' },
        { label: '1.4 - Explore Simulated Robot' },
      ]
    },
    {
      id: 'module2',
      label: 'Module 2: Core Robotics Programming with ROS 2',
      topics: [
        { label: '2.1 - Nodes, Topics, Services' },
        { label: '2.2 - rclpy & Python Agent Programming' },
        { label: '2.3 - URDF Modeling for Humanoid Robots' },
        { label: '2.4 - Control a Robot Joint' },
      ]
    },
    {
      id: 'module3',
      label: 'Module 3: Simulating Robots in a Virtual World',
      topics: [
        { label: '3.1 - Physics Simulation with Gazebo' },
        { label: '3.2 - Unity Rendering Environment' },
        { label: '3.3 - Sensor Simulation' },
        { label: '3.4 - Build Obstacle Course & Simulate' },
      ]
    },
    {
      id: 'module4',
      label: 'Module 4: Building the Robot\'s Brain: AI and Navigation',
      topics: [
        { label: '4.1 - Isaac SDK Sim Fundamentals' },
        { label: '4.2 - Isaac ROS' },
        { label: '4.3 - Nav2 Humanoid Path Planning' },
        { label: '4.4 - Implement Path Planning' },
        { label: '4.5 - Robotics Vision and Design' },
      ]
    },
    {
      id: 'module5',
      label: 'Module 5: Advanced Topics in Humanoid Robotics',
      topics: [
        { label: '5.1 - Bimanual Manipulation' },
        { label: '5.2 - Legged Locomotion' },
        { label: '5.3 - Human-Robot Interaction' },
        { label: '5.4 - Advanced AI' },
      ]
    },
    {
      id: 'module6',
      label: 'Module 6: Hardware & Lab Setup',
      topics: [
        { label: '6.1 - Workstation & GPU Requirements' },
        { label: '6.2 - NVIDIA Jetson Setup Guide' },
        { label: '6.3 - Connecting Sensors & Robot Hardware' },
        { label: '6.4 - Cloud-based alternatives' },
        { label: '6.6 - Deploy ROS 2 nodes' },
      ]
    }
  ];

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
                to="#"
                onClick={(e) => {
                  e.preventDefault();
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
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();
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

export default NavbarItemCustomBookDropdown;