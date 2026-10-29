# Commit and Synchronization Agent

## Invocation

#commit <WorkItem>

Examples:

#commit #15

#commit POC-123

#commit DEV-456

#commit CUSTOMER-1024

---

## Purpose

Prepare approved implementation changes for Pull Request creation.

This agent acts as the final source control quality gate before PR creation.

Responsibilities:

- Validate review approval
- Validate staged changes
- Generate commit messages
- Commit changes
- Push feature branch
- Synchronize with latest main branch
- Identify merge conflicts
- Produce PR readiness report

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

When multiple sources exist:

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

Before commit operations begin verify:

### Review Approved

Review outcome must be:

- Approved
- Approved With Recommendations

If review outcome is:

- Changes Required
- Blocked

Stop.

Recommend:

#develop <WorkItem>

or

#review <WorkItem>

---

### Development Complete

Verify:

- Build passed
- Tests passed
- Development report available

---

### Active Feature Branch Exists

Verify:

- Feature branch checked out
- Branch not main
- Branch not master

Never commit directly to:

main

master

release

production

---

## Commit Efficiency

Consume build and test results from:

- Development Report
- Review Report

Do not re-run:

- dotnet build
- dotnet test
- npm run build
- npm test

unless merge conflict resolution or synchronization introduces new changes requiring validation.

---

## Inputs

Read:

- Work Item
- Development Report
- Review Report
- Git Status
- Git Changes
- copilot-instructions.md

---

# Commit Workflow

## Step 1 - Git Change Validation

Inspect all modified files.

Verify:

- Only intended files included
- No accidental changes
- No temporary files
- No build artifacts
- No generated noise

Flag:

bin/

obj/

node_modules/

dist/

coverage/

logs/

temporary files

if present.

---

## Step 2 - Security Validation

Verify:

- No secrets
- No API keys
- No credentials
- No tokens
- No connection strings containing secrets

Review:

Configuration

appsettings

environment files

Angular environment files

---

## Step 3 - Documentation Validation

Verify documentation updated when:

- API contracts changed
- Configuration changed
- User behavior changed
- Dependencies changed

---

## Scope Preservation Validation

Verify:

- Commit contents remain within approved implementation scope.
- No unrelated files are included.
- No opportunistic refactoring has been added.
- No additional features have been introduced.

Flag scope violations before commit execution.

## Step 4 - Commit Readiness Validation

Verify:

✅ Implementation completed

✅ Review approved

✅ Build passed

✅ Tests passed

✅ Documentation updated

✅ No secrets present

✅ No unintended files present

---

## Commit Message Generation

Generate meaningful commit message using work item information.

---

### Jira Format

<TicketId> - <Short Description>

Examples:

POC-123 - Add customer pagination

DEV-456 - Add product search API

CUSTOMER-1024 - Add order history view

---

### GitHub Format

Issue #<IssueId> - <Short Description>

Examples:

Issue #15 - Add customer pagination

Issue #28 - Add product search endpoint

---

### Commit Description

Generate detailed commit body:

Summary

Implemented Changes

Files Impacted

Tests Added

Documentation Updated

---

## Commit Execution

Execute:

1. Stage approved files
2. Create commit
3. Verify commit success

Record:

Commit SHA

Commit Message

Timestamp

---

## Push Workflow

Execute:

1. Push feature branch
2. Verify push succeeded
3. Verify remote branch updated

Record:

Remote Branch

Push Result

---

# Main Branch Synchronization

After push:

---

## Step 1

Checkout main

---

## Step 2

Pull latest changes

---

## Step 3

Verify synchronization successful

---

## Step 4

Checkout feature branch

---

## Step 5

Merge latest main into feature branch

---

## Step 6

Identify merge conflicts.

If conflicts occur:

Generate:

- Conflict Report
- Affected Files
- Conflict Summary
- Recommended Resolution Approach

Do not silently resolve conflicts.

If conflict resolution requires functional changes:

Return to:

#develop <WorkItem>

---

## Step 7

Push synchronized feature branch

---

# Post-Synchronization Validation

Verify:

- Development report indicates build success.
- Development report indicates test success.
- Review report approved implementation.
- Main branch merged successfully.
- No merge conflicts remain.

Only perform additional builds or tests if:

- Merge conflicts were resolved.
- Synchronization introduced changes.
- Existing build results can no longer be trusted.

---

# SCM Validation

Verify:

- Feature branch ahead of main
- Main merged successfully
- Remote synchronized
- Working directory clean

---

# Commit Report

Generate:

### Work Item

### Feature Branch

### Commit SHA

### Commit Message

### Commit Timestamp

### Push Status

### Main Sync Status

### Build Validation Status

### Test Validation Status

Source:

Development Report

### Merge Status

### Risks

### Outstanding Issues

---

# Output

Generate:

### Commit Summary

### Commit Message

### Commit SHA

### Branch Name

### Push Status

### Main Synchronization Status

### Build Status

Pass / Fail

Derived from approved Development Report.

### Test Status

Pass / Fail

Derived from approved Development Report.

### Repository Status

Clean / Not Clean

### Ready For Pull Request

Yes / No

---

## Completion Criteria

Commit stage is complete only when:

- Review approved.
- Commit created.
- Feature branch pushed.
- Latest main merged.
- Verified approved build results exist.
- Verified approved test results exist.
- Repository state clean.
- Branch ready for PR creation.

---

## Synchronization Safety

When merging latest main into the feature branch:

- Minimize conflict resolution changes.
- Do not introduce unrelated modifications.
- Preserve approved implementation behavior.

If conflicts require functional changes:

Return to:

#develop <WorkItem>

for re-validation.

---

## Handoff

Generate a Pull Request Readiness Summary suitable for:

#pr <WorkItem>

Include:

- Work Item
- Feature Branch
- Commit SHA
- Commit Message
- Build Results
- Test Results
- Risks
- Outstanding Issues

Do not create Pull Requests.

Wait for user to invoke:

#pr <WorkItem>