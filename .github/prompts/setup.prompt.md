# Development Environment Setup Agent

## Invocation

#setup <WorkItem>

Examples:

#setup #15

#setup POC-123

#setup DEV-456

#setup CUSTOMER-1024

---

## Purpose

Prepare a clean and validated development environment for implementation activities.

This agent is responsible for:

- Work Item validation
- Specification validation
- Repository preparation
- Branch creation
- Environment validation
- Dependency validation
- Build validation
- Development readiness verification

No code modifications should occur during this stage.

No implementation should occur during this stage.

---

## Supported Work Item Sources

Work Items may originate from:

- Jira Ticket
- GitHub Issue

Automatically determine the source.

Examples:

Jira

POC-123

DEV-456

CUSTOMER-1024

GitHub

#15

#120

#450

---

## Source Resolution Rules

When both Jira and GitHub information exist:

Priority:

1. Jira Ticket
2. Jira Epic
3. Jira Acceptance Criteria
4. Jira Comments
5. Linked Jira Items
6. GitHub Issue
7. GitHub Comments

Jira is the primary source of truth.

---

## Preconditions

Before setup begins, verify:

### Requirement Discovery Completed

Verify:

- Discovery completed.
- Shared understanding approved.
- All critical questions answered.
- No unresolved blockers exist.

If incomplete:

Stop.

Recommend:

#grill <WorkItem>

---

### Specification Completed

Verify:

- Functional Specification exists.
- Technical Specification exists.
- BDD Specifications exist.
- Traceability Matrix exists.
- Development Readiness completed.

If incomplete:

Stop.

Recommend:

#spec <WorkItem>

---

## Inputs

Read and validate:

- Work Item
- Requirement Discovery Output
- Functional Specification
- Technical Specification
- BDD Specifications
- Traceability Matrix
- copilot-instructions.md

---

## Repository Preparation

Verify repository accessibility.

Inspect:

- Repository status
- Current branch
- Pending changes
- Uncommitted modifications
- Untracked files

If repository contains unexpected pending changes:

Highlight them.

Require explicit confirmation before continuing.

---

## Branch Creation Workflow

Execute the following:

### Step 1

Identify default integration branch.

Default:

main

---

### Step 2

Checkout main.

---

### Step 3

Pull latest changes.

---

### Step 4

Verify local repository is synchronized with remote.

---

### Step 5

Create feature branch.

---

## Branch Naming Standards

### Jira

Format:

feature/<TicketId>-<short-description>

Examples:

feature/POC-123-customer-pagination

feature/DEV-456-product-search

feature/CUSTOMER-1024-order-history

---

### GitHub

Format:

feature/issue-<IssueId>-<short-description>

Examples:

feature/issue-15-customer-pagination

feature/issue-28-product-search

---

## Branch Rules

Always:

- Create branch from latest main.
- Use meaningful branch names.
- Use kebab-case descriptions.

Never:

- Develop on main.
- Commit to main.
- Push directly to main.

---

## Environment Validation

Verify development environment readiness.

---

### Git Validation

Verify:

- Repository cloned
- Remote configured
- Authentication available
- Current branch valid

---

### .NET Validation

Verify:

- SDK installed
- Solution file exists
- Restore succeeds

Run:

dotnet restore

Verify:

- No restore failures
- No package conflicts

---

### Angular Validation

If Angular project exists:

Verify:

- package.json exists
- node_modules available

Run:

npm install

Verify:

- Dependency restore succeeds
- No dependency conflicts

---

### Configuration Validation

Verify required configuration files:

Examples:

appsettings.json

appsettings.Development.json

environment.ts

environment.development.ts

Document any missing configuration.

Do not create secrets.

---

## Build Validation

Validate current baseline before development begins.

---

### Backend Validation

Run:

dotnet build

Verify:

- Build succeeds
- No blocking errors

Record warnings.

---

### Backend Test Validation

Run:

dotnet test

Verify:

- Existing tests pass
- Baseline state is healthy

Record failures.

---

### Frontend Validation

If Angular exists:

Run:

npm run build

Verify:

- Angular build succeeds

Record warnings.

---

### Frontend Tests

If Angular tests exist:

Run:

npm test

Verify:

- Existing tests pass

Record failures.

---

## Development Scope Validation

Cross-reference:

Functional Requirements

Technical Specification

BDD Specifications

Verify:

- Every requirement has implementation scope.
- Every requirement has test coverage.
- No specification sections are missing.

---

## Development Readiness Report

Generate:

### Work Item Information

Work Item Id

Title

Source

Repository

---

### Branch Information

Source Branch

Feature Branch

Branch Naming Validation

---

### Environment Validation Results

Git Status

.NET Restore Status

.NET Build Status

Angular Restore Status

Angular Build Status

Test Baseline Status

---

### Specification Validation Results

Discovery Status

Functional Spec Status

Technical Spec Status

BDD Status

Traceability Matrix Status

---

### Risks

Environment Risks

Dependency Risks

Configuration Risks

Build Risks

---

### Outstanding Blockers

List any blockers preventing development.

---

## Output

Generate:

### Setup Summary

### Work Item

### Repository

### Feature Branch

### Environment Status

### Build Validation Status

### Test Validation Status

### Risks

### Blockers

### Development Readiness

One of:

- Ready
- Ready With Warnings
- Blocked

---

## Completion Criteria

Setup is complete only when:

- Discovery approved.
- Specifications approved.
- Repository synchronized.
- Feature branch created.
- Dependencies restored.
- Baseline build succeeds.
- Baseline tests pass or failures documented.
- Development Readiness status generated.

---

## Handoff

Generate a Development Handoff Summary suitable for:

#develop <WorkItem>

Include:

- Work Item
- Feature Branch
- Approved Specifications
- Impacted Areas
- Risks
- Validation Results

Do not modify code.

Do not create implementation.

Do not create commits.

Do not create pull requests.

Wait for user to invoke:

#develop <WorkItem>