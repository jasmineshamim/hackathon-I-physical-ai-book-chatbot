---
id: 1
title: Fix Chatbot Import Error
stage: general
date_iso: 2025-12-25
surface: agent
model: Qwen
feature: none
branch: main
user: user
command: fix-import-error
labels: ["bug", "import", "chatbot"]
links: {"spec": null, "ticket": null, "adr": null, "pr": null}
files_yaml:
  - C:\hackathon-I\physical-ai-book\src\components\Chatbot\GlobalChatbot.jsx
tests_yaml: []
---

## Summary

Fixed an import error in `GlobalChatbot.jsx` where the module path for `FloatingChatbot` was incorrect. The import was looking for the file in the wrong directory.

## Changes Made

- Changed import path from `'../FloatingChatbot'` to `'../../FloatingChatbot'` in `GlobalChatbot.jsx`
- This corrects the path to point to the `FloatingChatbot.tsx` file located in the `src` directory

## Before

```jsx
import FloatingChatbot from '../FloatingChatbot';  // Incorrect path
```

## After

```jsx
import FloatingChatbot from '../../FloatingChatbot';  // Correct path
```

## Verification

After the fix, the module should resolve correctly and the build error should be resolved.

## Prompt Text

User reported a module not found error in GlobalChatbot.jsx where the import path for FloatingChatbot was incorrect. The file FloatingChatbot.tsx was located in the src directory, but the import was looking in the wrong location.

## Response Text

I fixed the import path in GlobalChatbot.jsx by changing '../FloatingChatbot' to '../../FloatingChatbot' to correctly reference the FloatingChatbot.tsx file in the src directory.