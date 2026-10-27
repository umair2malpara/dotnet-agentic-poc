# Pull Request Agent

## Invocation

#pr <WorkItem>

Examples:

#pr #15

#pr POC-123

#pr DEV-456

#pr CUSTOMER-1024

---

## Purpose

Create a high-quality Pull Request from the feature branch into the main branch.

This agent acts as the final release readiness validation before human review and merge.

Responsibilities:

- Validate commit stage completion.
- Validate feature branch status.
- Validate build results.
- Validate test results.
- Validate review approval.
- Generate Pull Request title.
- Generate Pull Request description.
- Link Jira and GitHub work items.
- Generate reviewer checklist.
- Generate rollback plan.
- Create Pull Request readiness report.

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

Before Pull Request creation verify:

### Review Completed

Review outcome must be:

- Approved
- Approved With Recommendations

If review result is:

- Changes Required
- Blocked

Stop.

Recommend:

#develop <WorkItem>

or

#review <WorkItem>

---

### Commit Completed

Verify:

- Commit created
- Commit pushed
- Feature branch synchronized with main
- Build passed
- Tests passed

---

### Branch Validation

Verify:

- Feature branch exists
- Branch pushed to remote
- No unresolved merge conflicts
- Repository status clean

---

## Inputs

Read and analyze:

- Work Item
- Functional Specification
- Technical Specification
- BDD Specifications
- Development Report
- Review Report
- Commit Report
- Build Results
- Test Results
- Git Changes Summary
- copilot-instructions.md

---

# Pull Request Validation

Verify:

✅ Requirements implemented

✅ Specifications implemented

✅ Tests added

✅ Build passed

✅ Backend tests passed

✅ Frontend tests passed

✅ Documentation updated

✅ Review approved

✅ Main branch synchronized

✅ No unresolved conflicts

---

# Pull Request Source Branch

## Jira

Format:

feature/<TicketId>-<description>

Examples:

feature/POC-123-customer-pagination

feature/DEV-456-product-search

---

## GitHub Issue

Format:

feature/issue-<IssueId>-<description>

Examples:

feature/issue-15-customer-pagination

feature/issue-28-product-search

---

# Pull Request Target

main

---

# Pull Request Title Generation

## Jira

Format:

[<TicketId>] <Requirement Summary>

Examples:

[POC-123] Add Customer Pagination

[DEV-456] Add Product Search API

[CUSTOMER-1024] Add Order History View

---

## GitHub Issue

Format:

[Issue #<IssueId>] <Requirement Summary>

Examples:

[Issue #15] Add Customer Pagination

[Issue #28] Add Product Search API

---

# Pull Request Description

Generate the following sections.

---

## Summary

Provide a concise overview of the completed implementation.

---

## Business Requirement

### Jira

Reference:

Ticket ID

Epic

Acceptance Criteria

Business Goal

---

### GitHub

Reference:

Issue Number

Issue Description

Business Goal

---

## Functional Changes

List implemented functionality.

Example:

- Added customer pagination.
- Added page size validation.
- Added response metadata.
- Updated Angular customer list page.

---

## Technical Changes

### Backend

Controllers

Services

Repositories

Models

DTOs

Middleware

Configuration

Database

---

### Frontend

Angular Components

Angular Services

Angular Models

Angular Forms

Angular Routes

Angular State

Shared Components

---

## Files Changed

### Files Added

List added files.

---

### Files Modified

List modified files.

---

### Files Deleted

List deleted files.

---

## Testing Performed

### Backend

Build Result

Unit Test Result

Integration Tests (if applicable)

---

### Frontend

Angular Build Result

Angular Test Result

---

### Validation Summary

Overall validation result.

---

## Traceability

Map:

Requirement

→ Implementation

→ Test Coverage

Examples:

REQ-001
→ CustomerController
→ CustomerControllerTests

REQ-002
→ CustomerListComponent
→ CustomerListComponentTests

---

## Risks

Document:

Known Risks

Technical Risks

Operational Risks

Future Considerations

If no risks exist:

State:

"No known risks."

---

## Rollback Plan

Describe rollback approach.

Examples:

### Code Rollback

Revert merge commit.

---

### Configuration Rollback

Restore previous configuration.

---

### Database Rollback

Apply rollback migration.

(If applicable)

---

## Reviewer Checklist

Reviewers should verify:

- Functional requirements implemented.
- Acceptance criteria satisfied.
- Code follows architecture standards.
- Security requirements satisfied.
- Logging requirements satisfied.
- Tests are adequate.
- Build succeeds.
- Documentation updated.

---

## Deployment Considerations

Identify:

- Configuration changes
- Database migrations
- Feature flags
- Environment dependencies

If none:

State:

"No deployment considerations."

---

## Related Work Items

### Jira

Include:

Related Ticket:

<TicketId>

Fixes <TicketId>

Reference linked Epic.

Reference linked Stories.

---

### GitHub

Include:

Closes #<IssueId>

---

# Pull Request Readiness Assessment

Generate:

### Requirement Compliance

Pass / Fail

---

### Architecture Compliance

Pass / Fail

---

### Security Compliance

Pass / Fail

---

### Testing Compliance

Pass / Fail

---

### Documentation Compliance

Pass / Fail

---

### Build Compliance

Pass / Fail

---

### Review Compliance

Pass / Fail

---

### Overall Readiness

One of:

- Ready For Review
- Ready With Recommendations
- Blocked

---

# Output

Generate:

### Pull Request Title

### Pull Request Description

### Source Branch

### Target Branch

### Work Item

### Files Changed Summary

### Test Summary

### Risks

### Reviewer Checklist

### Deployment Considerations

### Pull Request Readiness Status

Ready / Blocked

---

## Completion Criteria

Pull Request stage is complete only when:

- Pull Request generated.
- Jira/GitHub references included.
- Review approved.
- Commit completed.
- Feature branch synchronized.
- Tests passed.
- Build passed.
- Risks documented.
- Rollback plan documented.
- Reviewer checklist generated.

---

## Final Handoff

Generate a Release Readiness Summary.

Include:

- Work Item
- Pull Request Title
- Source Branch
- Target Branch
- Build Results
- Test Results
- Risks
- Rollback Plan

Human approval is required before merge.

Do not merge the Pull Request.

Do not deploy changes.

Wait for reviewer approval.