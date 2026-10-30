# Issue #14 Requirement Discovery Summary

**Work item:** [#14 — Standardize API responses and extract shared frontend patterns](https://github.com/umair2malpara/dotnet-agentic-poc/issues/14)<br />
**Source:** GitHub Issue<br />
**Type:** Enhancement / refactoring<br />
**Discovery status:** Complete; the user confirmed the shared understanding on 2026-10-30

## Business Goal

Make API outcomes and common frontend interactions predictable and reusable, so users and API consumers receive consistent behavior and future pages can build on shared patterns.

## Approved Requirements

- Define and use a strongly typed common success response contract across existing API endpoints.
- Standardize validation and unexpected error responses, centralize their handling, preserve appropriate HTTP status codes, and do not expose internal exception details.
- Route Angular HTTP requests through shared handling for the API contract and common errors.
- Keep endpoint-specific communication in API services and UI behavior in components.
- Show success notifications for successful changes and explicit refreshes, but not automatic/background reads.
- Suppress a global failure toast when the same failure is clearly explained inline.
- Reserve warnings for recoverable or cautionary conditions that are not ordinary success or failure.
- Extract and consistently use reusable top navigation, configurable left navigation, page title/breadcrumb, and floating action bar components where applicable to the existing UI.
- Centralize navigation configuration and avoid abstractions for one-off behavior.
- Add/update relevant backend and frontend tests and documentation; backend and frontend builds and relevant tests must pass.

## Confirmed Contract Decisions

- Success outcomes use a typed `ApiResponse<T>` wrapper; failures use RFC Problem Details, including validation problem details.
- Successful operations that currently return `204 No Content` will return `200 OK` with the success wrapper, because a `204` response cannot carry a response body.
- Success notifications are opt-in for successful changes and explicit refreshes. Automatic/background reads remain silent.
- The shared failure notification is suppressed when the same failure is already clearly presented inline.
- Warnings are limited to recoverable/cautionary conditions, such as a successful mutation followed by an unsuccessful refresh.

## Current-State Context

- The API targets ASP.NET Core 10. Existing customer, product, and weather controllers return resource payloads directly; error responses include empty not-found responses, a raw product validation string, and Problem Details for bulk-delete failures.
- The API has a correlation-ID middleware that logs request outcomes and returns an `X-Correlation-Id` header.
- The Angular application targets Angular 22 and currently uses `provideHttpClient()` without an interceptor.
- `AppShellComponent` owns the top bar, hard-coded feature links, route-aware breadcrumbs/page context, responsive sidebar behavior, and toast rendering.
- `ActionBarComponent` and `NotificationService` already exist and should be reused where appropriate rather than duplicated.
- Existing API and Angular consumers/tests must be considered when changing response status and body shapes.

## Risks and Dependencies

- Wrapping all successful responses changes the API wire format and requires updating all Angular consumers and relevant tests.
- Changing successful no-content operations from 204 to 200 is an intentional compatibility change that must be documented.
- Centralized notifications must coordinate with inline UI errors to avoid duplicate or misleading feedback.
- Shell extraction must preserve existing navigation, breadcrumbs, responsive behavior, accessibility, and feature flows.

## Shared Understanding

Complete. No unresolved business-requirement questions remain. Technical design recommendations in the specification package remain subject to human approval before implementation.
