---
title: "Topic 2.4 - Simple Communication Example: Robot Publishing and Subscribing"
sidebar_position: 5
---

# Topic 2.4: Simple Communication Example: Robot Publishing and Subscribing

Now that we understand the basics of ROS 2 communication and how to create nodes with rclpy, let's look at a simple but complete example that demonstrates how a robot can publish sensor data and another node can subscribe to that data. This example will show how ROS 2 connects high-level AI logic with robot hardware.

## Example Scenario: Robot Distance Sensing

Imagine a robot equipped with a distance sensor that needs to monitor obstacles in front of it. Our example will include:

1. A sensor node that publishes distance measurements
2. A monitoring node that subscribes to these measurements
3. A simple AI decision-making node that responds to the sensor data

## Step 1: Create the Distance Sensor Publisher

This node simulates a distance sensor on a robot, continuously publishing distance readings:

**`my_robot_nodes/distance_sensor_publisher.py`:**

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32
import random

class DistanceSensorPublisher(Node):
    def __init__(self):
        super().__init__('distance_sensor_publisher')
        self.publisher = self.create_publisher(Float32, 'robot_distance_front', 10)
        timer_period = 0.5  # Publish every 0.5 seconds
        self.timer = self.create_timer(timer_period, self.publish_distance)
        self.distance = 2.0  # Starting distance in meters

    def publish_distance(self):
        msg = Float32()
        # Simulate sensor noise and gradual changes
        self.distance += random.uniform(-0.1, 0.1)
        # Keep distance between 0.1 and 5.0 meters
        self.distance = max(0.1, min(5.0, self.distance))
        msg.data = self.distance
        self.publisher.publish(msg)
        self.get_logger().info(f'Distance sensor reading: {msg.data:.2f} meters')

def main(args=None):
    rclpy.init(args=args)
    sensor_publisher = DistanceSensorPublisher()

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

## Step 2: Create the Distance Monitor Subscriber

This node subscribes to the distance sensor data and logs the readings:

**`my_robot_nodes/distance_monitor.py`:**

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32

class DistanceMonitor(Node):
    def __init__(self):
        super().__init__('distance_monitor')
        self.subscription = self.create_subscription(
            Float32,
            'robot_distance_front',
            self.distance_callback,
            10)
        self.subscription  # Prevent unused variable warning

    def distance_callback(self, msg):
        distance = msg.data
        self.get_logger().info(f'Monitor: Robot distance to obstacle is {distance:.2f} meters')

        # Simple logic to detect if robot is getting close to an obstacle
        if distance < 1.0:
            self.get_logger().warn('WARNING: Robot is very close to an obstacle!')
        elif distance < 2.0:
            self.get_logger().info('CAUTION: Robot approaching obstacle')

def main(args=None):
    rclpy.init(args=args)
    distance_monitor = DistanceMonitor()

    try:
        rclpy.spin(distance_monitor)
    except KeyboardInterrupt:
        pass
    finally:
        distance_monitor.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Step 3: Create the AI Decision-Making Node

This node subscribes to the distance data and makes decisions about robot movement:

**`my_robot_nodes/obstacle_avoidance_ai.py`:**

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32
from geometry_msgs.msg import Twist  # For sending movement commands

class ObstacleAvoidanceAI(Node):
    def __init__(self):
        super().__init__('obstacle_avoidance_ai')

        # Subscribe to distance sensor data
        self.distance_subscription = self.create_subscription(
            Float32,
            'robot_distance_front',
            self.distance_callback,
            10)

        # Publish movement commands to the robot
        self.movement_publisher = self.create_publisher(Twist, 'cmd_vel', 10)

        self.current_distance = 2.0  # Default distance
        self.safe_distance = 1.5     # Minimum safe distance

    def distance_callback(self, msg):
        self.current_distance = msg.data
        self.make_movement_decision()

    def make_movement_decision(self):
        cmd_msg = Twist()

        if self.current_distance < self.safe_distance:
            # Too close to obstacle - stop and turn
            cmd_msg.linear.x = 0.0   # Stop forward movement
            cmd_msg.angular.z = 0.5  # Turn right to avoid obstacle
            self.get_logger().info('AI Decision: Turning to avoid obstacle')
        else:
            # Safe distance - move forward
            cmd_msg.linear.x = 0.3   # Move forward slowly
            cmd_msg.angular.z = 0.0  # No turning
            self.get_logger().info('AI Decision: Moving forward safely')

        # Publish the movement command
        self.movement_publisher.publish(cmd_msg)

def main(args=None):
    rclpy.init(args=args)
    ai_node = ObstacleAvoidanceAI()

    try:
        rclpy.spin(ai_node)
    except KeyboardInterrupt:
        pass
    finally:
        ai_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Step 4: Running the Example

To see this communication in action:

1. **Make sure your package is set up with all three nodes**

2. **Add the executables to your setup.py:**
   ```python
   entry_points={
       'console_scripts': [
           'distance_sensor_publisher = my_robot_nodes.distance_sensor_publisher:main',
           'distance_monitor = my_robot_nodes.distance_monitor:main',
           'obstacle_avoidance_ai = my_robot_nodes.obstacle_avoidance_ai:main',
       ],
   },
   ```

3. **Build your package:**
   ```bash
   cd ~/ros2_ws
   colcon build --packages-select my_robot_nodes
   source install/setup.bash
   ```

4. **Run all three nodes in separate terminals:**
   ```bash
   # Terminal 1
   ros2 run my_robot_nodes distance_sensor_publisher

   # Terminal 2
   ros2 run my_robot_nodes distance_monitor

   # Terminal 3
   ros2 run my_robot_nodes obstacle_avoidance_ai
   ```

## Understanding the Communication Flow

In this example:
- The **Distance Sensor Publisher** acts like a robot's sensor, publishing distance measurements to the `robot_distance_front` topic
- The **Distance Monitor** subscribes to this topic, receiving and logging the distance data
- The **Obstacle Avoidance AI** also subscribes to the same topic, using the data to make decisions about robot movement
- The AI node then publishes movement commands to the `cmd_vel` topic, which would be received by the robot's motor controllers

This demonstrates how ROS 2 enables different parts of a robot system to communicate seamlessly - from low-level sensor data to high-level AI decision-making, all connected through topics.

## Summary

This example shows a complete communication loop in ROS 2:
1. A sensor node publishes data (simulating real robot sensors)
2. Multiple subscriber nodes receive the data (monitoring and AI decision-making)
3. The AI node processes the data and publishes commands back to the robot

This is the essence of how ROS 2 connects high-level AI logic with robot hardware, enabling intelligent robot behavior based on real-time sensor data.
