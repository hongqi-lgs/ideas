---
title: "AI Coding Today: Steam Engines Pulling Carriages"
date: 2026-03-05 11:30:00
tags:
  - AI
  - Programming
  - Technology
  - English
categories:
  - English
lang: en
description: We use AI to generate code, but still rely on project structures, dependency management, and testing methods from a century ago. This isn't a revolution—it's a steam engine pulling a carriage.
---

## A Real Scenario

Yesterday, I asked Cursor to refactor a Node.js project. It quickly delivered beautiful code: decoupled logic, optimized performance, and added type annotations.

Then I spent two hours:
- Manually adjusting 40+ `import` paths
- Re-running unit tests (because the AI didn't know I used Jest vs. Mocha)
- Resolving three version conflicts (AI used new APIs, but my dependencies were old)
- Rewriting the README (AI-generated docs weren't usable)

AI wrote the code in 3 minutes. I spent 2 hours cleaning up.

This reminded me of a story from history class: in the early 19th century, the British invented steam locomotives, but railways weren't widespread yet. So what did they do? They mounted steam engines on horse carriages.

The result? Carriage wheels couldn't handle the engine's weight, roads got destroyed, and the turning radius was worse than horses.

**That's AI Coding today: 2025 AI pulling a 1995 carriage.**

---

## What Are Our "Carriages"?

### 1. File Systems: AI's Nightmare

AI generates code fast, but it doesn't know:
- Does your project use `src/` or `lib/`?
- Are utility functions in `utils/` or `helpers/`?
- Is the config file named `config.js` or `settings.json`?

Every time AI generates code, you have to:
1. Copy code to the correct file
2. Adjust `import` paths
3. Manually merge with existing code

**This isn't AI's fault—it's the file system's.**

File systems were designed for humans in the 1960s: when you see `src/components/Button.tsx`, your brain instantly knows it's a button component.

But AI just sees a string. It doesn't know if `Button.tsx` and `button.tsx` are the same file (they're not on Linux, but are on Windows).

### 2. Dependency Management: Version Hell

AI gives you this code:

```javascript
import { useQuery } from '@tanstack/react-query'

function UserList() {
  const { data } = useQuery('users', fetchUsers)
  // ...
}
```

Looks fine. But:
- Your project uses React Query v3, this is v4 syntax
- You also have `swr` installed, now you have two data-fetching libraries
- AI doesn't know if you use npm, yarn, or pnpm

You need to:
1. Check `package.json`
2. Upgrade dependencies (or downgrade AI's code)
3. Reinstall
4. Pray there are no breaking changes

**Dependency management was designed for manual coding**, assuming humans carefully read changelogs and upgrade dependencies one by one. AI generates code 100× faster than humans, but dependency management is still stuck in 2010.

### 3. Testing: AI Doesn't Know What You're Testing

AI finishes the code, you ask: "Write tests for this."

It generates:

```javascript
describe('Calculator', () => {
  it('should add two numbers', () => {
    expect(add(1, 2)).toBe(3)
  })
})
```

But:
- You use Vitest, not Jest (syntax is similar, but imports differ)
- Your project convention: tests go in `__tests__/` directory, not `.test.js` suffix
- Your CI requires >80% coverage, AI only tested the simplest case

**Testing systems assume you "write tests after code"**, but AI Coding's rhythm is "generate and test simultaneously." We need real-time validation, not post-hoc homework.

### 4. Git: AI Doesn't Understand Your Commit Conventions

AI modified 10 files, now you need to commit.

But your team's convention:
- Commit messages must start with `feat:` / `fix:`
- Each commit changes only one feature
- Must link to Jira tickets

AI doesn't know this. It just modifies code, doesn't care how you commit.

You either manually split commits (time-consuming) or do one big commit (get yelled at in code review).

---

## Why Is This Happening?

Because our development toolchain was designed for **manual human programming**:

| Traditional Assumption | AI Coding Reality |
|----------------------|------------------|
| Programmers write line by line | AI generates hundreds of lines at once |
| Read existing code before modifying | AI only sees context window (limited) |
| Understand overall project structure | AI has limited architectural understanding |
| Remember previous modifications | AI restarts with each conversation |
| Write slowly, test slowly | AI generates fast, humans clean up slowly |

**We're running a 21st-century engine on 20th-century roads.**

---

## What Would True AI-Native Development Look Like?

### 1. Ditch File Systems, Embrace Knowledge Graphs

Instead of `src/utils/formatDate.js`, use:

```
Knowledge Graph:
- [Function: formatDate]
  - Type: utility function
  - Dependencies: [dayjs]
  - Used by: [UserProfile, OrderList]
```

AI doesn't need to remember paths, it just needs to know: "`formatDate` is a utility function, depends on dayjs, used in UserProfile."

File systems are just **serialized forms** of knowledge graphs (so Git can track them), but shouldn't be the primary interface for developers and AI.

### 2. Declarative Dependencies

Instead of `package.json`, use:

```yaml
I need:
  - Data fetching: fast, supports caching, TypeScript-friendly
  - State management: simple, minimal boilerplate

AI recommends:
  - TanStack Query v5 (meets your needs)
  - Version compatibility handled
  - TypeScript configured
```

AI selects dependencies based on your **intent**, not you manually searching, comparing, installing, configuring.

### 3. Real-Time Validation Over Unit Tests

Instead of writing `add.test.js`, use:

```
Real-time constraints:
  - add(1, 2) must equal 3
  - add(negative numbers) must have defined behavior
  - Performance: 1000 calls < 10ms
```

AI **checks these constraints in real-time** while generating code, not generate code → write tests → run tests → fail → fix code.

### 4. AI Manages Version Control Directly

Instead of manual commits, use:

```
AI:
  - Feature: add user search
  - Files affected: 3
  - Linked to: JIRA-1234
  - Risk: medium (modified core query logic)
  - Suggestion: deploy to staging first
```

AI auto-generates compliant commit messages, auto-splits commits, auto-links issues.

---

## How Far Are We from AI-Native?

**Technically: 3-5 years.**

There are already early attempts:
- Replit's Agent: you don't manage file paths, the Agent finds them
- val.town: code lives in the cloud, dependencies auto-handled
- Cursor's Composer: can edit multiple files simultaneously

But these are "better carriages," not trains.

**What does a real train need?**
1. **New project organization** (not file systems)
2. **New dependency management** (not package.json)
3. **New validation mechanisms** (not unit tests)
4. **New collaboration methods** (not Git + PR)

This requires **rebuilding the entire ecosystem**, not something a single AI editor can solve alone.

---

## What Can We Do Now?

Before the new ecosystem matures, we can:

### 1. Establish AI-Friendly Project Conventions

**Bad:**
```
project/
  src/
    components/
    utils/
    pages/
    hooks/
```

**Better:**
```
project/
  README.AI.md  # Tell AI about structure, conventions, gotchas
  src/
    Each directory has README.md explaining its purpose
```

### 2. Reduce Implicit Conventions

**Bad:**
"Our team convention: utils only contain pure functions" (AI doesn't know)

**Better:**
Enforce in ESLint rules: `utils/` directory forbids side effects

### 3. Use Tools to Enforce Standards

- Commit messages → commitlint
- Code formatting → prettier
- Import order → eslint-plugin-import

AI isn't good at remembering implicit rules, but tools can enforce them.

### 4. Accept "Imperfection"

AI-generated code won't be 100% in your style. Instead of spending time tweaking formatting, focus on logical correctness.

**Perfection is the enemy of good code.**

---

## Conclusion

The era of steam engines pulling carriages didn't last long. Soon, people realized: to harness the power of steam engines, they needed railways, train stations, signaling systems—an entire new infrastructure.

AI Coding is the same.

Right now we use AI to generate code, then manually adjust paths, fix dependencies, write tests, split commits. It's inefficient, but it's a necessary transition period.

**The real revolution isn't better AI models, but entirely new development infrastructure designed for AI.**

When that happens, developers won't "write code" anymore. They'll "define intent, validate results, make architectural decisions."

Code generation, testing, deployment—those are AI's job.

We're standing at this turning point.

The steam engine is already mounted on the carriage. Can the railway be far behind?
