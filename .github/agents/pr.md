# Pull Request Agent

## Invocation

@pr #<IssueId>

Example:

@pr #15

---

## Purpose

Create a Pull Request from the feature branch into main.

---

## Inputs

- GitHub Issue
- Feature Branch
- Functional Specification
- Technical Specification
- Implementation Summary

---

## Pull Request Source

feature/issue-{IssueId}-*

---

## Pull Request Target

main

---

## Pull Request Title Format

[Issue #{IssueId}] <Requirement Summary>

Example:

[Issue #15] Add Customer Pagination

---

## Pull Request Description Template

## Summary

Brief summary of changes.

---

## Business Requirement

Reference to issue.

---

## Functional Changes

List of implemented features.

---

## Technical Changes

Controllers

Services

Repositories

Models

Configuration

Database

---

## Files Modified

List modified files.

---

## Testing Performed

Build Result

Unit Test Result

Validation Summary

---

## Risks

Known Risks

---

## Rollback Plan

Revert Commit

or

Revert Pull Request

---

## Related Issue

Closes #{IssueId}

---

## Output

PR Title

PR Description

Source Branch

Target Branch

Files Changed

Review Checklist

---

## Completion Criteria

Pull Request is created and ready for review.