---
title: "Navigation with Nav2: Path Planning and Obstacle Avoidance"
---
# Navigation with Nav2: Path Planning and Obstacle Avoidance

**Nav2** is the ROS 2 navigation stack that enables robots to autonomously navigate through environments. It provides the intelligence for robots to plan paths, avoid obstacles, and reach their destinations safely. Nav2 is essential for creating autonomous robots that can operate in real-world environments.

## What is Nav2?

Nav2 is the next-generation navigation system for ROS 2 that allows robots to:
- Plan paths from a starting point to a destination
- Avoid obstacles in their path
- Navigate safely through complex environments
- Localize themselves in known or unknown spaces

## Core Components of Nav2

Nav2 consists of several key components that work together:

### 1. Global Planner
- Creates a long-term path from the robot's current location to the goal
- Considers the overall map of the environment
- Generates an optimal route around static obstacles

### 2. Local Planner
- Handles short-term navigation decisions
- Adjusts the robot's path in real-time to avoid dynamic obstacles
- Controls the robot's immediate movement

### 3. Costmap
- Represents the environment with obstacle information
- Assigns costs to different areas based on obstacle proximity
- Updates in real-time as the robot moves

### 4. Localization
- Determines the robot's position in the environment
- Uses sensor data to estimate location
- Works with maps to provide accurate positioning

## How Nav2 Works

Nav2 operates through a coordinated process:

1. **Mapping**: The robot creates or uses a map of the environment
2. **Localization**: The robot determines its current position
3. **Path Planning**: The global planner creates a route to the goal
4. **Obstacle Detection**: Sensors detect obstacles in the environment
5. **Local Planning**: The local planner adjusts movement to avoid obstacles
6. **Execution**: The robot follows the planned path to reach its destination

## Path Planning Process

### Global Path Planning
- Nav2 calculates the best route from start to goal
- Considers static obstacles and map constraints
- Creates a high-level plan for the journey

### Local Path Planning
- Adjusts the path based on real-time sensor data
- Handles dynamic obstacles that appear during navigation
- Ensures safe movement in the immediate vicinity

## Obstacle Avoidance

Nav2 handles obstacles through:

### Static Obstacles
- Pre-mapped obstacles that don't move
- Avoided using the global path plan
- Part of the environment map

### Dynamic Obstacles
- Moving obstacles detected by sensors
- Avoided using local planning
- Reacted to in real-time during navigation

## Real-World Example: Autonomous Robot Navigation

Consider a delivery robot navigating through a building:

1. **Map Loading**: The robot loads a map of the building
2. **Localization**: The robot determines its current position
3. **Goal Setting**: A destination is specified (e.g., "go to room 101")
4. **Path Planning**: Nav2 calculates a route avoiding walls and furniture
5. **Obstacle Detection**: The robot detects a person walking in the hallway
6. **Local Planning**: The robot adjusts its path to go around the person
7. **Navigation**: The robot continues to the destination safely

## Integration with Perception Systems

Nav2 works with perception systems to:
- Process sensor data for obstacle detection
- Update costmaps with real-time information
- Integrate with AI systems for enhanced navigation
- Use camera and LiDAR data for better environment understanding

## Benefits of Nav2

Using Nav2 for navigation provides several advantages:
- **Reliability**: Proven navigation algorithms
- **Flexibility**: Configurable for different robot types
- **Safety**: Built-in obstacle avoidance
- **Modularity**: Components can be customized
- **ROS 2 Integration**: Seamless integration with ROS 2 ecosystem

## Summary

Nav2 provides the navigation intelligence that enables robots to move autonomously through environments. By combining global path planning with local obstacle avoidance, Nav2 allows robots to safely navigate to their destinations while avoiding both static and dynamic obstacles. This navigation capability is essential for creating truly autonomous robots that can operate in real-world environments.
