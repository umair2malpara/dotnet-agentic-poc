# Issue #11 Technical Specification

**Status:** Approved by the user on 2026-10-28<br />
**Issue:** [#11 — Implement customer CRUD management pages](https://github.com/umair2malpara/dotnet-agentic-poc/issues/11)<br />
**Source:** GitHub Issue #11

## Architecture Overview

Implement customer management in the existing Angular feature route and ASP.NET Core customer resource. Keep list/form state in the feature components, HTTP calls in a focused `CustomerApiService`, validation at both the UI and API boundaries, and all-or-nothing deletion in the customer repository. Split the current dashboard HTTP service into customer, product, and weather services while preserving the dashboard's current request and rendering behavior.

Customer data remains in the existing in-memory repository. No database or external dependency is introduced.

## Solution Design

### Backend design

- Add a customer bulk-delete request DTO at the API boundary.
- Extend the customer service and repository contracts with a bulk-delete operation.
- Validate create/update values at the API boundary after trimming. Require non-empty name and a valid email address; do not enforce uniqueness.
- Implement bulk deletion as one synchronized repository operation. Validate that every requested ID exists before removing any. Coordinate all repository reads and mutations through the same synchronization boundary so concurrent calls cannot interleave with a partially applied batch.
- Preserve existing customer routes and response contracts. Return an explicit failure for a missing ID in the batch; no records may be removed in that case.
- Seed exactly 20 deterministic fictional customers, retaining the current three.

### Frontend design

- Turn `CustomersComponent` into the customer-list page with semantic table markup, row checkboxes, action-state rules, request states, and a visible retry affordance where a read can be retried.
- Add a dedicated customer form component for create/edit modes. Use Angular reactive forms, route context/ID to select mode and customer, client-side required/email/whitespace validation, and normalized trimmed values before submission.
- Use a root-scoped notification service and app-shell toast for transient operation outcomes; stage save confirmation until the customer list refresh succeeds or fails so those outcomes remain distinct.
- Keep each feature's route declarations in a feature-owned `*.routes.ts` file and compose them in the root route table. Store customer, product, weather forecast, and dataset-state contracts in separate focused model files.
- Build breadcrumbs from the active route hierarchy, linking ancestor routes and announcing the leaf route as the current page.
- Add `CustomerApiService` for list, get, create, update, and bulk-delete operations. Add `ProductApiService` and `WeatherForecastApiService` for the other existing dashboard requests.
- Use one shared API URL helper for base URL normalization across the resource services.
- Update the dashboard to inject the resource-specific services without changing its current independently loaded datasets, retry behavior, count display, or five-forecast request.
- Use accessible labels, keyboard-operable controls, semantic status/alert announcements, and responsive styling. Provide explicit delete confirmation before making the request.

### Approved reusable customer interactions

- Add a shared fixed-bottom action-bar component with typed action definitions (label, disabled/busy state, style, and callback). Use it on the customer list and customer create/edit pages; reserve page space and respect mobile safe-area insets.
- Add a reusable accessible confirmation dialog component, using the existing Angular CDK dependency if suitable. Configure title, body, labels, and result per caller; make the background inert, trap/restore focus, and make No/Escape cancel.
- On delete, submit the atomic request only after the user confirms Yes. On cancellation, retain selection and send no request.
- On successful save, show a success toast before opening the return-to-list dialog. Yes navigates; after create, No resets the form to blank for another customer; after update, No retains the saved values and leaves Save disabled until values change.
- Surface mutation failures in an error toast while retaining field-level validation and existing retryable list error states. Distinguish a successful save from a failed subsequent list retrieval.
- Extend tests for action-bar enabled/disabled states, keyboard-accessible modal confirmation/cancellation, toast outcomes, navigation Yes/No, failure-state retention, and fixed-bar responsive layout.

### Approved page-context layout

- Replace the shell's standalone breadcrumb row with a compact sticky page-context bar immediately below the top navbar. Compose its left breadcrumb and centered title/description group from route metadata with a responsive layout.
- Avoid duplicating the title and description in feature headers when supplied by the page-context bar; feature page content should start directly below the sticky bar.
- Move the customer-list Add New action into the existing shared bottom action bar.
- Give each bar a single accessible show/hide control; do not provide a separate minimize/expand state. Use an eye icon for restoring the hidden context bar and the text “Show actions” for restoring the hidden action bar.
- Include narrow viewport, scrolling, independent-toggle, breadcrumb navigation, and Add New action-bar tests.

### Approved floating bars and desktop sidebar amendment

- Constrain the fixed context and action bar surfaces to the shell's main-content column, accounting for both expanded and collapsed desktop sidebar layouts; do not let either surface cross the sidebar.
- Keep each surface compact, visually distinct, and floating within that column. Place the context bar as close as practical below the top navbar and the action bar as close as practical to the viewport bottom, including mobile safe-area padding.
- Give each bar only one show/hide control. When the context bar is hidden, render a compact eye-icon restore control at the upper-right; when the action bar is hidden, render its “Show actions” restore control at the lower-right.
- Group the page title and description together in the center of the context bar; do not position the description at the right side.
- Use an eye-off SVG icon, not a generic close glyph, for the action-bar hide control.
- Keep the bars independently visible/hidden in shell/component state; restoring a bar restores its visible state without a secondary collapsed state.
- Add an accessible desktop sidebar toggle that removes the sidebar's width when collapsed and restores it when expanded. Keep the existing mobile navigation behavior unchanged.
- Test that floating bars/restore controls stay within the main-content area for both sidebar states, that hidden bars can be restored independently, and that desktop sidebar collapse expands content without changing mobile navigation.

### Integration design

- Keep all API URLs based on the configured `environment.apiBaseUrl`.
- Extend the existing frontend CORS method list to allow the verbs required by the existing and new customer operations.
- Keep existing individual customer API calls available; frontend multi-select deletion uses only the atomic bulk endpoint.
- Update README wording that currently describes Customers as a placeholder.

## Backend Impact Analysis

### Controllers

- Modify `src/backend/Api/Controllers/CustomersController.cs` to validate normalized create/update inputs and add the bulk-delete action.
- Existing GET, GET-by-ID, POST, PUT, and DELETE-by-ID endpoints remain.

### Services

- Extend `src/backend/Application/Services/ICustomerService.cs` with a bulk-delete operation.
- Implement it in `src/backend/Application/Services/CustomerService.cs` by delegating to the repository.

### Repositories

- Extend `src/backend/Application/Abstractions/Repositories/ICustomerRepository.cs`.
- Implement validation-and-removal atomically in `src/backend/Infrastructure/Repositories/InMemoryCustomerRepository.cs`.
- Coordinate relevant reads and mutations with the same synchronization mechanism to prevent concurrent changes from causing partial batch behavior.
- Update the deterministic customer seed set.

### Models

- Continue to use the current `Customer` fields (`Id`, `Name`, `Email`); no domain fields are added.

### DTOs

- Add `src/backend/Api/Contracts/Customers/BulkDeleteCustomersRequest.cs` with a strongly typed collection of customer IDs.
- Keep the bulk command request separate from the domain model. No response DTO is required for a successful 204 response.

### Middleware and configuration

- Modify `src/backend/Api/Program.cs` CORS configuration to allow the existing frontend origin and required CRUD methods. Do not broaden allowed origins.
- No middleware or secrets configuration changes.

### Database and external integrations

- No database access, migrations, or external integrations.

## Frontend Impact Analysis

### Angular components

- Convert `src/frontend/src/app/features/customers/customers.component.ts`, `.html`, and `.scss` from placeholder to list management.
- Add a reusable create/edit form component and its template, styles, and tests under `src/frontend/src/app/features/customers/`.
- Add or update tests for customer list/form behavior and error/validation states.

### Angular services

- Add `customer-api.service.ts`, `product-api.service.ts`, and `weather-forecast-api.service.ts` under `src/frontend/src/app/core/services/`, each with focused tests.
- Remove the combined `dashboard-api.service.ts` and its test after all consumers migrate.
- Update `dashboard.component.ts` and add/update its tests to verify dashboard behavior remains unchanged.

### Angular models

- Define customer, product, weather forecast, and dataset state contracts in `src/frontend/src/app/core/models/customer.model.ts`, `product.model.ts`, `weather-forecast.model.ts`, and `dataset-state.model.ts`.
- Define the typed bulk-delete request shape in the customer API service; do not use `any`.

### Angular routes

- Add `src/frontend/src/app/features/customers/customers.routes.ts` with `/customers`, `/customers/new`, and `/customers/:id/edit`; place dashboard and product route definitions in their respective feature route files.
- Compose feature routes in `src/frontend/src/app/app.routes.ts`; preserve existing redirects and navigation behavior.
- The customer creation breadcrumb is `Home > Customers > Add New`, and the edit breadcrumb is `Home > Customers > Edit`. The Customers ancestor links back to `/customers`.

### Angular forms and state

- Use reactive forms; make name/email required, reject whitespace-only names, and validate email format.
- Trim values before sending create/update requests.
- Track loading, list error, form submission, selection, and bulk-delete error/success state without coupling feature state to unrelated dashboard datasets.
- Keep the current list and selection on a failed atomic delete.

### Angular UI

- Use accessible selection checkboxes and only enable Edit for exactly one selection.
- Require confirmation for all delete actions.
- Make status and validation feedback perceivable and operable with keyboard and assistive technologies.
- Ensure responsive behavior at mobile and desktop widths.

## API Impact Analysis

### Endpoints added

**Proposed:** `POST /api/customers/bulk-delete`

Request:

```json
{
  "ids": ["11111111-1111-4111-8111-111111111111"]
}
```

- One or more IDs are required.
- Duplicate IDs are treated as one requested ID.
- A malformed or empty request is rejected with HTTP 400 and no mutation.
- If all IDs exist, delete all and return HTTP 204 No Content.
- If any ID is missing, delete none and return HTTP 404 with a clear `ProblemDetails` response.
- The all-or-nothing guarantee applies to this process-local in-memory repository and is synchronized against other customer mutations.

### Endpoints modified

- Existing `POST /api/customers` and `PUT /api/customers/{id}` retain their request/response shapes. They additionally trim and validate name/email consistently.
- Existing individual `DELETE /api/customers/{id}` remains unchanged.
- CORS policy is extended to allow the CRUD methods from its already configured frontend origin.

### Endpoints removed

None.

### Validation and versioning

- Name must be non-empty after trimming.
- Email must be non-empty and match the shared frontend/API syntax: ASCII dot-atom local part (no leading, trailing, or consecutive dots), multi-label DNS domain with a 2–63 letter final label. Single-label domains and quoted local parts are rejected.
- Duplicate email addresses remain permitted.
- The existing API versioning strategy is unchanged; the additive bulk endpoint and unchanged JSON contracts do not require a breaking-version change.

## Database Impact Analysis

No database changes required. No tables, views, stored procedures, functions, indexes, data migrations, or rollback actions are required.

## Dependency Analysis

- Internal dependencies: existing customer controller → customer service → customer repository; existing environment API base URL; existing Angular router and dashboard components.
- External dependencies: none added.
- Libraries impacted: existing Angular forms, Angular common HTTP, RxJS, ASP.NET Core MVC, and xUnit test tooling only.
- No package installation or manifest change is expected.

## Security Considerations

- **Authentication/authorization:** Customer endpoints remain unauthenticated within the agreed local/demo scope. Production exposure is explicitly out of scope.
- **Input validation:** Validate IDs and customer input at the API boundary; never rely solely on browser validation.
- **Sensitive data:** Customer email is treated as user data. Do not add payload logging or display raw exception details.
- **Logging:** Follow existing `ILogger<T>` patterns if logging is needed; do not log submitted customer fields.
- **Injection:** Use typed JSON binding and Angular interpolation; do not construct HTML from customer values.
- **API security:** Keep explicit configured CORS origins; do not use wildcard origins. CORS is not authentication.

## Performance Considerations

- A 20-record in-memory list and batch operation require no caching or query optimization.
- Search and pagination remain out of scope.
- Bulk deletion validates and removes IDs in one repository critical section; expected resource use is bounded by the submitted ID count.
- No new dependency or background work is introduced.

## Error Handling Strategy

- **Validation errors:** Return HTTP 400 for invalid create/update values or malformed/empty bulk-delete requests; present field-level form errors and API errors clearly.
- **Business errors:** Return HTTP 404 for a missing detail record or a bulk request containing any missing ID. Bulk deletion must not mutate on this path.
- **Technical errors:** Preserve customer list and selection after failed bulk operations; show an actionable retry/refresh message. Do not silently substitute empty or successful results.
- **Refresh errors:** If the mutation succeeds but the subsequent list refresh fails, distinguish the successful mutation from the refresh failure in the UI.
- **External dependency errors:** No new external service is introduced.

## Logging and Monitoring Strategy

- Use existing structured application logging conventions for unexpected failures only; no customer-specific audit log, metrics, alerts, or monitoring integration is requested.
- Retain existing correlation ID middleware behavior.

## File Change Plan

### Files to add

- `specifications/issue-11/discovery-summary.md`
- `specifications/issue-11/functional-spec.md`
- `specifications/issue-11/technical-spec.md`
- `specifications/issue-11/bdd-tests.md`
- `specifications/issue-11/traceability-matrix.md`
- `docs/api/customers.md`
- `src/frontend/src/app/core/models/customer.model.ts`
- `src/frontend/src/app/core/models/product.model.ts`
- `src/frontend/src/app/core/models/weather-forecast.model.ts`
- `src/frontend/src/app/core/models/dataset-state.model.ts`
- `src/frontend/src/app/features/customers/customers.routes.ts`
- `src/frontend/src/app/features/dashboard/dashboard.routes.ts`
- `src/frontend/src/app/features/products/products.routes.ts`
- `src/backend/Api/Contracts/Customers/BulkDeleteCustomersRequest.cs`
- `src/backend/Tests/Controllers/CustomersControllerTests.cs`
- `src/backend/Tests/Repositories/InMemoryCustomerRepositoryBulkDeleteTests.cs`
- `src/frontend/src/app/core/services/customer-api.service.ts`
- `src/frontend/src/app/core/services/customer-api.service.spec.ts`
- `src/frontend/src/app/core/services/product-api.service.ts`
- `src/frontend/src/app/core/services/product-api.service.spec.ts`
- `src/frontend/src/app/core/services/weather-forecast-api.service.ts`
- `src/frontend/src/app/core/services/weather-forecast-api.service.spec.ts`
- `src/frontend/src/app/core/services/api-url.ts`
- `src/frontend/src/app/features/customers/customer-form.component.ts`
- `src/frontend/src/app/features/customers/customer-form.component.html`
- `src/frontend/src/app/features/customers/customer-form.component.scss`
- `src/frontend/src/app/features/customers/customer-form.component.spec.ts`
- `src/frontend/src/app/features/customers/customer.validators.ts`

### Files to modify

- `README.md`
- `src/backend/Api/Program.cs`
- `src/backend/Api/Controllers/CustomersController.cs`
- `src/backend/Application/Services/ICustomerService.cs`
- `src/backend/Application/Services/CustomerService.cs`
- `src/backend/Application/Abstractions/Repositories/ICustomerRepository.cs`
- `src/backend/Infrastructure/Repositories/InMemoryCustomerRepository.cs`
- `src/backend/Tests/Repositories/InMemoryRepositorySeedTests.cs`
- `src/frontend/src/app/app.routes.ts`
- `src/frontend/src/app/app.spec.ts` (verify feature route composition and hierarchical breadcrumb navigation)
- `src/frontend/src/app/app-shell/app-shell.component.ts`
- `src/frontend/src/app/app-shell/app-shell.component.html`
- `src/frontend/src/app/app-shell/app-shell.component.scss`
- `src/frontend/src/app/features/customers/customers.component.ts`
- `src/frontend/src/app/features/customers/customers.component.html`
- `src/frontend/src/app/features/customers/customers.component.scss`
- `src/frontend/src/app/features/customers/customers.component.spec.ts`
- `src/frontend/src/app/features/dashboard/dashboard.component.ts`
- `src/frontend/package.json` (retain the user-approved lifecycle-script allowlist)

### Files to delete

- `src/frontend/src/app/core/services/dashboard-api.service.ts`
- `src/frontend/src/app/core/services/dashboard-api.service.spec.ts`
- `src/frontend/src/app/core/models/api.models.ts`

### Expected folder changes

- **Backend:** Add an API contracts area for customer request DTOs.
- **Frontend:** Add customer form component and three focused resource API services.
- **Tests:** Add controller, repository bulk-delete, service, form/list, resource-service, and dashboard regression coverage.
- **Documentation:** Add Issue #11 specification package and update root README's customer-page description.
- **Configuration:** Extend the existing CORS method list only; no new configuration key.

## Development Readiness Review

- Approved discovery is complete and no requirement questions remain.
- API route, payload, status behavior, validation, atomicity, and UI selection rules are specified.
- The user approved the endpoint details and technical decisions in this specification before setup/development.
- Every requirement is mapped to BDD tests in `traceability-matrix.md`.
- No code, branch, build, or test work is part of this specification stage.
