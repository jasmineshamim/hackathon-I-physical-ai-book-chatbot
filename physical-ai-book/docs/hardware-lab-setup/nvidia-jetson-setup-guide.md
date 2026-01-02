---
title: Topic 6.2 - NVIDIA Jetson Setup Guide
sidebar_position: 3
---
# NVIDIA Jetson Setup Guide: Bringing AI to the Edge

For deploying AI models directly onto physical robots—especially smaller, more power-efficient systems—NVIDIA Jetson embedded platforms are an industry standard. These compact, high-performance computing modules bring the power of NVIDIA's GPU architecture to the edge, enabling complex AI inference and robotics applications to run onboard your robot. This guide will walk you through the essential steps to set up and configure your NVIDIA Jetson device for Physical AI development.

## Why NVIDIA Jetson for Robotics?

*   **Edge AI Performance**: Jetsons are designed for AI at the edge, offering impressive GPU performance for deep learning inference, computer vision, and sensor processing in a small form factor.
*   **Power Efficiency**: They provide a balance of performance and power consumption, making them ideal for battery-powered mobile robots.
*   **ROS 2 Compatibility**: Fully compatible with ROS 2, allowing for seamless integration with your existing robotics software stack.
*   **Integrated Software Stack**: Comes with NVIDIA's JetPack SDK, which includes CUDA, cuDNN, TensorRT, and other developer tools optimized for AI and robotics.

## Choosing Your Jetson Device

NVIDIA offers a range of Jetson devices, each suited for different power/performance envelopes:

*   **Jetson Nano**: Entry-level, great for beginners and small projects.
*   **Jetson Xavier NX**: Mid-range, more powerful for complex AI workloads.
*   **Jetson AGX Xavier / Orin**: High-end, for demanding applications requiring maximum AI and compute performance.

For most Physical AI development, a Jetson Nano or Xavier NX is an excellent starting point.

## Essential Setup Steps

The primary method for setting up a Jetson is using the NVIDIA SDK Manager.

### Step 1: Install NVIDIA SDK Manager on Your Host PC

The SDK Manager is a desktop application that streamlines the process of flashing your Jetson device with the JetPack SDK and installing necessary developer tools.

1.  **Download SDK Manager**: Go to the [NVIDIA Developer website](https://developer.nvidia.com/nvidia-sdk-manager) and download the appropriate `.deb` package for your Ubuntu host PC.
2.  **Install SDK Manager**:
    ```bash
    sudo apt install ./sdkmanager_<version>.deb
    ```

### Step 2: Flash Your Jetson with JetPack SDK

Connect your Jetson device to your host PC via USB (in recovery mode) and power it on. Follow the on-screen instructions in SDK Manager:

1.  **Launch SDK Manager**:
    ```bash
    sdkmanager
    ```
2.  **Log in with NVIDIA Developer Account.**
3.  **Select Target Hardware**: Choose your specific Jetson model (e.g., Jetson Nano, Jetson Xavier NX).
4.  **Select JetPack Version**: Choose the recommended JetPack version. JetPack includes:
    *   **L4T (Linux for Tegra)**: The underlying operating system.
    *   **CUDA Toolkit**: For GPU programming.
    *   **cuDNN**: GPU-accelerated library for deep neural networks.
    *   **TensorRT**: High-performance deep learning inference runtime.
    *   **VisionWorks**: For accelerated computer vision.
    *   **ROS (Optional)**: Can install ROS/ROS 2 components directly.
5.  **Set Up Flashing Options**: Configure the target OS and developer tools. SDK Manager will guide you through putting your Jetson into recovery mode (usually involves a jumper and specific power-up sequence).
6.  **Flash and Install**: SDK Manager will flash the OS to your Jetson's storage and then install the selected SDK components. This process can take a significant amount of time.

### Step 3: Initial Configuration on Jetson

Once flashing is complete and your Jetson reboots:

1.  **Complete Ubuntu Setup**: Follow the on-screen prompts to set up Ubuntu (create user account, set timezone, etc.).
2.  **Verify Installation**:
    *   Check JetPack version: `head -n 1 /etc/nv_tegra_release`
    *   Check CUDA: `nvcc --version`
    *   Check Jtop (useful system monitoring tool): `sudo pip3 install jetson-stats` then `jtop`

### Step 4: Install ROS 2 (if not installed via JetPack)

If JetPack didn't install ROS 2, or you prefer a custom installation:

1.  **Follow Official ROS 2 Installation Guide**: Refer to the official ROS 2 documentation for your chosen ROS 2 distribution (e.g., Humble, Iron) and the Ubuntu version running on your Jetson. Pay attention to specific instructions for ARM architectures.

2.  **Install `rosdep` and initialize**:
    ```bash
    sudo apt update
    sudo apt install python3-rosdep
    sudo rosdep init
    rosdep update
    ```

3.  **Install ROS 2 packages**:
    ```bash
    sudo apt install ros-<ros2_distro>-desktop # Or ros-base for minimal
    ```

Setting up your NVIDIA Jetson correctly provides a robust platform for developing and deploying sophisticated AI-driven robotics applications right at the edge, enabling your Physical AI systems to operate autonomously and intelligently in the real world.
