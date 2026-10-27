# Issue #6 Functional Specification

**Work item:** [#6 — Enhance the Angular Dashboard with Customer and Product Navigation](https://github.com/umair2malpara/dotnet-agentic-poc/issues/6)
**Source:** GitHub Issue
**Type:** Enhancement
**Priority:** Not specified by the issue; all issue acceptance criteria are treated as required
**Reporter:** umair2malpara
**Assignee:** umair2malpara
**Discovery:** Complete; shared understanding confirmed
**Specification status:** Approved by the user for the #setup handoff

## Business Objective

Enhance the existing Angular dashboard so users can navigate directly between Dashboard, Customers, and Products, understand their current location, and view dashboard datasets independently even when one request is loading or has failed. The issue's acceptance criteria define success; no additional business KPI is specified.

## Problem Statement

The existing application already retrieves and displays dashboard data but has only a Dashboard route and fragment-based links to dashboard sections. It does not provide the requested Customer and Product routes, route-aware breadcrumbs, or a sidebar limited to those two feature links.

## Functional Requirements

### FR-001 — SPA routes and redirects

**Priority:** Must

The application shall redirect `/` and unknown paths to `/dashboard`, render the Dashboard, Customers, and Products pages at `/dashboard`, `/customers`, and `/products`, respectively, and support direct navigation to each route without a full-page reload. Feature routes shall be lazy-loaded where appropriate. The root application template shall contain only the router outlet.

**Acceptance criteria**

- Opening `/` or an unknown path resolves to `/dashboard`.
- Opening each supported route directly renders its corresponding page.
- In-app route changes do not cause full-page reloads.

### FR-002 — Application wordmark

**Priority:** Must

The responsive top bar shall display the **Dotnet Agentic POC** wordmark as a client-side navigation link to `/dashboard`.

**Acceptance criteria**

- The wordmark is present on Dashboard, Customers, and Products.
- Activating it navigates to `/dashboard` without a full-page reload.

### FR-003 — Feature navigation

**Priority:** Must

The left navigation shall contain exactly two feature links: **Customers** and **Products**. It shall not contain Dashboard, Weather, or Overview links. On small screens, the links shall be available through an accessible compact menu or drawer.

**Acceptance criteria**

- The desktop left navigation contains only Customers and Products.
- Each link navigates to its corresponding route.
- At small viewports, an accessible menu/drawer exposes the same two links.

### FR-004 — Route-aware breadcrumbs

**Priority:** Must

Each supported route shall display its corresponding breadcrumb: `Home / Dashboard`, `Home / Customers`, or `Home / Products`. The Home item shall link to `/dashboard`.

**Acceptance criteria**

- The breadcrumb matches the active route.
- Home navigates to Dashboard without a full-page reload.

### FR-005 — Customer and Product placeholder pages

**Priority:** Must

The Customers page shall display a Customers heading and **Customer management is under development.** The Products page shall display a Products heading and **Product management is under development.** These pages establish future route destinations only; they shall not provide CRUD workflows.

**Acceptance criteria**

- Each route displays its corresponding heading and exact placeholder message.
- Neither page provides create, edit, or delete controls or workflows.

### FR-006 — Dashboard data and presentation

**Priority:** Must

The Dashboard shall continue to display forecast, customer, and product data returned by the existing API. It shall request `GET /api/weatherforecast?count=5`, `GET /api/customers`, and `GET /api/products` using the configured API base URL. Weather values shall be clearly identified as generated sample data, not live or location-specific forecasts.

**Acceptance criteria**

- Dashboard shows the returned forecast date, summary, and temperatures, customer names and emails, and product names and prices.
- Weather is identified as generated sample data.
- Summary/stat cards and focused reusable standalone presentation components remain in use.
- Presentation components receive typed data/state and remain independent of the API service.

### FR-007 — Independent dataset states and retry

**Priority:** Must

Weather, customer, and product datasets shall each display independent loading, error-with-retry, successful-empty, and successful-data states. A retry shall request only the failed dataset. A failure in one dataset shall not prevent the others from loading or displaying.

**Acceptance criteria**

- A pending request displays that dataset's loading state.
- A successful empty collection displays a clear empty state, not an error.
- A failed request displays a user-facing error and retry control, not an empty state.
- Retrying a failed dataset does not reload or suppress successful datasets.

### FR-008 — Existing sample data and CORS behavior

**Priority:** Must

The API shall provide three fictional customer records and three sample product records from in-memory repositories; the records reset when the API restarts. Development CORS shall allow `http://localhost:4200`. Other environments shall require explicitly configured allowed origins and shall not use wildcard origins.

**Acceptance criteria**

- A fresh API process exposes three sample customers and three sample products.
- The Development API allows the Angular development origin.
- Outside Development, an explicit origin configuration is required and wildcard origins are not accepted.

### FR-009 — Accessibility, responsiveness, and documentation

**Priority:** Must

The UI shall target WCAG 2.1 AA, including navigation, breadcrumbs, the responsive menu/drawer, and announcements of dashboard state. The application shall remain usable on desktop and small screens. Documentation shall describe running the API and frontend together and configuring the API base URL and CORS origins.

**Acceptance criteria**

- Navigation and page content remain usable at supported narrow and desktop viewports.
- Interactive elements are keyboard-operable, have accessible names and visible focus, and communicate the active route.
- Breadcrumbs have accessible semantics; loading and error states are announced appropriately.
- Documentation includes the local API/frontend run instructions and API URL/CORS configuration.

## User Journeys

### Normal flow

1. A user opens the application at `/` and arrives at Dashboard.
2. The user views weather, customers, and products as their requests complete.
3. The user navigates to Customers or Products through the feature navigation and sees the corresponding placeholder page.
4. The user returns to Dashboard through the wordmark or Home breadcrumb.

### Alternative flow

- A user opens `/dashboard`, `/customers`, or `/products` directly.
- On a small screen, a user opens the accessible menu/drawer and selects Customers or Products.
- A successful API response contains an empty collection; the corresponding section displays its empty state.

### Exception flow

- One dataset request fails; its section displays an error and retry action while the other sections continue independently.
- A user opens an unknown path; the application redirects to Dashboard.
- A non-Development API starts without explicit allowed origins or with an invalid/wildcard origin; startup/configuration must fail rather than broaden access.

## Non-Functional Requirements

- **Performance:** No numeric latency, throughput, or capacity target is specified. Keep requests independent and avoid delaying unrelated sections.
- **Security:** Do not introduce credentials, authentication, authorization, wildcard CORS, or trusted rendering of API strings.
- **Availability:** Local application data display depends on the API being available; failures must remain visible and retryable.
- **Maintainability:** Preserve the existing standalone Angular and API patterns; keep routing/shell responsibilities separate from dashboard data presentation.
- **Monitoring and logging:** No new logging or telemetry requirement is introduced. Do not expose stack traces, internal host details, or sensitive configuration in UI errors.
- **Scalability:** No additional scale target is specified.
- **Accessibility:** Target WCAG 2.1 AA for the UI, including responsive navigation, breadcrumbs, state announcements, keyboard use, focus visibility, and sufficient contrast.

## Constraints

- **Technical:** Implement in `src/frontend/`; use existing Angular and Angular Material versions/patterns. Verify the configured Angular version when implementation begins and upgrade only if required. Keep the root template to a router outlet and preserve existing API contracts.
- **Business:** The issue's acceptance criteria define success; do not add customer/product management workflows.
- **Operational:** The API and frontend are run separately for local development. CORS origins outside Development are explicit environment configuration.

## Assumptions

- Dashboard users are the intended audience; no other stakeholder roles were identified.
- Existing API response models and endpoints remain the source of truth.
- The issue's specified seed data is fictional demonstration data.
- The current API base URL environment configuration is appropriate for local development and remains configurable per build environment.

## Risks

- API availability, local HTTPS certificate trust, or CORS misconfiguration can prevent data retrieval; independent visible error states are required.
- The responsive menu, active route indication, breadcrumb navigation, and state announcements must meet the agreed accessibility target.
- Generated weather data may be misunderstood as live unless the sample-data label remains clear.

## Out Of Scope

- Customer or product CRUD operations and forms.
- Live weather-provider integration or geolocation.
- Persistent storage for sample records.
- Authentication and authorization.
- Production hosting or deployment-specific origin selection.
- Changes to existing API resource contracts.

## Dependencies

- The configured API base URL and existing weather, customer, and product API endpoints.
- The API Development CORS allowlist and explicit non-Development allowed-origin configuration.
- Browser support for the Angular application and, locally, trust of the API HTTPS certificate if HTTPS is used.

## Open Items

None; the specification package is approved by the user for handoff to `#setup`.
