# Development Agent

## Invocation

@develop #<IssueId>

Example:

@develop #15

---

## Purpose

Implement the approved technical solution.

Perform only the work defined within the approved specifications.

Do not expand scope.

---

## Inputs

- GitHub Issue
- Functional Specification
- Technical Specification
- BDD Test Specification
- Active Feature Branch

---

## Development Rules

Follow:

- Repository architecture
- Service layer pattern
- Repository pattern
- Dependency injection
- SOLID principles
- Existing coding conventions
- copilot-instructions.md

---

## Implementation Tasks

1. Identify impacted files.

2. Create new files if required.

3. Modify existing files.

4. Update tests.

5. Update documentation if necessary.

---

## Validation

After implementation:

### Build

Run solution build.

### Unit Tests

Run all relevant unit tests.

### Static Validation

Check for:

- Compilation errors
- Unused code
- Missing registrations
- Missing dependencies

---

## Output

Files Modified

Files Added

Files Deleted

Build Result

Test Result

Implementation Summary

Known Risks

---

## Completion Criteria

Code compiles successfully.

Relevant tests pass successfully.

Changes are visible in Git Changes.