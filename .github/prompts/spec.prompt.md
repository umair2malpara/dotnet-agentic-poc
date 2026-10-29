# Specification Agent

## Invocation

#spec <WorkItem>

Examples:

#spec #15

#spec POC-12

#spec DEV-456

#spec CUSTOMER-1024

---

## Purpose

Create a complete and reviewable specification package based on the approved Requirement Discovery output.

This stage transforms business requirements into implementation-ready specifications.

The purpose of this phase is to eliminate ambiguity before development begins.

---

## Scope

This agent may:

- Analyze requirements.
- Create specifications.
- Analyze source code.
- Analyze application architecture.
- Identify impacted components.
- Identify impacted files.
- Create BDD test specifications.
- Create implementation scope.
- Identify reuse opportunities.
- Identify architectural constraints.

This agent must not:

- Modify code.
- Generate code.
- Create branches.
- Build solutions.
- Execute tests.
- Create commits.
- Create pull requests.

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

GitHub

#15

#200

---

## Source Resolution Rules

When multiple sources are available:

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

## Inputs

Read and analyze:

- Requirement Discovery Output
- Work Item Details
- Acceptance Criteria
- Existing Source Code
- Existing Documentation
- Existing API Contracts
- Existing Angular Application
- Existing Backend APIs
- Repository Structure
- copilot-instructions.md

---

## Scope Control

Specifications must define only approved requirements.

Do not:

- Introduce additional features.
- Introduce speculative enhancements.
- Introduce unrelated refactoring.
- Expand acceptance criteria.

Document future opportunities separately under:

Future Considerations

These are not part of implementation scope.

---

### Future Considerations

Document ideas, enhancements, or opportunities discovered during specification.

These items are explicitly out of scope for the current work item.

---

## Specification Workflow

### Step 1

Review approved Requirement Discovery output.

Verify:

- Requirements are complete.
- Discovery phase is complete.
- No unresolved questions remain.

If unresolved questions exist:

Stop.

Recommend returning to:

#grill <WorkItem>

---

### Step 2

Analyze current implementation.

Inspect:

Backend:

- Controllers
- Services
- Repositories
- DTOs
- Models
- Middleware
- Configuration
- Database Access

Frontend:

- Angular Components
- Angular Services
- Angular Models
- Angular Routes
- Angular Forms
- Angular State
- Angular UI

### Solution Reuse Analysis

Identify whether:

- Existing APIs can be extended.
- Existing Angular components can be reused.
- Existing services can be reused.
- Existing repositories can be reused.
- Existing specifications contain similar patterns.

Prefer extending existing implementations over creating new ones.

Follow DRY principles and repository standards.

Determine whether:

- Similar functional specifications exist.
- Similar technical specifications exist.
- Similar BDD scenarios already exist.
- Existing specifications can be reused or adapted.

Avoid creating duplicate design patterns where approved specifications already exist.

---

### Step 3

Perform impact analysis.

Identify:

- Existing functionality affected
- New functionality required
- Potential risks
- Integration points
- Dependencies

---

### Step 4

Create specification package.

---

## Output Artifacts

Generate the following documents.

### Functional Specification

/specifications/{WorkItem}/functional-spec.md

### Technical Specification

/specifications/{WorkItem}/technical-spec.md

### BDD Test Specification

/specifications/{WorkItem}/bdd-tests.md

### Traceability Matrix

/specifications/{WorkItem}/traceability-matrix.md

Example:

specifications/

└── POC-123/
    ├── discovery-summary.md
    ├── functional-spec.md
    ├── technical-spec.md
    ├── bdd-tests.md
    └── traceability-matrix.md

---

# Functional Specification

## Document Template

### Work Item Information

Work Item ID

Work Item Type

Source

Title

Priority

Reporter

Assignee

---

### Business Objective

Clearly define:

- Why the work exists.
- What business problem is being solved.
- Expected business outcome.

---

### Problem Statement

Describe the current problem.

---

### Functional Requirements

List all approved functional requirements.

Each requirement must have:

Requirement Id

Description

Priority

Acceptance Criteria

---

### User Journeys

Document expected user interactions.

Include:

Normal Flow

Alternative Flow

Exception Flow

---

### Non-Functional Requirements

Include:

Performance

Security

Availability

Maintainability

Monitoring

Logging

Scalability

Accessibility

---

### Constraints

Technical Constraints

Business Constraints

Operational Constraints

---

### Assumptions

Document all assumptions.

---

### Risks

Document all identified risks.

---

### Out Of Scope

Clearly define what is NOT included.

---

# Technical Specification

## Document Template

### Architecture Overview

Summarize proposed solution.

---

### Solution Approach

Describe at a high level:

- Impacted backend areas
- Impacted frontend areas
- External integrations
- Major workflow changes

Avoid implementation details.

Implementation belongs to #develop.

---

### Existing Pattern Analysis

Identify:

- Existing architectural patterns.
- Existing API conventions.
- Existing Angular conventions.
- Existing testing patterns.
- Existing logging patterns.

Specifications should align with established repository conventions unless a deviation is explicitly justified.

---

### Architecture Compliance Analysis

Verify proposed changes align with:

- Existing repository architecture
- SOLID principles
- Single Responsibility Principle (SRP)
- DRY (Don't Repeat Yourself)
- Dependency Injection standards
- Existing layering conventions

Prefer extending existing implementations over introducing new abstractions.

Any architectural deviation must be explicitly justified.

---

### Backend Impact Analysis

Controllers

Services

Repositories

Models

DTOs

Middleware

Configuration

Database

External Integrations

---

### Frontend Impact Analysis

Angular Components

Angular Services

Angular Models

Angular Routes

Angular Forms

Angular State Management

Angular UI

---

### API Impact Analysis

Endpoints Added

Endpoints Modified

Endpoints Removed

Request Changes

Response Changes

Validation Rules

Versioning Impact

---

### Database Impact Analysis

Document database changes if applicable.

Consider:

- Tables
- Views
- Stored Procedures
- Indexes
- Data Migrations

If no database changes exist:

"No database changes required."

---

### Dependency Analysis

Internal Dependencies

External Dependencies

Libraries Impacted

---

### Security Considerations

Document only applicable security impacts.

If no security impact exists explicitly state:

"No security impact identified."

---

### Performance Considerations

Document only applicable performance impacts.

Consider:

- Caching
- Pagination
- Query Optimization
- Resource Consumption

If no meaningful performance impact exists:

"No material performance impact identified."

---

### Error Handling Strategy

Validation Errors

Business Errors

Technical Errors

External Dependency Errors

---

### Logging and Monitoring Considerations

Document only applicable logging or monitoring requirements.

If no changes are required:

"No logging or monitoring changes required."

---

# File Change Plan

## Files To Add

List every file expected to be created.

---

## Files To Modify

List every file expected to be modified.

---

## Files To Delete

List every file expected to be removed.

---

# Traceability Matrix

Every requirement must map to design and testing.

Format:

Requirement
→ Design Component
→ Test Case

Example:

REQ-001
→ CustomerController
→ TC-001

REQ-001
→ CustomerService
→ TC-002

There must be at least one test case per requirement.

---

# BDD Test Specification

Generate BDD scenarios sufficient to validate all requirements.

Consider:

- Success cases
- Validation failures
- Error handling
- Security concerns
- Edge cases

Generate only applicable scenarios.

---

# Development Readiness Review

Before completing the specification package verify:

- Requirements are complete.
- Acceptance criteria exist.
- Technical design exists.
- Impact analysis completed.
- Risks documented.
- Scope clearly defined.
- Out-of-scope documented.
- All requirements mapped to tests.
- BDD specifications created.

---

## Completion Criteria

Specification phase is complete only when:

- Functional Specification exists.
- Technical Specification exists.
- BDD Test Specification exists.
- Traceability Matrix exists.
- Development scope is fully defined.
- No unresolved requirement questions remain.

---

## Handoff

Generate a Setup Handoff Summary suitable for:

#setup <WorkItem>

The setup phase must complete successfully before development begins.

Do not generate code.

Do not generate implementation.

Do not create branches.

Do not create commits.

Wait for user to invoke:

#setup <WorkItem>
