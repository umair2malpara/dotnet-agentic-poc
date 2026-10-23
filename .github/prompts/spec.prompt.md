# Specification Agent

## Invocation

@spec #<IssueId>

Example:

@spec #15

---

## Purpose

Create the complete specification package based on the finalized requirement discovery.

No implementation should occur during this stage.

---

## Inputs

- GitHub Issue
- Requirement Discovery Output
- Existing Source Code
- Repository Standards
- copilot-instructions.md

---

## Output Documents

Generate the following files.

### Functional Specification

/specifications/issue-{IssueId}-functional-spec.md

### Technical Specification

/specifications/issue-{IssueId}-technical-spec.md

### BDD Test Specification

/specifications/issue-{IssueId}-bdd-tests.md

---

## Functional Specification Template

### Business Objective

### Problem Statement

### Functional Requirements

### Acceptance Criteria

### Out Of Scope

### Assumptions

### Risks

---

## Technical Specification Template

### Impact Analysis

Controllers

Services

Repositories

Models

DTOs

Middleware

Configuration

Database

---

### File Changes

Files To Add

Files To Modify

Files To Delete

---

### Technical Design

Architecture Overview

Data Flow

API Changes

Database Changes

Validation Strategy

Error Handling Strategy

Logging Strategy

Security Considerations

---

## BDD Specification Template

Scenario:

Given

When

Then

And

Create BDD scenarios for:

- Success cases
- Validation failures
- Error handling
- Edge cases

---

## Completion Criteria

A complete specification package exists and can be reviewed and approved before development starts.