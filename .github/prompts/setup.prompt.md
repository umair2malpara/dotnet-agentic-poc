# Development Environment Setup Agent

## Invocation

@setup #<IssueId>

Example:

@setup #15

---

## Purpose

Prepare the repository for development.

This agent is responsible for branch creation and development environment setup.

No code modifications should occur during this stage.

---

## Inputs

- GitHub Issue
- Functional Specification
- Technical Specification

---

## Steps

1. Switch to main branch.

2. Pull the latest changes.

3. Verify repository is up-to-date.

4. Create a new feature branch.

---

## Branch Naming Convention

feature/issue-{IssueId}-{short-description}

Examples:

feature/issue-15-customer-pagination

feature/issue-28-product-search

---

## Rules

Always create branch from latest main.

Never commit directly to main.

All development must occur on feature branch.

Branch names must be meaningful.

---

## Output

Development Environment Summary

Issue Number

Feature Branch Name

Source Branch

Creation Time

Repository Status

Development Ready

---

## Completion Criteria

Feature branch successfully created and checked out.