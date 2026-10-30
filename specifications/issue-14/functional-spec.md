# Issue #14 Functional Specification

**Status:** Approved by the user on 2026-10-30<br />
**Issue:** [#14 — Standardize API responses and extract shared frontend patterns](https://github.com/umair2malpara/dotnet-agentic-poc/issues/14)<br />
**Source:** GitHub Issue #14<br />
**Work item type:** Enhancement / refactoring<br />
**Discovery:** Complete; shared understanding confirmed by the user on 2026-10-30

## Business Objective

Provide predictable API outcomes and reusable frontend behavior so consumers can handle results consistently and users see a coherent application shell and notifications.

## Problem Statement

Existing API endpoints return different success and error body shapes. Angular has no shared HTTP interceptor for the API contract, while some common shell behaviors are implemented together in the application shell or repeated across pages.

## Functional Requirements

### FR-001 — Return a common success response

Every existing API endpoint returns successful data in a strongly typed common response wrapper.

**Acceptance criteria**

- Successful resource payloads are contained in the common response shape.
- `201 Created` responses retain their resource location semantics and include the wrapped resource.
- Operations that currently return `204 No Content` return `200 OK` with a success wrapper; their wrapper represents the absence of a resource result without inventing a resource payload.
- Existing resource fields and business outcomes remain unchanged unless required by the standardized response format.

### FR-002 — Standardize API failures

Validation failures, not-found outcomes, and unexpected exceptions use a consistent, safe error contract.

**Acceptance criteria**

- Validation failures return `400 Bad Request` with validation problem details.
- Not-found outcomes return `404 Not Found` with problem details.
- Unexpected exceptions are handled centrally, logged appropriately, and return a generic `500 Internal Server Error` problem response.
- Error responses do not disclose stack traces, exception messages, or other internal/sensitive details.
- Existing appropriate HTTP status semantics are preserved; the documented no-content success status change is the intentional exception.

### FR-003 — Centralize Angular API response and error handling

Angular HTTP requests pass through a shared layer that handles the success wrapper and common error contract.

**Acceptance criteria**

- API services and pages do not repeat success-envelope or common error parsing logic.
- Consumers continue to receive typed resource data through the established API services.
- Errors remain available to feature UI for inline state and recovery actions.
- Malformed or unexpected API responses are surfaced as failures rather than silently treated as valid data.

### FR-004 — Standardize notifications without duplicates

Use the shared notification layer for request outcomes where a toast is appropriate.

**Acceptance criteria**

- Successful changes and explicit user-triggered refreshes can show a success notification.
- Automatic/background reads do not show success notifications.
- A failure already clearly displayed inline does not also produce a duplicate global failure toast.
- Requests can suppress success or failure notifications when a toast is unsuitable.
- Warnings are used only for recoverable/cautionary outcomes and accurately distinguish partial/recovery situations from ordinary success or failure.

### FR-005 — Reuse application-shell patterns

Provide reusable shell components for top navigation, configurable feature navigation, page title/breadcrumb context, and floating action bar where applicable to existing pages.

**Acceptance criteria**

- Navigation entries are defined centrally rather than duplicated in page templates.
- Applicable pages use shared shell components consistently.
- Existing route-aware title and breadcrumb behavior is retained.
- Existing responsive, keyboard, and assistive-technology behavior is retained.
- Existing action-bar functionality is reused where it already satisfies the requirement; no abstraction is added for one-off behavior.

### FR-006 — Preserve existing behavior and document the contract

Update all affected consumers, tests, and documentation for the standardized contract.

**Acceptance criteria**

- Existing frontend flows remain functional apart from the intentional success response shape and successful `204` to `200` change.
- Backend and frontend tests cover the contract, centralized errors, interceptor/notification behavior, and shared UI.
- Documentation describes success/error formats, the status-code compatibility impact, and frontend usage patterns.
- Backend and frontend builds and relevant test suites pass.

## Non-Functional Requirements

- **NFR-001 — Type safety:** API and Angular response contracts are strongly typed.
- **NFR-002 — Safe errors:** Client error bodies do not expose internal exception details; server-side logging retains useful diagnostic context.
- **NFR-003 — Accessibility:** Shared shell and notification behavior retain accessible semantics, keyboard support, and responsive use.
- **NFR-004 — Maintainability:** Reuse existing patterns and avoid unnecessary abstractions or duplicated response/notification logic.
- **NFR-005 — Compatibility transparency:** Document the changed success wire format and the `204` to `200` status change for affected consumers.

## User Journeys

1. An API consumer receives a consistent wrapped success result or a standardized error response with an appropriate HTTP status.
2. A user completes a change or explicitly refreshes data and sees a success notification; background reads do not interrupt the user.
3. A user encounters an error and receives a clear explanation without duplicate global and inline messages.
4. A user navigates existing pages using consistent, accessible shell navigation, page context, and applicable page actions.

## Explicit Decisions

- Success bodies use a typed `ApiResponse<T>` wrapper; failures use Problem Details and Validation Problem Details.
- Successful operations that formerly returned `204 No Content` return `200 OK` with the wrapper.
- Success toasts are for successful changes and explicit refreshes, not automatic/background reads.
- Suppress a global failure toast when the same failure is clearly presented inline.
- Warnings are for recoverable/cautionary outcomes only.

## Assumptions

- “Existing endpoints” means the current customer, product, and weather API endpoints, plus any other API endpoints discovered before implementation.
- Existing resource payload fields and business rules remain stable; this work standardizes the response envelope and error contract rather than redesigning resource data.
- The reusable shell components should be applied to existing pages where their behavior is relevant.

## Constraints

- Appropriate HTTP status codes remain meaningful and are documented.
- Do not leak exception details or sensitive information to clients.
- Keep controllers and components focused and reuse established repository patterns.
- Do not begin implementation until this package is approved and the setup phase is completed.

## Dependencies

- Existing ASP.NET Core controllers, validation, correlation-ID middleware, and API tests.
- Existing Angular API services, app shell, action bar, notification service, and their tests.
- API and frontend documentation and build/test scripts.

## Risks

- Existing consumers may depend on the current raw success bodies or `204` status codes.
- Notification behavior can be confusing if an error is toasted globally when a feature already presents it inline.
- Refactoring the shell can regress route metadata, active navigation, responsive behavior, focus handling, or accessibility.

## Out Of Scope

- New business capabilities or changes to resource-specific business rules.
- Authentication/authorization changes.
- Changing resource field names or persistence behavior.
- Introducing a new notification library or other unrelated dependencies.

## Open Items

- The exact response property names, error extension fields, and notification request metadata are technical design recommendations in the accompanying technical specification and require approval.
- No unresolved business requirements remain.

## Shared Understanding Status

Complete; specification approval is pending.
