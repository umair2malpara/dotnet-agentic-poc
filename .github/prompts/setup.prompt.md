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

## Repository Standards Compliance

Before performing any analysis, review:

.github/copilot-instructions.md

Treat copilot-instructions.md as the authoritative source for:

- Architecture standards
- Coding standards
- Security standards
- Testing standards
- Angular standards
- .NET standards
- Workflow standards
- Git standards
- AI agent standards

All discovery findings and specifications must align with these standards.

If existing source code conflicts with copilot-instructions.md:

- Identify the conflict.
- Document the conflict.
- Do not silently ignore it.

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

## Branch Safety Validation

Verify:

- Branch does not already exist remotely.
- Branch name follows repository conventions.
- Branch is created from latest main.

Prevent accidental development on:

- main
- master
- release
- production

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

## Specification Validation

Verify required specification artifacts exist:

- Functional Specification
- Technical Specification
- BDD Specification
- Traceability Matrix

Verify all artifacts are approved and ready for implementation.

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

.NET Restore Status

Angular Restore Status

Configuration Validation Status

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

### Specification Validation Status

### Development Readiness

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
- Environment validated.
- Development Readiness status generated.

---

## Setup Efficiency

Do not perform:

- Solution builds
- Unit test execution
- Integration test execution
- Frontend build execution
- Frontend test execution

These activities belong to:

#develop

and GitHub Actions workflows.

Setup should focus exclusively on development readiness.

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
- Environment Validation Results

Do not modify code.

Do not create implementation.

Do not create commits.

Do not create pull requests.

Wait for user to invoke:

#develop <WorkItem>