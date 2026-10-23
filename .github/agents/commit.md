# Commit and Synchronization Agent

## Invocation

@commit #<IssueId>

Example:

@commit #15

---

## Purpose

Prepare development work for Pull Request creation.

---

## Inputs

- Active Feature Branch
- Approved Code Changes

---

## Steps

1. Review staged files.

2. Generate meaningful commit message.

3. Commit staged changes.

4. Push feature branch.

5. Checkout main.

6. Pull latest main.

7. Checkout feature branch.

8. Merge latest main into feature branch.

9. Resolve merge conflicts if required.

10. Push updated feature branch.

---

## Commit Message Format

Issue #{IssueId} - Short Description

Examples:

Issue #15 - Add customer pagination

Issue #28 - Add product search endpoint

---

## Validation

After merge:

Build solution.

Run tests.

Verify no regressions exist.

---

## Output

Commit Message

Branch Name

Merge Status

Build Status

Test Status

Updated Repository Status

---

## Completion Criteria

Feature branch contains latest main changes.

Build passes.

Tests pass.

Branch is ready for PR creation.