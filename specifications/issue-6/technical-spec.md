# Issue #6 Technical Specification

**Work item:** [#6 — Enhance the Angular Dashboard with Customer and Product Navigation](https://github.com/umair2malpara/dotnet-agentic-poc/issues/6)
**Source:** GitHub Issue
**Discovery:** Complete; shared understanding confirmed
**Specification status:** Approved by the user for the #setup handoff

## Architecture Overview

Keep the Angular application as the existing standalone SPA under `src/frontend/`. Retain the root `App` template as a single router outlet. Introduce a shared application-shell route component that owns the responsive top bar, wordmark, two-link feature navigation, route-aware breadcrumb, and a nested router outlet for the active page. Configure Dashboard, Customers, and Products as child routes of that shell; redirect the empty child path and unknown paths to Dashboard. Lazy-load route components where appropriate.

Continue using the existing dashboard feature to coordinate typed API requests and per-dataset state. Reuse its standalone weather, customer-list, product-list, summary-card, and shared dataset-status components. Keep presentation components independent of `DashboardApiService`. Add small standalone placeholder components for the Customers and Products routes.

No backend API, repository, domain, or persistence redesign is required. Existing endpoint contracts, sample records, and CORS behavior already satisfy the API-related requirements and should be preserved.

## Solution Design

### Frontend design

- Add an `AppShellComponent` at the route level below the root router outlet. It renders the persistent top bar and desktop left sidebar, and includes a nested router outlet for route content.
- Use route metadata to determine the breadcrumb label for the active child route. The Home breadcrumb is a client-side link to `/dashboard`.
- Provide exactly Customers and Products as feature navigation links. Mark the active link accessibly. At small viewports, use a compact accessible drawer/menu that exposes the same links; provide a keyboard-operable toggle and clear open/close state.
- Configure child routes for Dashboard, Customers, and Products, with empty and wildcard redirects to Dashboard. Preserve client-side navigation. The Dashboard wordmark and Home breadcrumb both target `/dashboard`.
- Add focused standalone Customers and Products placeholder components containing their heading and exact approved message. Do not add data fetching or mutation workflows to these pages.
- Retain the dashboard's independent request state and retry behavior. Dashboard presentation components continue to receive typed `DatasetState<T>` inputs and emit retry events.
- Retain environment-based API URL configuration and the three existing GET request contracts. Do not put API calls in the shell or placeholder pages.
- Preserve generated-weather labeling and the current successful-empty, loading, and error/retry presentations.
- Use semantic navigation and breadcrumb landmarks, keyboard operability, visible focus, accessible names, active-route semantics, and appropriate live/status announcements. Validate the agreed WCAG 2.1 AA target, including contrast and narrow viewport behavior.

### Backend design

- No backend code changes are required by the approved requirements.
- Preserve the existing controller → service → repository behavior and API contracts.
- Preserve the three seeded fictional customers and three sample products in the in-memory repositories.
- Preserve Development CORS for `http://localhost:4200`. Outside Development, preserve required explicit `Cors:AllowedOrigins` configuration, validation, and no-wildcard behavior.

### Integration design

The application shell and pages use Angular Router only. On Dashboard activation, the existing Dashboard component calls `DashboardApiService`, which uses the configured environment base URL for:

- `GET {apiBaseUrl}/api/weatherforecast?count=5`
- `GET {apiBaseUrl}/api/customers`
- `GET {apiBaseUrl}/api/products`

Each request updates only its corresponding dataset state. Failed requests remain errors until retried; they are not converted to empty data or sample fallback values.

## Impact Analysis

### Existing functionality affected

- Replace the Dashboard's section-fragment sidebar links (Overview, Weather, Customers, Products) with the shared two-link route navigation.
- Move shell-level top bar, sidebar, and page-content layout responsibilities out of the Dashboard presentation into the shared shell, while preserving dashboard content and data coordination.
- Replace dashboard-only navigation with route-aware breadcrumbs and feature routes.
- Update README wording that currently describes fragment-based dashboard navigation.

### Existing functionality to preserve

- Dashboard API request URLs and environment-based API configuration.
- Typed frontend models and independent weather/customer/product loading/error/success states.
- Shared retry and successful-empty presentation.
- Generated sample-weather disclosure and summary/stat cards.
- Existing seeded in-memory API data and CORS configuration.
- Root application template containing only the router outlet.

### Backend impact analysis

- **Controllers:** No changes. Existing controllers expose the required GET routes; existing additional API CRUD endpoints remain unchanged and are not exposed as UI workflows on the placeholder pages.
- **Services:** No changes.
- **Repositories:** No changes. Customer/product seeds and in-memory reset behavior already exist.
- **Models/DTOs:** No changes. Existing API fields map to current TypeScript interfaces.
- **Middleware:** No changes.
- **Configuration:** No backend configuration changes expected. Existing Development and non-Development CORS handling meets the approved scope.
- **Database:** No database changes required. No database changes required.
- **External integrations:** No new external service integration. Weather remains generated sample data.

### Frontend impact analysis

- **Components:** Add shared application shell and two placeholder page components. Adapt the existing Dashboard view and styles to render within the shell and retain dashboard sections.
- **Services:** No service change expected; preserve `DashboardApiService`.
- **Models:** No model change expected; preserve current typed API and dataset-state types.
- **Routes:** Add nested route configuration for the shell and three page routes, with redirects and lazy loading where appropriate.
- **Forms:** None. No CRUD or forms are in scope.
- **State:** Keep request/state coordination in `DashboardComponent`; shell state is limited to current route and responsive menu visibility.
- **UI:** Add active route, breadcrumb, responsive drawer/menu, and accessible interactions. Preserve dashboard data display and visual patterns.
- **Tests:** Expand router coverage and add coverage for shell navigation/breadcrumb/accessibility-relevant behavior, placeholder pages, and dashboard state isolation/retry.

### API impact analysis

- **Endpoints added/modified/removed:** None.
- **Request/response changes:** None.
- **Validation/versioning:** No contract or versioning change.
- **CORS:** Existing origin behavior is preserved and verified; no wildcard origin is introduced.

### Database impact analysis

No database changes required. No tables, views, procedures, functions, indexes, migrations, or rollback steps are introduced.

## Dependency Analysis

- **Internal:** Angular Router, existing dashboard feature, API service, typed models, reusable dashboard components, current .NET API endpoints.
- **External:** Existing Angular Material and Angular dependencies only.
- **Libraries:** No new dependency is required. Verify the Angular version configured in the project when implementation begins; upgrade only if needed to meet issue requirements.

## Security Considerations

- No authentication or authorization is introduced; both are explicitly out of scope.
- CORS does not substitute for authentication. Preserve exact Development origin and explicit non-Development origins; do not use wildcard origins.
- Do not add secrets to environment files. API base URLs and origin allowlists are configuration, not credentials.
- Render API-provided values through normal Angular interpolation; do not treat them as trusted HTML.
- Keep error messages user-facing and avoid stack traces, internal host details, or sensitive configuration.
- The Customer/Product placeholders must not imply authorization controls or expose mutation actions.

## Performance Considerations

- Keep route components lazy-loaded where appropriate.
- Preserve the independent dataset requests so completion/failure of one does not block the others.
- No caching or pagination change is required for this dashboard scope.
- No numeric performance targets were specified.

## Error Handling Strategy

- Keep current independent loading/error/success states for each dashboard dataset.
- A failed request presents a concise error and retries only that dataset.
- A successful empty result remains distinguishable from loading and error.
- Do not provide success-shaped fallback data on request failure.
- Unknown frontend routes redirect to Dashboard. Invalid non-Development CORS configuration remains a visible startup/configuration failure.

## Logging and Monitoring Strategy

- No new telemetry, audit logs, metrics, or alerting are required.
- Preserve existing API logging and correlation middleware.
- Do not log or display customer email addresses or entire response payloads unnecessarily.

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Local API failure, untrusted HTTPS certificate, or CORS mismatch prevents data requests | Keep per-dataset errors visible and retryable; retain documented API/frontend startup and configuration steps |
| Responsive shell makes routes hard to operate using keyboard or assistive technology | Use semantic navigation, accessible menu controls, visible focus, active-route state, and accessibility verification |
| Generated forecasts are mistaken for live conditions | Retain a clear sample-data label |
| Existing documentation/specs suggest obsolete fragment-only navigation | Update root README and replace superseded issue #6 specification content |

## File Change Plan

The following is the expected implementation scope, not a record of changes in this specification phase.

### Files to add

- `src/frontend/src/app/app-shell/app-shell.component.ts`
- `src/frontend/src/app/app-shell/app-shell.component.html`
- `src/frontend/src/app/app-shell/app-shell.component.scss`
- `src/frontend/src/app/app-shell/app-shell.component.spec.ts`
- `src/frontend/src/app/features/customers/customers.component.ts`
- `src/frontend/src/app/features/customers/customers.component.html`
- `src/frontend/src/app/features/customers/customers.component.scss`
- `src/frontend/src/app/features/customers/customers.component.spec.ts`
- `src/frontend/src/app/features/products/products.component.ts`
- `src/frontend/src/app/features/products/products.component.html`
- `src/frontend/src/app/features/products/products.component.scss`
- `src/frontend/src/app/features/products/products.component.spec.ts`

### Files to modify

- `src/frontend/src/app/app.routes.ts` — shell parent, feature routes, and redirects.
- `src/frontend/src/app/app.spec.ts` — root/unknown redirects, direct routes, and application navigation integration coverage as appropriate.
- `src/frontend/src/app/features/dashboard/dashboard.component.html` — retain dashboard data sections without owning global shell navigation.
- `src/frontend/src/app/features/dashboard/dashboard.component.scss` — retain dashboard-specific styles after shell layout extraction.
- `README.md` — replace obsolete fragment-navigation description and retain/update local API URL and CORS run instructions.

Other frontend API, environment, model, component, and backend files are expected to remain unchanged unless inspection during implementation reveals a requirement gap.

### Files to delete

- None.

### Expected folder changes

- **Frontend:** Add shared shell and Customers/Products feature folders; update route configuration and Dashboard composition.
- **Backend:** No source/configuration changes expected.
- **Tests:** Add focused tests for shell navigation, page routes/placeholders, and relevant dashboard states; extend root routing coverage.
- **Documentation:** Update `README.md`; no new runtime setup is required.
- **Specifications:** This package documents the expected work and does not itself implement it.

## Validation Plan

- Run the existing frontend build and configured unit test runner.
- Verify root and wildcard redirects, direct feature routes, wordmark/navigation/breadcrumb destinations, and absence of full page reload.
- Verify exact placeholder copy and absence of page CRUD controls.
- Verify API service requests still use the configured base URL and required endpoints.
- Verify independent loading, empty, error, and retry behavior for all dashboard datasets.
- Run existing backend tests for sample seeds and verify Development/non-Development CORS configuration without changing API contracts.
- Manually verify the responsive navigation, keyboard/focus behavior, state announcements, and contrast against the agreed WCAG 2.1 AA target.
- Verify README local run and configuration instructions match current scripts/configuration.
