---
title: "Topic 2.1 - ROS 2 Nodes, Topics, and Services Explained Simply"
sidebar_position: 2
---

# Topic 2.1: ROS 2 Nodes, Topics, and Services Explained Simply

Communication is the backbone of any robotic system. In ROS 2, the **Robot Operating System 2**, three main communication methods allow different parts of a robot to work together: **Nodes**, **Topics**, and **Services**. Think of them as the components of a well-organized company where different departments need to share information.

## What is ROS 2?

**ROS 2 (Robot Operating System 2)** is not an actual operating system but rather a middleware framework that provides services for implementing robot applications. It includes hardware abstraction, device drivers, libraries, visualizers, message-passing, package management, and more. ROS 2 is used extensively in robotics research and industry because it simplifies the development of complex robotic behaviors.

## Nodes: The Individual Workers

A **Node** is like an employee in a company who specializes in a particular task. In robotics, a node is a process that performs computation. Nodes are organized to form a complete robot application. For example:
- A camera driver node captures images
- A motor controller node manages wheel movement
- A navigation node plans paths
- A sensor fusion node combines data from multiple sensors

Each node typically handles one specific function, making the system modular and easier to debug.

## Topics: The Company Bulletin Board

**Topics** work like a company bulletin board where employees post updates that others can read. This is a publish-subscribe communication model where:
- A node **publishes** data to a topic (posts on the bulletin board)
- Other nodes **subscribe** to that topic to receive the data (read the bulletin board)

For example, a LiDAR sensor node might publish distance measurements to a topic called `/scan`, and multiple nodes like obstacle detection, mapping, and navigation can all subscribe to this topic simultaneously.

This communication is asynchronous - the publisher doesn't wait for responses and continues publishing regardless of whether anyone is listening.

## Services: The Direct Phone Call

Sometimes a robot needs synchronous communication - a direct request and response. This is where **Services** come in, similar to making a phone call where you expect an immediate response.

A service has two parts:
- **Request**: The question or command sent by one node
- **Response**: The answer or confirmation returned by another node

For example, a path-planning node might offer a service called `/find_path` where another node can send a start and end location and receive a calculated path in return.

## Real-World Example: Temperature Monitoring Robot

Imagine a robot that monitors temperature in a warehouse:

1. A temperature sensor node continuously **publishes** readings to the `/temperature` topic
2. A monitoring node **subscribes** to `/temperature` to receive these readings
3. If the temperature gets too high, the monitoring node makes a **service** request to a cooling system node via `/activate_cooling`
4. The cooling system processes the request and sends back a confirmation

This example shows how nodes, topics, and services work together to create intelligent robot behavior.

## Summary

ROS 2's communication system allows complex robots to be built from simple, specialized components that work together. Nodes handle specific tasks, topics enable broadcast-style communication, and services provide request-response interactions. This modular approach makes it easier to develop, test, and maintain robotic systems.

Understanding these concepts is crucial for connecting high-level AI logic with the robot's physical hardware.
