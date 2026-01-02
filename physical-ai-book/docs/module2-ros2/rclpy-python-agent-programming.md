---
title: "Topic 2.2 - Python-based Communication with rclpy"
sidebar_position: 3
---

# Topic 2.2: Python-based Communication with rclpy

Python has become one of the most popular languages in robotics due to its simplicity and powerful libraries. In ROS 2, `rclpy` is the official Python client library that allows you to create ROS 2 nodes and communicate with other nodes using Python. This makes it easier for developers to connect high-level AI logic with robot hardware using familiar Python syntax.

## What is rclpy?

**rclpy** is a Python library that provides a Python API for ROS 2. It allows you to:
- Create ROS 2 nodes
- Publish and subscribe to topics
- Call and provide services
- Work with ROS 2 parameters and actions

## Setting Up Your Environment

Before creating nodes with rclpy, make sure your ROS 2 environment is properly set up:

1. **Source your ROS 2 installation:**
   ```bash
   source /opt/ros/humble/setup.bash  # Replace 'humble' with your ROS 2 version
   ```

2. **Create a new ROS 2 package:**
   ```bash
   mkdir -p ~/ros2_ws/src
   cd ~/ros2_ws/src
   ros2 pkg create --build-type ament_python my_robot_nodes
   ```

## Creating a Publisher Node with rclpy

Let's create a simple node that publishes sensor data from a robot:

**`my_robot_nodes/sensor_publisher.py`:**

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32  # For publishing a single floating-point value

class SensorPublisher(Node):
    def __init__(self):
        super().__init__('sensor_publisher')
        self.publisher = self.create_publisher(Float32, 'robot_distance', 10)
        timer_period = 0.5  # Publish every 0.5 seconds
        self.timer = self.create_timer(timer_period, self.publish_distance)
        self.distance = 0.0

    def publish_distance(self):
        msg = Float32()
        # Simulate a distance reading (in meters)
        self.distance += 0.1
        msg.data = self.distance
        self.publisher.publish(msg)
        self.get_logger().info(f'Publishing distance: {msg.data} meters')

def main(args=None):
    rclpy.init(args=args)
    sensor_publisher = SensorPublisher()

    try:
        rclpy.spin(sensor_publisher)
    except KeyboardInterrupt:
        pass
    finally:
        sensor_publisher.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Creating a Subscriber Node with rclpy

Now, let's create a node that subscribes to the distance data:

**`my_robot_nodes/distance_subscriber.py`:**

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32

class DistanceSubscriber(Node):
    def __init__(self):
        super().__init__('distance_subscriber')
        self.subscription = self.create_subscription(
            Float32,
            'robot_distance',
            self.distance_callback,
            10)
        self.subscription  # Prevent unused variable warning

    def distance_callback(self, msg):
        self.get_logger().info(f'Received distance: {msg.data} meters')
        # Here you could implement logic based on the distance
        if msg.data > 5.0:
            self.get_logger().warn('Robot is too far! Consider returning.')

def main(args=None):
    rclpy.init(args=args)
    distance_subscriber = DistanceSubscriber()

    try:
        rclpy.spin(distance_subscriber)
    except KeyboardInterrupt:
        pass
    finally:
        distance_subscriber.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Connecting AI Logic with Hardware

The real power of rclpy comes from connecting high-level AI logic with robot hardware. Here's an example of how an AI decision-making node might interact with hardware:

**`my_robot_nodes/ai_controller.py`:**

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32, String
from geometry_msgs.msg import Twist  # For robot movement commands

class AIController(Node):
    def __init__(self):
        super().__init__('ai_controller')

        # Subscribe to sensor data
        self.distance_subscription = self.create_subscription(
            Float32,
            'robot_distance',
            self.distance_callback,
            10)

        # Publish movement commands
        self.cmd_publisher = self.create_publisher(Twist, 'cmd_vel', 10)

        # Publish status updates
        self.status_publisher = self.create_publisher(String, 'ai_status', 10)

        self.distance = 0.0

    def distance_callback(self, msg):
        self.distance = msg.data
        self.make_decision()

    def make_decision(self):
        cmd_msg = Twist()
        status_msg = String()

        if self.distance < 2.0:
            # Move forward if distance is less than 2 meters
            cmd_msg.linear.x = 0.5  # Move forward at 0.5 m/s
            status_msg.data = "Moving forward"
        elif self.distance > 5.0:
            # Stop if distance is greater than 5 meters
            cmd_msg.linear.x = 0.0  # Stop
            status_msg.data = "Stopping"
        else:
            # Maintain current speed
            cmd_msg.linear.x = 0.2  # Move forward slowly
            status_msg.data = "Maintaining distance"

        # Publish the commands
        self.cmd_publisher.publish(cmd_msg)
        self.status_publisher.publish(status_msg)
        self.get_logger().info(f'AI Decision: {status_msg.data}')

def main(args=None):
    rclpy.init(args=args)
    ai_controller = AIController()

    try:
        rclpy.spin(ai_controller)
    except KeyboardInterrupt:
        pass
    finally:
        ai_controller.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Running the Nodes

1. **Add the executables to your package setup:**

   In `setup.py`, add the following to the `entry_points` section:
   ```python
   entry_points={
       'console_scripts': [
           'sensor_publisher = my_robot_nodes.sensor_publisher:main',
           'distance_subscriber = my_robot_nodes.distance_subscriber:main',
           'ai_controller = my_robot_nodes.ai_controller:main',
       ],
   },
   ```

2. **Build and run:**
   ```bash
   cd ~/ros2_ws
   colcon build --packages-select my_robot_nodes
   source install/setup.bash

   # Run each node in a separate terminal
   ros2 run my_robot_nodes sensor_publisher
   ros2 run my_robot_nodes distance_subscriber
   ros2 run my_robot_nodes ai_controller
   ```

## Summary

Using rclpy, you can easily create Python-based ROS 2 nodes that connect AI decision-making logic with robot hardware. This enables complex robotic behaviors where high-level intelligence can respond to sensor data and control physical actions. The publish-subscribe model allows for flexible, decoupled system design where different components can work together seamlessly.
