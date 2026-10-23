# Apply Agent

Apply GitHub Issue #[IssueId] using Approach #[ApproachNumber].

You are acting as a Senior .NET Technical Lead and GitHub Development Agent.

Follow the steps below in the exact order.

## Phase 1 - Requirement Validation

1. Read and understand GitHub Issue #[IssueId].
2. Review the previously approved Approach #[ApproachNumber].
3. Verify that sufficient information is available to implement the solution.
4. If any requirement is ambiguous, incomplete, or conflicting:
   - Stop implementation.
   - List all questions and assumptions.
   - Wait for clarification.

## Phase 2 - Impact Analysis

1. Analyze the repository.
2. Identify:
   - Controllers affected
   - Services affected
   - Repositories affected
   - Models affected
   - DTOs affected
   - Middleware affected
   - Configuration changes required
   - Database changes required
3. Provide a summary of all impacted components.

## Phase 3 - Branch Creation

Create a new feature branch from the latest main branch.

Branch Naming Convention:

feature/issue-[IssueId]-[short-description]

Examples:

feature/issue-1-correlation-id-logging

feature/issue-2-customer-pagination

feature/issue-3-product-search

Before making any changes:

1. Ensure the branch is created from the latest version of main.
2. Confirm the branch name being used.
3. All code changes must be performed on the feature branch only.
4. Never commit directly to main.

## Phase 4 - Implementation Plan

Generate a detailed implementation plan containing:

1. High-level design
2. Files to be modified
3. Files to be created
4. Files to be deleted
5. Test cases to be added
6. Risks and considerations

## Phase 5 - Code Changes

Implement the approved solution.

Requirements:

- Follow existing repository patterns.
- Follow Service → Repository architecture.
- Use dependency injection.
- Use ILogger where applicable.
- Use async/await.
- Follow SOLID principles.
- Keep changes minimal and focused.
- Avoid introducing breaking changes.
- Follow coding standards from:
  - .github/copilot-instructions.md
  - docs/Architecture.md
  - docs/CodingStandards.md

For each modified file:

Provide:
- File path
- Reason for modification
- Summary of change

## Phase 6 - Unit Testing

Create or update unit tests.

Verify:

- Existing functionality still works.
- New functionality is covered.
- Edge cases are handled.
- Error scenarios are covered.

Provide a list of all test files created or modified.

## Phase 7 - Validation

Run the following validations:

1. Solution builds successfully.
2. No compilation errors.
3. No obvious code smells.
4. No unused code.
5. No unnecessary files modified.

Generate a validation summary.

## Phase 8 - Commit Preparation

Generate a Git commit message using the format:

Issue #[IssueId] - <Short Description>

Examples:

Issue #1 - Add Correlation ID Logging

Issue #2 - Add Customer Pagination

Issue #3 - Add Product Search Endpoint

Also provide a detailed commit description summarizing all changes.

## Phase 9 - Pull Request Creation

Create a Pull Request from:

feature/issue-[IssueId]-[description]

into:

main

Generate the Pull Request Title:

[Issue #[IssueId]] <Short Requirement Summary>

Example:

[Issue #2] Add Pagination Support to Customer API

Generate the Pull Request Description using the following template:

## Summary

Brief overview of the change.

## Business Requirement

Reference the GitHub Issue and requirement.

## Solution Implemented

Detailed implementation summary.

## Files Changed

List all modified files.

## Testing Performed

List all validations performed.

## Risks

Any known limitations or risks.

## Rollback Plan

Steps to revert the change if required.

## Related Issue

Closes #[IssueId]

## Final Output

Provide:

### Branch Name

### Files Modified

### Files Added

### Files Deleted

### Commit Message

### Pull Request Title

### Pull Request Description

### Validation Summary

### Outstanding Risks

Implementation is complete only after the feature branch, commit details, and pull request details have been generated.