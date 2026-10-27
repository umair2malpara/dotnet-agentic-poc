# Issue #6 Requirement Discovery Summary

**Work item:** [#6 — Enhance the Angular Dashboard with Customer and Product Navigation](https://github.com/umair2malpara/dotnet-agentic-poc/issues/6)
**Source:** GitHub Issue
**Type:** Enhancement
**Requester and assignee:** umair2malpara
**Discovery status:** Complete; shared understanding confirmed by the user
**Specification status:** Approved by the user for the #setup handoff

## Business Goal

Provide a clear, responsive way for dashboard users to navigate among Dashboard, Customers, and Products, while making dashboard datasets independently useful during loading, empty, and error conditions. Success is defined by the acceptance criteria in issue #6; no separate business KPI or performance target is required.

## Approved Requirements

- `/` and unknown paths redirect to `/dashboard`. Dashboard, Customers, and Products routes work when opened directly without full-page navigation.
- The **Dotnet Agentic POC** wordmark navigates to Dashboard.
- The left navigation contains exactly **Customers** and **Products**. On small screens, provide an accessible compact menu/drawer.
- Breadcrumbs display `Home / Dashboard`, `Home / Customers`, or `Home / Products`; **Home** links to `/dashboard`.
- Customer and Product pages show their exact under-development messages and provide no CRUD operations.
- The dashboard displays weather, customer, and product data from the configured API. Request five weather forecasts. Identify weather values as generated sample data, not live or location-specific forecasts.
- Each dataset independently shows loading, error-with-retry, and successful-empty states. A failure in one dataset must not prevent the others from loading or displaying.
- Use reusable standalone dashboard presentation components with typed data and clear state/presentation responsibilities.
- Retain the three fictional customer and three sample product seeds, which reset when the API restarts.
- Development CORS permits `http://localhost:4200`; other environments require explicit allowed origins and must not use wildcard origins.
- Target WCAG 2.1 AA for navigation, breadcrumbs, responsive menu, dashboard state announcements, and the UI generally.
- Document how to run the API and frontend together and configure the API URL and CORS origins.

## Confirmed Constraints and Exclusions

Preserve behavior that already meets the requirements, use existing API contracts and Angular conventions, and do not implement customer/product CRUD, live weather/geolocation, persistent sample data, authentication/authorization, or production hosting/origin selection.

## Current-State Context

The repository already has typed dashboard API requests and presentation components, separate request states and retry actions, empty-state rendering, generated-weather labeling, three customer/product sample records, and Development/non-Development CORS configuration. Existing routing and dashboard navigation do not yet meet the requested route, sidebar, and breadcrumb behavior. Existing issue #6 specifications described an earlier scope and must be superseded by this package.

## Risks and Dependencies

- The frontend depends on the configured API base URL, API availability, browser trust of the local HTTPS certificate when applicable, and matching CORS configuration.
- Navigation and state announcements must be designed and verified against the agreed accessibility target.
- The sample records and weather forecasts are demonstration data, not persistent records or live forecasts.

## Shared Understanding

Complete. The user confirmed the requirements, responsive-menu behavior, clickable Home breadcrumb, WCAG 2.1 AA target, and acceptance criteria as the success measure. No unresolved discovery questions remain.
