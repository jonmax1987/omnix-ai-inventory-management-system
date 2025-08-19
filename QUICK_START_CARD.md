# 🚀 Quick Start Reference Card

## Session Start - Copy & Paste Templates

### 🎯 Template 1: Continue AI Development
```markdown
@CLAUDE.md
@docs/CURRENT_SPRINT.md
@context/customer-ai/NEXT_STEPS.md
@context/customer-ai/BLOCKERS.md
"Let's continue implementing AWS Bedrock integration for customer AI"
```

### 🔧 Template 2: Fix Something
```markdown
@CLAUDE.md
@docs/HANDOFF_NOTES.md
@[specific_error_file]
"Help me fix [specific issue description]"
```

### 📋 Template 3: Review Progress
```markdown
@task_status.md
@context/sessions/SESSION_2025-01-19.md
@docs/CURRENT_SPRINT.md
"Review what's been completed and what's next"
```

### 🏗️ Template 4: Start New Feature
```markdown
@CLAUDE.md
@AI_CUSTOMER_ANALYTICS_SYSTEM_DESIGN.md
@docs/CURRENT_SPRINT.md
"Let's implement [new feature] based on the design"
```

---

## ⏱️ Session Time Limits

| Task Type | Max Time | Files to Load |
|-----------|----------|---------------|
| 🐛 Bug Fix | 30 min | 2-3 files |
| ✨ New Feature | 60 min | 4-5 files |
| 📝 Planning | 45 min | 3-4 files |
| 🔍 Code Review | 20 min | 3-4 files |
| 📚 Documentation | 30 min | 2-3 files |

**STOP SESSION IF:**
- Been working >90 minutes
- Loaded >7 files
- Switching modules
- Getting confused

---

## 📁 File Quick Reference

### Core Context Files
```
CLAUDE.md                          # Always load first
docs/CURRENT_SPRINT.md            # Current work focus
context/customer-ai/NEXT_STEPS.md # Immediate tasks
docs/HANDOFF_NOTES.md             # Last session summary
```

### When You Need Details
```
AI_CUSTOMER_ANALYTICS_SYSTEM_DESIGN.md  # Full system design
docs/IMPLEMENTATION_NOTES.md            # Technical details
context/customer-ai/BLOCKERS.md         # Current issues
docs/DECISIONS_LOG.md                   # Why decisions were made
```

### Progress Tracking
```
task_status.md                          # Master task list
context/customer-ai/COMPLETED_WORK.md   # What's done
context/customer-ai/PHASE_STATUS.md     # Current phase
context/sessions/SESSION_*.md           # Session history
```

---

## 🎯 Do's and Don'ts

### ✅ DO:
```bash
# Start every session with:
git pull
git status

# End every session with:
git add .
git commit -m "session: 2025-01-19 - AWS Bedrock integration"
git push
```

### ❌ DON'T:
- Start coding without context
- Work on multiple modules
- Leave session without committing
- Exceed 90 minutes
- Skip documentation updates

---

## 🔥 Emergency Commands

### Lost? Start here:
```markdown
@CLAUDE.md
@docs/HANDOFF_NOTES.md
@task_status.md
"What's the current state and what should I work on?"
```

### Tests failing?
```bash
npm test -- --verbose
npm run lint
cat docs/IMPLEMENTATION_NOTES.md | grep -A5 "Test"
```

### Need to rollback?
```bash
git stash
git checkout main
git pull
git checkout -b feature/fresh-start
```

---

## 📝 Commit Message Format

```bash
# Feature implementation
git commit -m "feat(customer-ai): implement AWS Bedrock service integration"

# Bug fix
git commit -m "fix(api): resolve CORS issue in Lambda responses"

# Session work
git commit -m "session: 2025-01-19 - AWS Bedrock integration progress

- Implemented BedrockAnalysisService
- Added purchase pattern analysis
- Created AI prompt templates
- Updated documentation

Next: Complete error handling and testing"

# Documentation
git commit -m "docs: update customer AI implementation notes"
```

---

## 🎨 Quick Decision Tree

```
Need to code?
├─ Yes → Load CURRENT_SPRINT.md + NEXT_STEPS.md
│   ├─ New feature? → Add AI_SYSTEM_DESIGN.md
│   └─ Bug fix? → Add specific error files
└─ No → Planning/Review?
    ├─ Planning → Load AI_SYSTEM_DESIGN.md
    └─ Review → Load task_status.md + SESSION files
```

---

## 📊 End of Session Checklist

**MUST DO:**
- [ ] Update task_status.md
- [ ] Update HANDOFF_NOTES.md
- [ ] Commit all changes
- [ ] Push to remote

**SHOULD DO:**
- [ ] Run tests
- [ ] Update DECISIONS_LOG.md if made choices
- [ ] Note any blockers
- [ ] Plan next session tasks

---

## 🚦 Health Check

### Green Light (Keep Going):
- Tests passing ✅
- Clear on task ✅
- Under 60 minutes ✅
- Same module ✅

### Yellow Light (Wrap Up Soon):
- At 45-60 minutes ⚠️
- Task 80% complete ⚠️
- Need clarification ⚠️

### Red Light (Stop Now):
- Over 90 minutes 🛑
- Switching modules 🛑
- Major confusion 🛑
- Tests broken everywhere 🛑

---

## 💬 Magic Phrases

### To Start:
"Let's continue with [task] from the sprint"

### To Clarify:
"Confirm my understanding: we're implementing [feature] using [approach]"

### To Test:
"Run tests and fix any issues"

### To Document:
"Update task status and create session summary"

### To End:
"Prepare handoff notes for next session"

---

## 📍 Current Status (Update This!)

**Active Branch**: `feature/customer-ai-analytics`
**Current Phase**: Phase 2 - AI Integration
**Next Task**: AWS Bedrock service implementation
**Blocker**: Need AWS Bedrock credentials

---

## Remember: 45-60 minutes of focused work > 3 hours of confusion

Print this card and keep it handy! 🎯