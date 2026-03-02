---
title: "One of AI Coding's Stumbling Blocks: The Problem of Implicit Contracts in Programs"
date: 2026-03-02 14:00:00
tags:
  - AI Programming
  - Software Development
  - Code Quality
  - English
categories:
  - English
cover: 
description: An in-depth exploration of implicit contract problems in AI programming, analyzing their root causes through multiple examples and proposing practical solutions.
lang: en
---

# One of AI Coding's Stumbling Blocks: The Problem of Implicit Contracts in Programs

![Implicit Contracts Illustration](https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)

## Introduction: When AI Meets "Unspoken" Rules

Recently, while experimenting with AI assistants for code generation, I've noticed an interesting phenomenon: some code looks perfect—clear logic, correct syntax—but simply doesn't work as expected. Upon deeper analysis, I found that the root cause often lies not in the code itself, but in those **implicit contracts that are never explicitly written down yet are crucial for program execution**.

These implicit contracts are like the "unwritten rules" of software development—human developers understand them through experience and context, but AI often stumbles when encountering these rules.

## What Are Implicit Contracts?

Implicit contracts refer to assumptions, conventions, and expectations that are not explicitly stated in code or documentation but are essential for correct program operation. They typically include:

1. **Performance expectations**: How long a function should take to complete
2. **Resource usage**: How much memory, CPU, or network bandwidth a function will consume
3. **Side effects**: Which external states a function will modify
4. **Error handling**: Under what conditions a function should throw exceptions vs. handle silently
5. **Concurrency safety**: Whether a function can be safely called in a multithreaded environment

## Case Studies: Implicit Contract Traps in AI Programming

### Case 1: The "Reasonable" Timeout for File Reading

```python
# AI-generated code
def read_large_file(file_path):
    with open(file_path, 'r') as f:
        return f.read()
```

**Problem**: This code works fine for small files, but for a 10GB file, it will exhaust memory and crash the program. Human developers would realize the need for chunked reading or streaming, but AI only sees the explicit requirement to "read a file."

**Implicit contract**: Read operations should complete within a reasonable time and not exhaust system resources.

### Case 2: The "Polite" Retry for API Calls

```javascript
// AI-generated API call code
async function fetchUserData(userId) {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
}
```

**Problem**: Network requests can fail, but the code has no retry mechanism. Human developers know networks are unreliable and typically add retry logic, timeout handling, and error fallbacks.

**Implicit contract**: Network operations should be resilient and handle temporary failures.

### Case 3: The "Consistency" Guarantee for Cache Updates

```java
// AI-generated cache update code
public void updateUserCache(User user) {
    cache.put(user.getId(), user);
    database.update(user);
}
```

**Problem**: If the database update fails, the cache already contains inconsistent data. Human developers would use transactions or two-phase commits to ensure consistency.

**Implicit contract**: Data update operations should maintain system state consistency.

## The Roots of Implicit Contracts: Why Are They So Prevalent?

### 1. Historical Legacy and Established Conventions

Many implicit contracts originate from historical reasons. For example, Unix command-line tools follow the principle of "silent success, verbose failure"—a principle never explicitly stated in man pages but known to all experienced developers.

### 2. Trade-offs Between Performance and Conciseness

Explicitly writing all contracts would make code verbose. For instance, adding performance guarantee comments to every function is impractical:

```python
# If every function were written like this...
def process_data(data):
    """
    Process data.
    
    Performance contract:
    - Time complexity: O(n log n)
    - Space complexity: O(n)
    - Maximum input size: 10,000 records
    - Expected execution time: < 2 seconds (on standard hardware)
    
    Side effect contract:
    - Will not modify input data
    - Will write to log file
    - May send metrics to monitoring system
    
    Error contract:
    - Returns empty list for empty input
    - Raises ValueError for malformed data
    - Raises MemoryError for insufficient memory
    """
    # Actual implementation...
```

### 3. Lack of Domain Knowledge

AI lacks domain-specific expertise. Fields like medical software, financial systems, and aerospace controls have numerous domain-specific implicit contracts typically accumulated through years of experience.

### 4. Context Dependence

Many contracts depend on specific usage contexts. The same function may have completely different performance expectations in batch processing systems versus real-time systems.

## Specific Problems Caused by Implicit Contracts

### 1. Difficult Debugging

When implicit contracts are violated, error messages are often unclear. Programs may simply "run slowly" or "crash occasionally" rather than throwing clear exceptions.

### 2. Integration Issues

Different teams or systems may have different implicit contracts for the same concept, leading to subtle incompatibilities during integration.

### 3. Accumulation of Technical Debt

Over time, undocumented implicit contracts become "tribal knowledge"—known only to a few senior employees, while new hires and AI assistants repeatedly encounter the same pitfalls.

### 4. Hindrance to Automation

Implicit contracts are significant obstacles to automated testing, static analysis, and AI code generation. If rules aren't explicit, machines cannot reliably verify or generate code.

## Solutions: Making Implicit Contracts Explicit

### 1. Contract-First Design

Define function contracts explicitly before writing implementations. This can be achieved in various forms:

```python
from typing import Protocol
from dataclasses import dataclass

@dataclass
class PerformanceContract:
    max_time_ms: int
    max_memory_mb: int
    thread_safe: bool

class DataProcessor(Protocol):
    performance: PerformanceContract
    
    def process(self, data: list) -> list:
        """
        Contract:
        1. Will not modify input data
        2. Time complexity O(n log n)
        3. Returns empty list for empty input
        """
        ...
```

### 2. Using Contract Programming Frameworks

Leverage existing contract programming tools like Python's `icontract`, Java's `Contracts for Java`, or Eiffel's built-in contract support:

```python
import icontract

@icontract.require(lambda x: x > 0, "Input must be positive")
@icontract.ensure(lambda result: result > 0, "Result must be positive")
@icontract.snapshot(lambda x: x, "Save original value")
def calculate_square_root(x: float) -> float:
    # Implementation must satisfy pre- and post-conditions
    return x ** 0.5
```

### 3. Enhanced API Documentation

Explicitly list all implicit contracts in documentation using standardized templates:

```markdown
## Performance Characteristics
- **Time complexity**: O(n)
- **Space complexity**: O(1)
- **Thread safety**: Yes

## Side Effects
- Modifies global configuration
- Writes to log file

## Error Handling
- Raises `ValueError` for invalid input
- Raises `RuntimeError` for insufficient resources
```

### 4. Runtime Contract Checking

Enable contract checking in development and testing environments, disable in production for performance:

```python
class ContractAwareProcessor:
    def __init__(self, debug=False):
        self.debug = debug
    
    def process(self, data):
        if self.debug:
            self._check_preconditions(data)
        
        result = self._actual_process(data)
        
        if self.debug:
            self._check_postconditions(data, result)
        
        return result
```

### 5. AI-Friendly Code Annotations

Provide specialized annotations to help AI assistants understand implicit contracts:

```python
# @ai-contract: This function handles user input and is performance-sensitive
# @ai-expectation: Should complete within 100ms
# @ai-side-effect: Will update user status in database
# @ai-error-case: Retry 3 times on network timeout
def handle_user_request(request):
    # Implementation...
```

## Future-Oriented Thinking

### 1. Contracts as First-Class Citizens

Future programming languages might treat contracts as first-class citizens, similar to type systems. Compilers could statically check contracts, and IDEs could provide better support.

### 2. AI-Understandable Contract Languages

We need to develop contract description languages that are both human-friendly and AI-parsable, capable of expressing complex constraints and expectations.

### 3. Contract Learning and Inference

AI systems could analyze large codebases to automatically learn and infer common implicit contracts, suggesting their explicit formalization.

### 4. Contract-Driven Code Generation

Future AI code generators could take contracts as input and generate implementations satisfying all constraints.

## Practical Recommendations

### For Developers:

1. **Identify critical contracts**: During code reviews, pay special attention to functions that may contain implicit contracts
2. **Gradual explicitization**: Don't try to document all contracts at once; start with the most critical ones
3. **Establish a contract culture**: Promote contract-first thinking within your team
4. **Leverage tools**: Use static analysis tools to detect potential contract violations

### For AI Prompt Engineers:

1. **Explicitly express expectations**: In prompts, specify not just "what to do" but also "under what constraints"
2. **Provide context**: Tell AI about the environment where code will run and performance requirements
3. **Require contract annotations**: Ask AI-generated code to include explicit contract comments
4. **Test boundary conditions**: Specifically test edge cases that might violate implicit contracts

## Conclusion: The Evolution from Implicit to Explicit

The problem of implicit contracts is an inevitable stage in the maturation of AI programming. Just as software engineering evolved from "writing code" to "designing systems," from "it runs" to "it's maintainable," we're now experiencing the evolution from "implicit understanding" to "explicit expression."

Solving implicit contract problems isn't just about making AI better at programming—it's about making all software more reliable, maintainable, and understandable. In this process, we're not only teaching AI how to program but also teaching ourselves how to better express intent, manage complexity, and build robust systems.

Ultimately, explicit contracts will become crucial bridges connecting human intent, machine understanding, and code implementation. When these bridges are built, AI programming can truly evolve from "assistant tool" to "reliable partner."

---

**Food for thought**: What important implicit contracts exist in your projects? If AI were to maintain your code, which contracts would most need to be made explicit?

**Further reading**:
1. *Design Patterns: Elements of Reusable Object-Oriented Software* - Patterns themselves are a form of high-level contracts
2. *Code Complete* - A comprehensive guide to software construction
3. *Refactoring: Improving the Design of Existing Code* - How to safely modify code without violating contracts