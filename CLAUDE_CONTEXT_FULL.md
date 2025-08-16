# OMNIX AI - Full Development Context 🚀

## Principles & Strategy
- Microservices, API-First with OpenAPI spec.
- Mobile First, Atomic Design, WCAG + ARIA compliance.
- Workflow: Planning, Tool Selection, Coding, Testing, Deployment.

## Technical Architecture
- Frontend: Next.js + React (SSR), Styled Components, Framer Motion, React Icons, Zustand/Context API.
- Backend: Node.js + Nest.js (AWS Lambda + DynamoDB), AI in Python Lambda, API Gateway, Amazon SQS.

## Work Plan & Rules
- Break PRD into User Stories, design mobile-first UI, define API fully with OpenAPI.
- Develop frontend/backend in parallel with clean ES6+ React Hooks.
- Test extensively (Lighthouse, Axe), update README.
- Deploy via CI/CD pipelines per Lambda function.

## UI Screens Overview
- Home Dashboard: Urgent Alerts, Inventory Graph, Order Recommendations.
- Inventory Management: Interactive Table, Add/Edit/Delete product.
- Forecast & Recommendations: Forecast Graph, Recommendations List.

## Internal Checklist for Claude Code (Always follow):
1. Clarify goal before coding.
2. Match architecture: AWS Serverless + Microservices + API-First.
3. Frontend: Next.js functional components + Styled Components, Mobile First, ARIA/WCAG.
4. Backend: Nest.js modules for Node.js Lambdas, Python AI with ML libs.
5. API: Update OpenAPI spec on API changes.
6. Code style: ES6+, React hooks, optimize rendering.
7. Testing: Provide example tests and tools.
8. Output concise code, list filenames if multi-file.
9. Self-check before sending: architecture, style, accessibility, API docs.

## Example Task Prompts
- Build "Urgent Alerts" component, mobile-first, accessible.
- Create Nest.js Lambda for low-stock GET endpoint, update OpenAPI.
- Implement Python Lambda forecasting demand with Prophet, triggered by SQS.
- Write Jest unit tests for Products API, include accessibility tests.

---

## Modular Work Plan for Context Management
Divide the project into independent modules based on Microservices and UI components (e.g., Inventory Service, Alerts Service, Forecast AI, Dashboard UI, Inventory Management UI).

For each development session, load and work with only the relevant module’s context and API specs, not the entire full context. This keeps sessions light and focused.

Maintain a master CLAUDE_FULL.md with the entire project context and architecture, used only at the start of a new conversation or after a /clear.

Create separate context files per module (e.g., inventory_service.md, alerts_service.md, forecast_ai.md, dashboard_ui.md) that contain detailed specs and guidelines for that part.

When switching tasks or modules, clear the context and load the appropriate module context file before proceeding.

Use a centralized changelog or session notes file to track decisions and shared knowledge across modules.

This approach prevents context overload, reduces token usage, and allows parallel independent development with Claude handling each module separately.

Always update the master full context file after module completion or major changes to keep it in sync.

Suggested workflow example per session:
Start session → load CLAUDE_FULL.md (full context) once for global architecture overview.

For task on Module A → clear context → load module_a.md only.

Work on Module A until done → save changes, update logs.

Switch to Module B → clear context → load module_b.md.

Repeat as needed, syncing back to CLAUDE_FULL.md periodically.

---

## Task Management Instructions

Claude is responsible for managing project tasks dynamically during the development process.

- At the start of every new conversation or after a `/clear` command, load the full project context from CLAUDE_FULL.md, including this Task Management Instructions section.
- Also load the current task status list from `task_status.md`, which contains detailed User Stories and Tasks with their statuses.
- For each development session:
  - Review the current task list and their statuses.
  - Break down large User Stories into smaller actionable tasks as needed.
  - Update task statuses in real time to reflect progress: e.g., "Not started", "In progress", "Completed".
  - Suggest next tasks to work on based on priority and dependencies.
- At the end of the session:
  - Provide a concise summary of completed tasks and current pending tasks.
  - Update the `task_status.md` file content with the latest task statuses and any new tasks added or reprioritized.
- When switching context or module:
  - Clear context, load only the relevant module context file, and the subset of task statuses related to that module.
- Always keep task management concise to minimize token usage.
- Treat this task management as an integral part of your workflow, ensuring smooth project tracking, clarity, and context continuity across conversations.

---

Always maintain context and respond accordingly.
