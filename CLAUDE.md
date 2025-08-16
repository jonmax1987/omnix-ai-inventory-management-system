# OMNIX AI - Lite Development Context

## Core Principles
- AWS Serverless microservices with Node.js/Nest.js and Python.
- API-First using OpenAPI.
- Mobile First, Atomic Design, WCAG + ARIA.

## Tech Stack
- Frontend: Next.js, Styled Components, Zustand/Context.
- Backend: Node.js + Nest.js Lambdas, DynamoDB, Python AI Lambda, API Gateway, SQS.

## Coding Rules
- Follow architecture + API-First.
- Use ES6+, React hooks.
- Clean, modular code.
- Accessibility mandatory.
- Update OpenAPI on API changes.

## Quick Checklist
- Match architecture & coding style.
- Update API docs if needed.
- Accessibility included.
- Optimize performance.

---

## Task Management Instructions

Claude is responsible for managing project tasks dynamically during the development process.

- At the start of every new conversation or after a `/clear` command, load the lite project context from CLAUDE_LITE.md, including this Task Management Instructions section.
- Also load the current task status list from `task_status.md`, which contains User Stories and Tasks with their statuses.
- For each development session:
  - Review the current task list and their statuses.
  - Break down large User Stories into smaller actionable tasks if needed.
  - Update task statuses in real time to reflect progress: "Not started", "In progress", "Completed".
  - Suggest next tasks based on priority and dependencies.
- At the end of the session:
  - Provide a concise summary of completed and pending tasks.
  - Update the `task_status.md` content with latest statuses and changes.
- When switching context or module:
  - Clear context, load only the relevant module context and related tasks.
- Keep task management concise to reduce token usage.
- Treat task management as integral for smooth tracking and context continuity across sessions.

---

Always maintain context and respond accordingly.
