# Issue #6 Functional Specification

**Status:** Approved; updated to reflect implementation  
**Issue:** [Create Angular Frontend Application with Dashboard, Navbar, and API Integration](https://github.com/umair2malpara/dotnet-agentic-poc/issues/6)

## Business Objective

Provide a responsive browser-based dashboard for viewing weather forecasts, customers, and products from the existing .NET API.

## Problem Statement

The repository currently provides an ASP.NET Core API but no browser UI. Users need a single place to inspect the data exposed by the API, with clear navigation and feedback when data is loading, unavailable, or empty.

## Functional Requirements

1. Add a new Angular application in a dedicated `src/frontend/` directory. Use the latest stable Angular version available when implementation begins and Angular Material.
2. Provide a top bar with a text wordmark, “Dotnet Agentic POC,” and a left-side navigation bar.
3. Deliver the frontend as a single-page application (SPA) with Angular client-side routing. The root URL (`/`) redirects to the dashboard route (`/dashboard`); unknown paths also redirect to the dashboard.
4. Keep the initial experience on one dashboard route. Navigation links use client-side routing and route fragments to take users to the dashboard overview, weather, customer, and product sections without a full-page reload.
5. Fetch and display the following data from the configured API:
   - Weather forecasts from `GET /api/weatherforecast?count=5`.
   - Customers from `GET /api/customers`.
   - Products from `GET /api/products`.
6. Display the weather data returned by the existing API. Its generated forecast values are sample data, not live location-based weather.
7. Display customers and products as read-only dashboard content. Do not add create, edit, or delete UI.
8. Make the API base URL configurable through Angular environment configuration; do not require a source-code edit to change the API host.
9. Show a loading state while each dataset is being requested, a visible error state with a retry action when a request fails, and a distinct empty state when the API successfully returns no records.
10. Seed three fictional customers and three sample products in the existing in-memory API repositories. Seed data is for demonstration and resets when the API process restarts.
11. Configure the API to permit the Angular development origin (`http://localhost:4200`) in Development. Origins for other environments must be provided through configuration.
12. Support desktop and mobile viewport layouts, including usable navigation and dashboard content on small screens.
13. Build the dashboard from focused, reusable UI components for weather, customer list, product list, summary cards, and dataset loading/error/retry status. The dashboard feature coordinates API requests and passes typed state to the presentation components.

## Acceptance Criteria

- An Angular project exists in `src/frontend/`, builds, and runs locally.
- Navigating to `/` or an unknown path resolves to `/dashboard`; directly loading `/dashboard` renders the dashboard.
- Client-side dashboard navigation updates the route fragment and scrolls to its section without a full-page reload.
- The root application template is a minimal router outlet, and the dashboard route renders the reusable dashboard feature and data components.
- The dashboard renders a styled left navigation bar and top bar with the “Dotnet Agentic POC” wordmark.
- Selecting each navigation item moves to the corresponding section on the dashboard.
- The dashboard requests all three datasets from the API base URL configured for the environment and renders the returned fields.
- The weather section presents the forecast date, summary, and temperature; the customer section presents names and emails; the product section presents names and prices.
- On a fresh API start, the customer and product endpoints each return three fictional sample records; restarting the API resets these in-memory records.
- The API permits requests from `http://localhost:4200` in Development and uses configured origins outside Development.
- Each section independently communicates loading, successful empty results, and request errors; the user can retry a failed request.
- The page remains usable at desktop and mobile viewport sizes.

## Out Of Scope

- Customer or product create, edit, or delete operations in the UI.
- Separate routed pages for weather, customers, or products.
- Live weather providers, geolocation, or user-selectable locations.
- Persistent storage or durable demo data.
- Authentication, authorization, or role-based dashboard behavior.
- Production hosting, reverse-proxy setup, and selection of production origins.
- Changes to existing API resource contracts.

## Assumptions

- The existing API is the system of record for the displayed data.
- The API is run separately from the Angular development server.
- Angular Material is the selected component library.
- A text wordmark is sufficient; no logo asset is currently provided.
- The existing forecast endpoint’s default count of five is appropriate for the dashboard.
- The CORS Development allowlist may include the known Angular CLI origin; other origins are deployment configuration.
- Seeded data is deterministic fictional demonstration data and is not intended to represent real people or products.

## Risks

- No production API or frontend origin has been supplied, so deployment CORS configuration must be completed by the deployment owner.
- The API repositories are in-memory. Customer/product mutations made through existing API routes and all seeded data disappear on API restart.
- The weather endpoint generates sample values, which must not be presented as a live or location-specific forecast.
- The customer and product API responses are empty before seeding; dashboard empty states remain necessary for later deletions or alternative API instances.
