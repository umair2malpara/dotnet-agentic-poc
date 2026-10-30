# Issue #14 BDD Test Specification

**Status:** Approved by the user on 2026-10-30<br />
**Issue:** [#14 — Standardize API responses and extract shared frontend patterns](https://github.com/umair2malpara/dotnet-agentic-poc/issues/14)

Scenarios define observable behavior. Backend scenarios use the configured xUnit test project; frontend scenarios use the configured Angular/Vitest runner. No implementation or tests are created during this specification phase.

## API Success Contract

### TC-001 — Wrap successful resource reads

**Given** an API endpoint returns a resource or collection successfully<br />
**When** a client requests that endpoint<br />
**Then** the endpoint returns its appropriate successful HTTP status<br />
**And** the response body contains the existing payload under the common `data` property<br />
**And** resource fields and values are unchanged

### TC-002 — Preserve created-resource semantics

**Given** a valid resource-creation request<br />
**When** the API creates the resource<br />
**Then** it returns `201 Created` with the created resource in the common success envelope<br />
**And** it retains the appropriate `Location` header

### TC-003 — Return a body for successful no-content operations

**Given** a valid update or delete operation that currently returns `204 No Content`<br />
**When** the operation succeeds<br />
**Then** it returns `200 OK` with the common success envelope and `data: null`<br />
**And** the intended resource mutation has completed

## API Error Contract

### TC-004 — Return validation problem details

**Given** a request fails model binding or endpoint validation<br />
**When** the API rejects the request<br />
**Then** it returns `400 Bad Request` using the validation problem contract<br />
**And** field-specific errors are included where available<br />
**And** no invalid mutation is applied

### TC-005 — Return problem details for missing resources

**Given** a request references a resource that does not exist<br />
**When** the API processes the request<br />
**Then** it returns `404 Not Found` using Problem Details<br />
**And** it does not disclose internal implementation details

### TC-006 — Handle unexpected exceptions centrally

**Given** an endpoint operation throws an unexpected exception<br />
**When** the API handles the request<br />
**Then** the response is a generic `500 Internal Server Error` Problem Details response<br />
**And** the response does not contain the exception message or stack trace<br />
**And** the exception is logged server-side with correlation context

### TC-007 — Standardize all existing endpoint outcomes

**Given** a customer, product, or weather endpoint returns success or a known error<br />
**When** its contract is verified<br />
**Then** success bodies follow the common wrapper and error bodies follow Problem Details<br />
**And** endpoint-specific appropriate HTTP status codes remain meaningful

## Angular HTTP Contract

### TC-008 — Unwrap a valid success envelope centrally

**Given** an Angular API request receives a valid success envelope<br />
**When** the response passes through the shared HTTP interceptor<br />
**Then** the resource service receives the typed resource data<br />
**And** endpoint services and components do not repeat envelope-unwrapping logic

### TC-009 — Preserve standardized API errors for feature handling

**Given** an Angular API request receives a validation or other Problem Details response<br />
**When** the shared interceptor processes the failure<br />
**Then** status and structured error information remain available to feature UI<br />
**And** no error is converted into successful or empty data

### TC-010 — Surface malformed success responses

**Given** a successful HTTP response does not match the expected API envelope<br />
**When** the shared interceptor processes it<br />
**Then** the client surfaces a contract failure<br />
**And** it does not silently return the malformed body as valid resource data

## Notification Behavior

### TC-011 — Notify on opted-in successful changes

**Given** a user-triggered change request succeeds and requests a success notification<br />
**When** the shared notification layer processes the response<br />
**Then** one accessible success notification is shown

### TC-012 — Keep automatic reads silent

**Given** an automatic or background read succeeds<br />
**When** its response is processed<br />
**Then** no success toast is shown

### TC-013 — Notify on explicit refresh

**Given** a user explicitly requests a refresh and it succeeds<br />
**When** the shared notification layer processes the result<br />
**Then** one success notification is shown if that action requests one

### TC-014 — Avoid duplicate failure notifications

**Given** a feature clearly displays a request failure inline<br />
**When** the request fails and its notification policy suppresses the global toast<br />
**Then** the inline error remains visible and actionable<br />
**And** no duplicate global failure toast is shown

### TC-015 — Show a global failure notification when appropriate

**Given** a request fails and the feature is not presenting the same failure inline<br />
**When** the shared failure policy handles the error<br />
**Then** one accessible failure notification is shown<br />
**And** the error remains available to the caller

### TC-016 — Distinguish a recoverable warning from failure

**Given** a mutation succeeds but a subsequent refresh fails<br />
**When** the outcome is communicated to the user<br />
**Then** a warning explains that the mutation succeeded and the refresh failed<br />
**And** the UI does not report the mutation itself as failed or the refresh as successful

## Shared Shell Behavior

### TC-017 — Render configurable navigation consistently

**Given** the user visits an applicable application route<br />
**When** the application shell renders feature navigation<br />
**Then** links come from the centralized navigation configuration<br />
**And** active-route state, direct navigation, responsive behavior, and keyboard operation remain available

### TC-018 — Render route-aware page context

**Given** the current route defines title, description, and breadcrumb metadata<br />
**When** the page context renders<br />
**Then** the shared component displays the correct title and breadcrumb hierarchy

### TC-019 — Reuse the action bar where applicable

**Given** an existing page requires a floating action bar<br />
**When** its shell content renders<br />
**Then** it uses the reusable action-bar component within the main-content area<br />
**And** its existing actions, visibility controls, responsive behavior, and accessibility remain functional

### TC-020 — Preserve existing application flows

**Given** the existing dashboard, customer, and product pages are visited and used<br />
**When** shared HTTP and shell patterns are in place<br />
**Then** their existing route, data, loading, error, and action behavior remains functional apart from the documented API contract change

## Documentation and Validation

### TC-021 — Document the contract and compatibility impact

**Given** the response contract is introduced<br />
**When** API and frontend documentation is reviewed<br />
**Then** it describes success and error formats, status behavior, frontend usage, and the intentional `204` to `200` change

### TC-022 — Validate build and test suites

**Given** implementation and relevant tests are complete<br />
**When** backend and frontend validation runs<br />
**Then** relevant tests pass<br />
**And** backend and frontend builds succeed
