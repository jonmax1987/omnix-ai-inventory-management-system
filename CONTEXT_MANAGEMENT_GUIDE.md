# Context Management Guide - How to Use This System Wisely

## 🎯 The Golden Rules

### Rule 1: One Module, One Session
**NEVER** mix multiple modules in a single conversation. If you're working on customer AI, don't suddenly ask about frontend changes.

### Rule 2: Always Start with Context
**NEVER** start coding without loading the proper context files. This prevents rework and mistakes.

### Rule 3: Document As You Go
**NEVER** wait until the end to update documentation. Real-time updates prevent context loss.

---

## 📚 How to Start Each Session

### Step 1: Choose Your Work Focus
Decide what you'll work on BEFORE starting the session:
- Customer AI Analytics (Phase 2)
- Frontend improvements
- Bug fixes
- Documentation

### Step 2: Load the Right Context

#### For Customer AI Work:
```markdown
@CLAUDE.md
@docs/CURRENT_SPRINT.md
@context/customer-ai/PHASE_STATUS.md
@context/customer-ai/NEXT_STEPS.md
"Let's continue with [specific task] for customer AI"
```

#### For Reviewing Previous Work:
```markdown
@context/sessions/SESSION_2025-01-19.md
@docs/HANDOFF_NOTES.md
"What was completed in the last session?"
```

#### For Implementation:
```markdown
@CLAUDE.md
@AI_CUSTOMER_ANALYTICS_SYSTEM_DESIGN.md
@context/customer-ai/NEXT_STEPS.md
@docs/IMPLEMENTATION_NOTES.md
"Let's implement the AWS Bedrock service"
```

### Step 3: Confirm Understanding
Always ask Claude to confirm:
- "What are we working on today?"
- "What was completed last time?"
- "What are the next immediate tasks?"

---

## ⚠️ Common Mistakes to Avoid

### Mistake 1: Starting Without Context
❌ **Wrong:**
```
"Help me add a new feature to the system"
```

✅ **Right:**
```
@CLAUDE.md
@docs/CURRENT_SPRINT.md
"Let's add the AWS Bedrock integration as planned in our sprint"
```

### Mistake 2: Long Unfocused Sessions
❌ **Wrong:**
- Working for 2+ hours
- Jumping between different features
- Not committing changes

✅ **Right:**
- 45-60 minute focused sessions
- Single feature completion
- Commit after each working session

### Mistake 3: Not Checking Blockers
❌ **Wrong:**
Starting work without checking if there are blockers

✅ **Right:**
```
@context/customer-ai/BLOCKERS.md
"Are there any blockers I should address first?"
```

### Mistake 4: Forgetting to Update Status
❌ **Wrong:**
Ending session without updating documentation

✅ **Right:**
Before ending EVERY session:
1. Update task_status.md
2. Update HANDOFF_NOTES.md
3. Create session summary
4. Commit all changes

---

## 🔄 The Perfect Session Flow

### 1. Session Start (5 minutes)
```bash
# Pull latest changes
git pull

# Check current branch
git branch

# Load context in Claude
@CLAUDE.md
@docs/CURRENT_SPRINT.md
@context/customer-ai/NEXT_STEPS.md
```

### 2. Confirm Task (2 minutes)
```markdown
"Based on the context, today I should work on [task]. 
Is this correct? Are there any blockers?"
```

### 3. Implementation (40-50 minutes)
```markdown
"Let's implement [specific feature]"

# During work:
- Test each component
- Update documentation
- Check for errors
```

### 4. Testing (5-10 minutes)
```bash
npm test
npm run lint
npm run build
```

### 5. Documentation Update (5 minutes)
```markdown
"Update the following:
1. task_status.md - mark completed tasks
2. HANDOFF_NOTES.md - add session summary
3. Any new decisions in DECISIONS_LOG.md"
```

### 6. Commit and Close (5 minutes)
```bash
git add .
git commit -m "session: 2025-01-19 - [what was done]"
git push
```

---

## 📝 What to Document and When

### During Development
- **DECISIONS_LOG.md** - When making architecture choices
- **IMPLEMENTATION_NOTES.md** - When discovering technical details
- **BLOCKERS.md** - When encountering issues

### After Each Task
- **task_status.md** - Mark task complete
- **COMPLETED_WORK.md** - Add to completed list

### End of Session
- **HANDOFF_NOTES.md** - Session summary
- **SESSION_YYYY-MM-DD.md** - Detailed session record

---

## 🚦 Quick Decision Guide

### When to Start a New Session
- Switching to different module
- After 60-90 minutes of work
- When context gets complex (>7 files)
- After completing major feature

### When to Continue Current Session
- Still working on same feature
- Under 60 minutes
- Clear on next steps
- Tests are passing

### When to Stop and Review
- Tests failing unexpectedly
- Unsure about architecture
- Need to check with team
- Budget/cost concerns

---

## 🎭 Different Session Types

### Planning Session (30 minutes)
```markdown
@CLAUDE.md
@AI_CUSTOMER_ANALYTICS_SYSTEM_DESIGN.md
"Let's plan the implementation approach for [feature]"
```
Output: Updated NEXT_STEPS.md

### Coding Session (60 minutes)
```markdown
@CLAUDE.md
@docs/CURRENT_SPRINT.md
@[specific_files_to_modify]
"Let's implement [specific feature]"
```
Output: Working code + tests

### Debugging Session (30 minutes)
```markdown
@CLAUDE.md
@[error_logs]
@[failing_test_file]
"Help me fix this error"
```
Output: Fixed code + understanding

### Review Session (20 minutes)
```markdown
@context/sessions/[last_few_sessions]
@task_status.md
"Let's review progress and plan next steps"
```
Output: Updated documentation

---

## 💡 Pro Tips

### 1. Use Clear Prompts
Instead of: "Fix the code"
Use: "Fix the AWS Bedrock authentication error in bedrock.service.ts"

### 2. Batch Related Tasks
Instead of: Multiple sessions for small fixes
Use: One session for all related API endpoints

### 3. Test Before Moving On
Instead of: Implementing everything then testing
Use: Test each component as you build

### 4. Keep Sessions Atomic
Each session should:
- Complete something
- Be able to stand alone
- Not leave work half-done

### 5. Use Feature Branches
```bash
# For each major feature
git checkout -b feature/ai-bedrock-integration

# After completion
git merge main
git checkout main
git merge feature/ai-bedrock-integration
```

---

## 🔴 Emergency Recovery

### If Context is Lost:
```markdown
@CLAUDE.md
@task_status.md
@context/sessions/[last_3_sessions].md
@docs/HANDOFF_NOTES.md
"Summarize the current state and what should be done next"
```

### If Work is Unclear:
```markdown
@AI_CUSTOMER_ANALYTICS_SYSTEM_DESIGN.md
@docs/CURRENT_SPRINT.md
"What is the current implementation priority?"
```

### If Tests are Failing:
```markdown
@docs/IMPLEMENTATION_NOTES.md
@context/customer-ai/BLOCKERS.md
"Review the test strategy and common issues"
```

---

## 📊 Success Metrics

### You're Doing It Right When:
- ✅ Each session completes a specific task
- ✅ Documentation is always current
- ✅ No context is lost between sessions
- ✅ Tests pass before committing
- ✅ Clear handoff for next session
- ✅ Can resume work after days/weeks

### You Need to Improve When:
- ❌ Asking "what were we doing?"
- ❌ Redoing work from previous sessions
- ❌ Sessions exceed 90 minutes
- ❌ Documentation is outdated
- ❌ Commits have vague messages
- ❌ Tests failing in production

---

## 🎯 Quick Reference Card

### Starting Commands:
```bash
git pull
git checkout feature/customer-ai-analytics
```

### Context Loading Priority:
1. **Always**: CLAUDE.md
2. **Usually**: CURRENT_SPRINT.md
3. **Task-specific**: NEXT_STEPS.md or specific files
4. **If needed**: BLOCKERS.md, IMPLEMENTATION_NOTES.md

### Ending Commands:
```bash
npm test
git add .
git commit -m "session: [date] - [summary]"
git push
```

### Documentation Updates:
1. task_status.md - Task progress
2. HANDOFF_NOTES.md - Session summary
3. SESSION_YYYY-MM-DD.md - Detailed record

---

## 🚀 Your Next Session Checklist

Before starting:
- [ ] Clear goal for session
- [ ] Correct branch checked out
- [ ] Context files identified

During session:
- [ ] Focused on single module
- [ ] Testing as you go
- [ ] Documenting decisions

Before ending:
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Changes committed
- [ ] Handoff notes written

---

## Remember: The System Works When You Work The System

The documentation structure is only as good as your discipline in using it. Follow these guidelines, and you'll have:
- Zero context loss
- Professional code quality
- Smooth team collaboration
- Efficient development cycles

**When in doubt**: Load more context, not less. Ask Claude to confirm understanding. Document everything.