---
id: 3
title: Deploy Docusaurus Project to Vercel via GitHub
stage: misc
date: 2025-12-10
surface: agent
model: gemini-1.5-pro
feature: 001-book-specification
branch: main
user: user
command: "Initialize Git in my project if not done already. Commit all files and push the project to a new GitHub repository. Connect the GitHub repository to Vercel. Deploy my Docusaurus site on Vercel so it is publicly accessible. Provide commands, folder structure guidance, and any settings I need to configure in GitHub and Vercel. Assume I have Node.js installed and am using the terminal."
labels: ["deployment", "docusaurus", "vercel", "github"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - physical-ai-book/.git
  - physical-ai-book/.gitignore
  - physical-ai-book/README.md
  - physical-ai-book/blog/...
  - physical-ai-book/docs/...
  - physical-ai-book/docusaurus.config.ts
  - physical-ai-book/package-lock.json
  - physical-ai-book/package.json
  - physical-ai-book/sidebars.ts
  - physical-ai-book/src/...
  - physical-ai-book/static/...
  - physical-ai-book/tsconfig.json
tests:
  - No explicit tests were run as this was a deployment guide.
---

## Prompt

"I have a Docusaurus project on my local machine. Help me with step-by-step instructions to:

Initialize Git in my project if not done already.

Commit all files and push the project to a new GitHub repository.

Connect the GitHub repository to Vercel.

Deploy my Docusaurus site on Vercel so it is publicly accessible.
Provide commands, folder structure guidance, and any settings I need to configure in GitHub and Vercel. Assume I have Node.js installed and am using the terminal."

## Response snapshot

- Instructions provided for initializing Git within the `physical-ai-book` directory.
- Instructions provided for creating a new GitHub repository and pushing the local project.
- Instructions provided for connecting the GitHub repository to Vercel and configuring the deployment.
- Instructions provided for deploying the Docusaurus site on Vercel and accessing it.

## Outcome

- ✅ Impact: The user was guided through the entire process of deploying their Docusaurus project to Vercel, from Git initialization to a live, publicly accessible site.
- 🧪 Tests: No automated tests were performed. The success is validated by the user's ability to follow instructions and achieve deployment.
- 📁 Files: A new Git repository was initialized in `physical-ai-book`, and all its files were committed. The `docusaurus.config.ts` was previously modified for a build error fix.
- 🔁 Next prompts: The user might ask for further configuration or updates to their deployed site.
- 🧠 Reflection: The initial `git status` output was misleading, indicating the Docusaurus project was part of a larger Git repo. Clarified the intent to make the Docusaurus project its own repo for independent deployment.

## Evaluation notes (flywheel)

- Failure modes observed: Initial misinterpretation of `git status` output due to nested Git repositories. Resolved by guiding the user to initialize a new Git repository explicitly within the Docusaurus project directory.
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
