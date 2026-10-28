# Issue #11 Requirement Discovery Summary

**Work item:** [#11 — Implement customer CRUD management pages](https://github.com/umair2malpara/dotnet-agentic-poc/issues/11)<br />
**Source:** GitHub Issue<br />
**Type:** Enhancement<br />
**Requester and assignee:** umair2malpara<br />
**Discovery status:** Complete; shared understanding confirmed by the user

## Business Goal

Let users manage fictional customer records through the existing Customers navigation page and dedicated create/edit pages.

## Approved Requirements

- Replace the Customers placeholder with a responsive, keyboard-accessible WCAG 2.2 AA grid displaying customer name and email.
- Provide dedicated customer creation and editing pages. Save persists through the API and returns to the list; Cancel returns without saving.
- Customer name and email are required. Trim submitted values, reject whitespace-only names, require syntactically valid email, and do not enforce uniqueness. Enforce these rules in both the UI and API.
- Use checkboxes for row selection. Enable Edit only when exactly one row is selected.
- Require confirmation before deleting one or more customers.
- Add a bulk-delete API operation that deletes all requested customers or none. If any submitted ID no longer exists, delete none and return a clear failure.
- If bulk deletion fails, retain the list and selection and show a retryable error.
- Split Angular customer, product, and weather API access into resource-focused services. Update all consumers and relevant tests without changing existing dashboard behavior.
- Seed a deterministic total of approximately 20–25 fictional customers.
- Show loading, empty, validation, and API error states visibly; never report failed work as successful.
- Keep customer data in-memory and reset it when the API restarts.
- Keep the demo unauthenticated; production exposure is out of scope.
- Do not add search or pagination. No additional quantified performance or availability SLA is required.

## Confirmed Constraints and Exclusions

The existing customer fields remain `id`, `name`, and `email`. Preserve the existing individual customer API behavior and the dashboard experience. Search, pagination, persistent storage, authentication, and production exposure are excluded.

## Current-State Context

The Customers page is currently a placeholder. The customer controller already exposes list, get-by-ID, create, update, and individual delete operations. Its repository seeds three fictional customers in memory. The Angular `DashboardApiService` currently combines weather, customer, and product requests, and the dashboard consumes that service. The API CORS policy currently permits only GET requests from the configured frontend origin; customer create, update, and delete calls from the frontend require those methods to be permitted.

## Risks and Dependencies

- Bulk deletion requires process-local atomicity across the in-memory repository, including concurrent customer mutations.
- Customer data is intentionally ephemeral, and the API remains unauthenticated; this package is for a local/demo scope, not production exposure.
- Frontend operations depend on the configured API URL, HTTPS certificate trust where applicable, and matching CORS configuration.
- The new customer screens and API behavior depend on the existing customer model and route conventions.

## Shared Understanding

Complete. The user confirmed the requirements, including atomic all-or-nothing deletion, stale-ID failure with no deletions, checkbox selection, WCAG 2.2 AA, API-side validation, and in-memory demo behavior. No unresolved discovery questions remain.
