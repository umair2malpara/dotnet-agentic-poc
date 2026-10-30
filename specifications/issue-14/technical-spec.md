# Issue #14 Technical Specification

**Status:** Approved by the user on 2026-10-30<br />
**Issue:** [#14 — Standardize API responses and extract shared frontend patterns](https://github.com/umair2malpara/dotnet-agentic-poc/issues/14)<br />
**Target frameworks:** .NET 10 / Angular 22, as configured in the repository

## Design Goals

- Establish one success envelope and one standardized error format across the API.
- Centralize exception handling, client-side envelope handling, and request notification policy.
- Reuse and separate existing shell responsibilities without changing their observable behavior.
- Keep resource-specific services, controllers, and components focused on their existing responsibilities.

## Current Architecture

- ASP.NET Core MVC controllers are registered in `Program.cs`; existing controllers return raw resource bodies or endpoint-specific errors.
- `[ApiController]` is in use, and customer validation currently includes controller-local normalization and `ModelState` response construction.
- Correlation ID middleware already adds `X-Correlation-Id` and includes the ID in a logging scope.
- Angular uses standalone providers with `provideHttpClient()` and resource-specific API services.
- `AppShellComponent` currently contains navigation, route-aware page context, responsive navigation state, and toast rendering. The shared `ActionBarComponent` and `NotificationService` already exist.

## Proposed API Contract

### Successful responses

Define a generic API contract in the API layer, proposed as `ApiResponse<T>`:

```json
{
  "data": {
    "id": "resource-specific-id",
    "name": "resource-specific-name"
  }
}
```

- `data` contains the existing resource or collection payload without renaming its fields.
- Successful responses with a resource result preserve appropriate statuses, including `200 OK` and `201 Created`.
- A successful `201 Created` response retains its `Location` header/created-resource route and wraps the created resource.
- Operations that formerly returned `204 No Content` return `200 OK` with the same envelope and an explicit null `data` value; do not invent a resource result.
- Do not include an additional success boolean or notification-specific message in the API envelope. Notification text is request/UI policy, not resource data.

### Error responses

Use ASP.NET Core `ProblemDetails` for errors and `ValidationProblemDetails` for validation failures, with `application/problem+json` where applicable.

- Validation/model-binding errors: `400 Bad Request`, including field-level errors where available.
- Missing resources: `404 Not Found`.
- Unexpected exceptions: `500 Internal Server Error` with a generic client-safe title/detail.
- Preserve other appropriate existing status codes and their standard problem response semantics.
- Never return exception messages, stack traces, or sensitive implementation details to clients.
- Include the existing correlation ID in the response header and, if approved, in a stable Problem Details extension so clients can report failures without receiving internals.

### Centralized backend handling

- Register ASP.NET Core Problem Details services and one central exception handler in the API composition root.
- Configure invalid model-state responses to use the same validation problem contract. Route endpoint-specific validation errors through one shared API validation-problem factory; do not construct validation response bodies independently in controllers.
- Ensure empty error responses, including controller-generated not-found outcomes, are represented with problem details through the standard API error path.
- Log unexpected exceptions server-side with the existing correlation scope and preserve diagnostic context. Do not duplicate exception logs across handlers.
- Keep endpoint-specific status decisions in controllers/services; the central layer standardizes representation and exception handling.

## Proposed Angular HTTP Handling

- Add an `ApiResponse<T>` frontend model and a shared functional HTTP interceptor registered through the existing `provideHttpClient` composition root.
- The interceptor unwraps a valid success envelope so existing resource-focused API services continue to expose their resource types; it must not silently treat an invalid envelope as valid data.
- Standardize parsing of Problem Details and validation errors while keeping the original HTTP status and structured field errors available to feature-level UI.
- Do not make endpoint-specific HTTP calls in components and do not duplicate common envelope/error parsing in each API service.
- Use typed request context metadata (for example, Angular `HttpContextToken`s) to opt into success notifications or suppress a global error notification when the feature owns inline error presentation. Defaults are silent for success and globally handled for failures.
- API service methods or their callers specify the notification intent where the user action is known: mutation success and explicit refresh can opt in; automatic/background reads remain silent.
- Preserve feature-level error state and retry behavior. An opt-out from a global toast must not swallow the error or convert it into a success-shaped fallback.
- Warning notifications are reserved for a confirmed operation with a recoverable follow-up problem (for example, a successful save followed by a failed refresh); the message must distinguish which operation succeeded and which failed.

## Proposed Shell Design

- Extract the top navigation and configurable left/feature navigation from the shell template into focused reusable components.
- Keep feature navigation entries in one typed configuration source consumed by the navigation component.
- Extract route-aware title, description, and breadcrumb rendering into a page-context component that consumes the existing route metadata.
- Reuse the existing `ActionBarComponent` as the floating action bar where a page currently needs page actions; adjust its placement only as necessary to keep it within the main-content area.
- Keep `AppShellComponent` as the composition/layout owner and retain responsive sidebar state, page-context visibility, action-bar visibility, and notification/dialog outlet behavior at the appropriate level.
- Preserve active-route indication, direct route navigation, focus behavior, keyboard operation, accessible names/live regions, and existing responsive layout.
- Do not introduce a general component abstraction for behavior used only once.

## API Compatibility and Migration

- This intentionally changes successful response bodies from raw resources to `{ "data": ... }`.
- Successful update/delete operations change from `204 No Content` to `200 OK` with `{ "data": null }`.
- Update all first-party Angular consumers and tests in the same implementation work.
- Document the new contract, error examples, affected status change, and migration expectation for any external consumers. No external API consumers are currently identified.

## Data Flow

1. A controller returns its existing result with the common success envelope, or framework/custom validation produces a standardized validation error.
2. The API exception/error middleware logs unexpected server failures with correlation context and returns safe Problem Details.
3. Angular HTTP requests pass through the shared interceptor, which unwraps success data or preserves typed problem/error details.
4. The shared notification policy produces only opted-in success/refresh messages and appropriate non-duplicate failure/warning messages.
5. Resource services and pages continue to own endpoint-specific data and user-facing page state respectively.

## Validation and Test Strategy

### Backend — xUnit

- Contract tests for success serialization, including collections, resources, created responses, and null data for former no-content operations.
- Endpoint tests covering status codes and envelopes for all existing endpoints.
- Validation and not-found tests asserting Problem Details content type, status, and field errors.
- Exception-handler tests asserting safe `500` output, no leaked exception detail, and server-side logging/correlation context.
- Regression tests for controller behavior and existing business rules.

### Frontend — configured Angular/Vitest runner

- Interceptor tests for valid envelope unwrapping, Problem Details/validation error preservation, malformed response handling, and status retention.
- Notification tests for mutation/explicit-refresh success, silent background reads, error-toast suppression with inline handling, and recoverable warning outcomes.
- API service tests proving endpoint paths, request bodies, typing, and notification context.
- Shell component tests for centralized navigation, active links, route-aware title/breadcrumb content, action bar placement/use where applicable, keyboard/accessibility behavior, and responsive controls.
- Regression tests for existing customer, product, dashboard, and application-shell flows.

Run the focused backend and frontend tests first, then the repository build and test scripts before implementation review.

## Documentation

- Add a general API response-contract document under `docs/api/` with success/error examples and status behavior.
- Update endpoint documentation such as `docs/api/customers.md` to reference the shared contract.
- Update frontend architecture documentation to explain interceptor registration, notification request policy, navigation configuration, and shared shell component usage.
- Record the intentional response-body and `204` to `200` compatibility changes.

## Assumptions and Approval Items

- `ApiResponse<T>` uses the `data` property as the common success payload; no extra `success` or `message` field is required.
- A void operation serializes an explicit `data: null`.
- API failures use standard ASP.NET Core Problem Details and Validation Problem Details rather than a second custom error envelope.
- The interceptor unwraps the success envelope centrally, while notification behavior is opt-in and request-context driven.
- The correlation ID remains available in the existing response header; adding it as a Problem Details extension is optional and should be confirmed before implementation.
- Route metadata remains the source of title, description, and breadcrumb data.

No implementation is authorized until the specification package is approved and the setup phase is completed.
