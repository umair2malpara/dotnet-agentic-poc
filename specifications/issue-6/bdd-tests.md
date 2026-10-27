# Issue #6 BDD Test Specification

**Work item:** [#6 — Enhance the Angular Dashboard with Customer and Product Navigation](https://github.com/umair2malpara/dotnet-agentic-poc/issues/6)
**Discovery:** Complete; shared understanding confirmed
**Specification status:** Approved by the user for the #setup handoff

Scenarios define observable behavior. Frontend tests shall use the repository's configured Angular/Vitest runner and controlled API responses. API seed and CORS behavior shall be validated without external services.

## Success Scenarios

### BDD-001 — Redirect the root URL

**Given** the SPA is loaded at `/`
**When** the router resolves the initial URL
**Then** the URL becomes `/dashboard`
**And** the Dashboard page is rendered inside the router outlet
**And** no full-page navigation occurs

### BDD-002 — Redirect unknown paths

**Given** the SPA is loaded at an unknown path
**When** the router resolves the URL
**Then** it redirects to `/dashboard`
**And** Dashboard is rendered

### BDD-003 — Open each route directly

**Given** a user opens `/dashboard`, `/customers`, or `/products` directly
**When** the SPA initializes
**Then** the matching page is rendered
**And** the shared application shell is present
**And** navigation does not require a full-page reload

### BDD-004 — Display the wordmark and return to Dashboard

**Given** the user is on Customers or Products
**When** the user activates the **Dotnet Agentic POC** wordmark
**Then** the client-side route changes to `/dashboard`
**And** the Dashboard page is rendered without a full-page reload

### BDD-005 — Restrict feature navigation to Customers and Products

**Given** the application shell is displayed on desktop
**When** the feature navigation is inspected
**Then** it contains exactly the Customers and Products links
**And** it contains no Dashboard, Weather, or Overview link
**And** each link navigates to its corresponding route

### BDD-006 — Navigate using the compact menu on a small viewport

**Given** the application is displayed at a small viewport
**When** the user opens the accessible navigation menu/drawer
**Then** Customers and Products links are available
**And** the menu can be operated using the keyboard
**And** selecting a link navigates to that route and communicates the active route

### BDD-007 — Display route-specific breadcrumbs

**Given** Dashboard, Customers, or Products is active
**When** the route's breadcrumb is rendered
**Then** it displays respectively `Home / Dashboard`, `Home / Customers`, or `Home / Products`
**And** Home is a link to `/dashboard`

### BDD-008 — Display the Customers placeholder

**Given** the `/customers` route is active
**When** the page is rendered
**Then** it displays a Customers heading
**And** it displays **Customer management is under development.**
**And** it provides no CRUD workflow

### BDD-009 — Display the Products placeholder

**Given** the `/products` route is active
**When** the page is rendered
**Then** it displays a Products heading
**And** it displays **Product management is under development.**
**And** it provides no CRUD workflow

### BDD-010 — Request and display all dashboard datasets

**Given** the Dashboard is active and the API returns all three collections
**When** dashboard data loads
**Then** the frontend requests `GET /api/weatherforecast?count=5`, `GET /api/customers`, and `GET /api/products` from the configured base URL
**And** it displays forecast date, summary, and temperature, customer name and email, and product name and price
**And** weather is clearly labeled generated sample data

### BDD-011 — Show summary and reusable dashboard sections

**Given** Dashboard data is displayed
**When** the dashboard is rendered
**Then** it shows summary/stat cards and weather, customer-list, and product-list sections
**And** presentation sections receive typed state and do not call the API service directly

### BDD-012 — Use existing customer and product seeds

**Given** a fresh API process has started
**When** a client requests `GET /api/customers` and `GET /api/products`
**Then** each collection contains three sample records
**And** restarting the API restores the startup records

### BDD-013 — Permit the Development frontend origin

**Given** the API runs in Development
**When** the browser sends a request with Origin `http://localhost:4200`
**Then** the configured CORS policy permits the origin

### BDD-014 — Use explicit non-Development origins

**Given** the API runs outside Development
**When** allowed origins are missing, malformed, or wildcard
**Then** startup/configuration fails rather than enabling unrestricted origins
**And** when valid explicit origins are configured, only those origins receive CORS permission

### BDD-015 — Document local full-stack setup

**Given** a developer follows the repository README
**When** they configure the API URL and CORS and start the API and frontend
**Then** the documentation provides the required commands and configuration locations
**And** it no longer describes the replaced fragment-only dashboard navigation as current behavior

## Validation Scenarios

### BDD-016 — Keep the root template minimal

**Given** the Angular root component is compiled
**When** its template is rendered
**Then** it contains only the router outlet
**And** the shared shell is rendered beneath the route-level shell component

### BDD-017 — Keep route links client-side

**Given** a user is on any supported route
**When** the user activates the wordmark, breadcrumb Home, or feature navigation link
**Then** Angular Router changes the route
**And** the browser document is not reloaded

## Error Handling Scenarios

### BDD-018 — Show independent loading states

**Given** the three dashboard requests are pending
**When** dashboard sections render
**Then** each pending dataset displays its own loading state and accessible status announcement

### BDD-019 — Show an independent retryable error

**Given** the product request fails while weather and customers succeed
**When** dashboard state updates
**Then** the product section displays a user-facing error and retry control
**And** weather and customers continue to display their successful results
**And** retry reissues only the product request

### BDD-020 — Distinguish an empty success from a failure

**Given** a dataset request succeeds with an empty collection
**When** its section renders
**Then** it displays the successful-empty state
**And** it does not display an error or retry control

### BDD-021 — Do not replace failures with empty or sample data

**Given** a dashboard API request fails with a network or HTTP error
**When** the corresponding section handles the result
**Then** it displays an error state
**And** it does not display the successful-empty state or fallback sample records

## Edge Cases

### BDD-022 — Complete dataset requests at different times

**Given** the weather, customer, and product requests complete in different orders
**When** each response arrives
**Then** only the matching dataset state changes
**And** a pending or failed request does not block another dataset's successful display

### BDD-023 — Handle direct route refresh

**Given** the user directly opens or refreshes `/customers` or `/products`
**When** the SPA route resolves
**Then** the corresponding placeholder page and shell are rendered

### BDD-024 — Preserve route-specific content on navigation

**Given** the user selects Customers or Products from the responsive navigation
**When** the route changes
**Then** the breadcrumb and placeholder content match the selected route
**And** the page remains usable without horizontal scrolling for its primary layout

## Security Scenarios

### BDD-025 — Do not expose mutation workflows on placeholders

**Given** Customers or Products placeholder page is active
**When** the rendered page is inspected and operated
**Then** no create, edit, or delete UI or action is available

### BDD-026 — Do not render API values as trusted HTML

**Given** an API response contains text with HTML-like characters
**When** the dashboard renders the value
**Then** Angular renders it as text rather than executable trusted HTML

## Non-Functional Scenarios

### BDD-027 — Operate navigation using keyboard

**Given** a user navigates without a pointer
**When** they move focus through the shell, open/close the responsive menu, and activate links
**Then** controls are keyboard-operable
**And** focus remains visible and is managed appropriately when the menu opens or closes

### BDD-028 — Announce route and request state accessibly

**Given** a screen-reader user is using the application
**When** the route changes or a dataset enters loading or error state
**Then** the active page/navigation and state changes are exposed through appropriate semantics and announcements

### BDD-029 — Meet responsive and accessibility target

**Given** the application is viewed at supported desktop and small viewport sizes
**When** navigation, breadcrumbs, page content, and dashboard states are evaluated
**Then** the primary layout remains usable without avoidable horizontal scrolling
**And** the UI is verified against the agreed WCAG 2.1 AA target, including color contrast and focus visibility

### BDD-030 — Preserve API contracts

**Given** the frontend is updated
**When** existing API consumers call the customer, product, or weather endpoints
**Then** routes and response shapes remain unchanged
