# OMNIX AI - Customer Analytics Development Context

## Core Principles
- AWS Serverless microservices with Node.js/Nest.js and AI-powered analytics.
- API-First using OpenAPI.
- Mobile First, Atomic Design, WCAG + ARIA.
- AI-driven customer insights and consumption prediction.

## Tech Stack
- Frontend: Next.js, Styled Components, Zustand/Context.
- Backend: Node.js + Nest.js Lambdas, DynamoDB, AWS Bedrock (Claude), API Gateway, SQS.
- AI Layer: AWS Bedrock for customer analysis, consumption prediction, and behavioral insights.

## Coding Rules
- Follow architecture + API-First.
- Use ES6+, React hooks.
- Clean, modular code.
- Accessibility mandatory.
- Update OpenAPI on API changes.
- Privacy-first approach for customer data.
- Document AI decisions in DECISIONS_LOG.md.

## AI Development Focus
- Customer consumption pattern prediction using AWS Bedrock
- Analyze purchase history to predict needs (e.g., "buys milk every 5 days")
- Socioeconomic profiling from shopping behavior
- Real-time personalization based on AI insights

## Quick Checklist
- Match architecture & coding style.
- Update API docs if needed.
- Accessibility included.
- Optimize performance.
- Document AI prompts and model decisions.
- Test AI predictions for accuracy.

---

## Task Management Instructions

Claude manages AI customer analytics development with professional workflow practices.

**Context Loading Protocol:**
- Primary context: CLAUDE.md (this file) + docs/CURRENT_SPRINT.md
- Module context: context/customer-ai/ files for AI-specific work
- Session context: context/sessions/ for handoff continuity
- Design reference: AI_CUSTOMER_ANALYTICS_SYSTEM_DESIGN.md

**Development Focus Areas:**
- Phase 1: ✅ Complete (Database, Customer Profiles, Basic ML)
- Phase 2: 🚀 Current (AWS Bedrock Integration, AI Analysis)
- Phase 3: 📋 Planned (Advanced Personalization, Performance)
- Phase 4: 📋 Future (Scale & Advanced Features)

**AI Implementation Priority:**
1. AWS Bedrock service integration
2. Customer purchase pattern analysis
3. Consumption prediction algorithms
4. Real-time AI recommendations
5. Performance optimization

**Session Management:**
- 45-60 minute focused sessions on single AI feature
- Update task_status.md and context files in real-time
- Document AI decisions in docs/DECISIONS_LOG.md
- End with handoff notes for next session
- Test AI accuracy before marking tasks complete

---

Always maintain context and respond accordingly.
