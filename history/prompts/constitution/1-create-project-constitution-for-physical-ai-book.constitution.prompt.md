---
id: 1
title: Create Project Constitution for Physical AI Book
stage: constitution
date: 2025-12-10
surface: agent
model: gemini
feature: none
branch: main
user: jasmine sheikh
command: /sp.constitution
labels: ["constitution", "project-setup", "documentation"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
 - .specify/templates/plan-template.md
tests:
 - none
---

## Prompt

/sp.constitution Create a document named constitution.md for the book “Physical AI and Humanoid Robots” following these improved guiding principles:

1. Audience & Difficulty

Content must support beginners to advanced readers.

All topics should be explained in simple, clear, and beginner-friendly language, gradually increasing in depth.

2. Content Requirements

Include complete coverage of:

Physical AI fundamentals

Humanoid Robotics

ROS 2 (Robot Operating System 2)

Gazebo simulation

NVIDIA Isaac tools

VLA (Vision-Language-Action models)

Also include:

Fully structured Modules 1–4

A dedicated Hardware & Lab Setup section

Practical hands-on exercises, examples, and mini-projects for each module

3. Documentation Structure (Docusaurus-Ready)

The book must be fully prepared for Docusaurus with:

Organized chapters, lessons, and subsections

A clear, navigable sidebar structure

Exercises placed inside each lesson

Proper file hierarchy for future expansion

4. Style & Formatting Guidelines

Step-by-step explanations

Headings, bullet points, tables, and code snippets where needed

Weekly learning roadmap + assessments

Writing should support all future development of the book, chapters, and platform

5. Purpose

This constitution should act as the master guide for all future generation tasks related to this book and its documentation.

## Response snapshot

I have successfully created the project constitution and updated the relevant project templates.

## Outcome

- ✅ Impact: A new constitution for the project "Physical AI and Humanoid Robots" has been created and saved in `.specify/memory/constitution.md`. The `plan-template.md` has been updated to reflect the new constitution.
- 🧪 Tests: none
- 📁 Files: 
  - `.specify/memory/constitution.md`
  - `.specify/templates/plan-template.md`
- 🔁 Next prompts: none
- 🧠 Reflection: The user provided a clear set of principles for the constitution. The process involved updating the constitution file and ensuring that other templates in the project reflect the new principles.

## Evaluation notes (flywheel)

- Failure modes observed: The `create-phr.sh` script was not available in the expected location, requiring a manual fallback.
- Graders run and results (PASS/FAIL): none
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): Ensure the PHR creation script is available and executable in the correct environment.
