# Issue #11 Functional Specification

**Status:** Approved by the user on 2026-10-28<br />
**Issue:** [#11 — Implement customer CRUD management pages](https://github.com/umair2malpara/dotnet-agentic-poc/issues/11)<br />
**Source:** GitHub Issue #11<br />
**Work item type:** Enhancement<br />
**Priority:** Not specified in the issue<br />
**Reporter / assignee:** umair2malpara / umair2malpara<br />
**Discovery:** Complete; shared understanding confirmed by the user

**Review amendment:** The user approved feature-owned route definitions, resource-specific frontend model files and test suites, and hierarchical breadcrumbs with a Customers link from customer create/edit pages.

**Approved UX amendment:** The user approved on 2026-10-28 adding a reusable fixed customer action bar, accessible confirmation dialogs, mutation outcome toasts, and an explicit post-save navigation choice. The details are recorded below.

**Approved layout amendment:** The user approved on 2026-10-28 a sticky page-context bar below the top navbar, with breadcrumbs, page title, and description; Add New in the customer action bar; and independent visibility controls for the context and action bars. Follow-up feedback refined their placement, compactness, and show/hide controls as recorded below.

**Approved follow-up layout amendment:** The user approved on 2026-10-28 that the context and action bars float only within the main-content area, can be fully hidden with small restore controls, and that the desktop feature sidebar be collapsible. Details are recorded below.

## Business Objective

Provide a usable way to view and manage fictional customer records in the proof-of-concept application. Success means users can list, add, edit, and atomically delete customers through the Customers section, while receiving clear feedback for loading, validation, and failure states.

## Problem Statement

The existing Customers navigation route displays only an under-development placeholder. The API supports single-customer operations, but users have no management UI. Customer, product, and weather API calls are also combined in one Angular service rather than separated by resource.

## Functional Requirements

### FR-001 — View customers

**Priority:** Must

Display customers in a responsive, accessible grid/table with each customer's name and email.

**Acceptance criteria**

- Customer records show their name and email.
- Loading, empty, and retrieval-error states are visible and distinguishable.
- The layout and controls are usable at desktop and mobile viewport sizes and by keyboard and assistive technology.

### FR-002 — Create a customer

**Priority:** Must

Provide a dedicated customer-creation page with required name and email fields.

**Acceptance criteria**

- Add New opens the dedicated creation page.
- Blank or whitespace-only name and invalid/missing email are rejected with accessible validation feedback.
- Values are trimmed before persistence; the API independently enforces the same rules.
- Successful Save creates the customer through the API, displays a success toast, and asks whether to return to the list.
- Choosing Yes returns to the list; after create, choosing No leaves a blank form ready for another customer.
- Cancel returns without creating a customer.
- API failures remain visible and are not represented as a successful save.

### FR-003 — Edit a customer

**Priority:** Must

Provide a dedicated customer-editing page populated with the selected customer's current values.

**Acceptance criteria**

- Edit is enabled only when exactly one customer is selected.
- The edit page loads and displays the selected customer's name and email.
- Save validates and updates through the API, displays a success toast, and asks whether to return to the list.
- Choosing Yes returns to the list; after update, choosing No leaves the saved customer values on the form and Save disabled until a value changes.
- Cancel returns without saving.
- A missing customer or API failure is reported visibly; failure is not presented as a successful update.

### FR-004 — Select customers and request deletion

**Priority:** Must

Allow selection of one or more customer rows and require explicit confirmation before deletion.

**Acceptance criteria**

- Each row has an accessible checkbox and the grid exposes selection state.
- Delete is disabled when nothing is selected and enabled when one or more customers are selected.
- Edit is enabled only when exactly one customer is selected.
- A reusable blocking dialog identifies the deletion and requires explicit confirmation before a request is sent, including for a single selected customer.
- On successful deletion, removed customers disappear and selection is cleared.
- Successful deletion displays an accessible success toast; failed deletion displays an error toast without clearing the list or selection.

### FR-005 — Delete selected customers atomically

**Priority:** Must

Delete the selected customer IDs as one all-or-nothing operation.

**Acceptance criteria**

- A request containing one or more existing IDs deletes all of them.
- If any requested ID does not exist, no requested record is deleted and the API returns a clear failure.
- On failure, the UI retains the customer list and selection, displays a retryable error, and does not report success.
- The existing single-customer API endpoint remains available for compatibility.

### FR-006 — Separate resource API services

**Priority:** Must

Provide reusable Angular API services focused on customer, product, and weather resources.

**Acceptance criteria**

- Customer, product, and weather requests are owned by separate resource-specific services.
- All consumers, including the dashboard, use the appropriate focused service.
- Existing dashboard data, request parameters, loading/error/retry behavior, and visible behavior remain unchanged.
- Tests cover each resource service and relevant consumer behavior.

### FR-007 — Provide deterministic customer sample data

**Priority:** Must

Seed a deterministic total of 20 fictional customers, within the issue's requested approximate range of 20–25.

**Acceptance criteria**

- A newly constructed customer repository contains exactly 20 customers with non-empty names and fictional `@example.test` email addresses.
- The current three sample customers remain included.
- Customer records and changes remain in-memory and reset when the API restarts.

### FR-008 — Handle customer input and operation states

**Priority:** Must

Apply consistent validation and communicate operation outcomes accurately.

**Acceptance criteria**

- Both frontend forms and API create/update operations trim name and email, reject whitespace-only names, and use the same explicit email syntax: ASCII dot-atom local part (no leading, trailing, or consecutive dots), multi-label DNS domain with a 2–63 letter final label. Single-label domains and quoted local parts are rejected; duplicate email addresses are permitted.
- Loading, empty, validation, not-found, and API failure states are announced accessibly where applicable.
- Failed requests do not create a success-shaped fallback or clear the current list/selection.

### FR-009 — Preserve feature ownership and hierarchical breadcrumbs

**Priority:** Must

Keep Angular routes and tests with their feature where appropriate, keep resource model contracts separated by responsibility, and show navigable route hierarchy in the breadcrumb.

**Acceptance criteria**

- Customer, dashboard, and product feature routes are declared in their corresponding feature areas and composed by the application root routes.
- Customer, product, weather forecast, and dataset state contracts are kept in focused model files.
- Dashboard-specific behavior tests live with the dashboard feature; customer behaviors remain in customer tests; application shell/navigation tests remain at the application level.
- Customer create page breadcrumb displays `Home > Customers > Add New`; `Customers` links to `/customers`.
- Customer edit page breadcrumb displays `Home > Customers > Edit`; `Customers` links to `/customers`.
- Current breadcrumb is announced as the current page; ancestor items are navigable links.

## User Journeys

### Normal flow

1. The user opens Customers and views the list.
2. The user selects Add New, enters a name and valid email, and saves.
3. The list shows the new customer.
4. The user selects exactly one customer and opens Edit.
5. The user changes the details and saves; the list shows the updated record.
6. The user selects one or more customers, chooses Delete, confirms, and sees all selected records removed.

### Alternative flow

- The user cancels creation or editing and returns to the list without saving.
- The user clears selection; Delete and Edit are disabled.
- The user selects multiple rows; Delete remains available while Edit is disabled.
- The user corrects invalid form values after receiving validation feedback.

### Exception flow

- A list, detail, create, update, or delete request fails; the UI presents the failure and does not imply success.
- An edit target no longer exists; the user receives a clear not-found/error state and can return to the list.
- A bulk-delete request includes an ID that no longer exists; the API deletes none, and the UI retains all rows and the selection for retry or refresh.
- A successful create or update is followed by a list refresh failure; the UI must not misstate the mutation result and must explain that the displayed list could not be refreshed using an accessible warning toast and a retryable list error.

## Non-Functional Requirements

- **Performance:** No separately quantified latency or availability target. The in-memory demonstration dataset is small (20 customers); ordinary list and form operations should remain responsive.
- **Security:** Validate untrusted input in the API. The demo remains unauthenticated; production exposure is explicitly excluded. Do not log sensitive data.
- **Availability:** No availability SLA or deployment change is required.
- **Maintainability:** Keep resource API calls in focused services and components focused on presentation/navigation, following existing patterns.
- **Monitoring:** No new monitoring, metrics, or alerting requirements.
- **Logging:** Use existing application logging conventions; do not log customer email or form payloads unnecessarily. No new audit-log requirement.
- **Scalability:** Search, pagination, persistent storage, and large-dataset scalability are out of scope.
- **Accessibility:** Target WCAG 2.2 AA. Selection and actions must be keyboard operable; controls must have accessible names; validation and asynchronous states must be announced.

## Constraints

### Technical

- Use the framework, packages, route conventions, API base URL configuration, and test runners already present.
- Preserve existing individual customer endpoints and dashboard behavior.
- Keep customer data in-memory; no database or migration is introduced.
- Extend the existing frontend CORS policy only as needed for customer CRUD verbs.

### Business

- Use the existing customer fields: `id`, `name`, and `email`.
- Use fictional demonstration data only.
- Do not add search or pagination.

### Operational

- API and frontend continue to run as the existing local proof of concept.
- The API remains unauthenticated; production hosting/exposure is not approved by this work item.

## Assumptions

- Exactly 20 deterministic records is an acceptable choice within the requested approximate range.
- The current three fictional customers remain part of the seeded set.
- The existing customer endpoint contracts are retained; only a new bulk-delete endpoint is added.
- The API is the source of truth for create/update validation, while the frontend gives equivalent immediate feedback.

## Risks

- All-or-nothing behavior must remain correct under concurrent in-memory customer mutations; checking IDs and deleting them in separate unsynchronized steps would permit partial deletion.
- A failed response after an operation may be ambiguous to the user; UI messaging must distinguish mutation failure from a later list-refresh failure.
- In-memory persistence and unauthenticated access are suitable only for the agreed demo scope and must not imply production readiness.
- The current API CORS policy permits GET only; CRUD calls from the frontend will fail cross-origin until the allowed methods are updated.

## Approved UX Amendment

This amendment captures customer testing feedback approved by the user on 2026-10-28.

### FR-010 — Keep customer actions available in a persistent action bar

Provide a reusable action bar fixed to the bottom of the viewport on customer list, create, and edit pages. It remains visible while scrolling, adapts to mobile widths, and does not obscure page content.

**Acceptance criteria**

- On the customer list, Edit is disabled unless exactly one customer is selected; Delete is disabled unless at least one customer is selected.
- On create and edit forms, Save is disabled while invalid, submitting, or unchanged since the last successful save; Cancel remains available.
- The bar remains fixed while scrolling, accounts for mobile safe-area insets, and the page reserves enough bottom space to avoid obscuring content or focused controls.
- The action bar is implemented as a reusable component so other pages can supply their applicable actions without duplicating layout or enabled-state behavior.

### FR-011 — Confirm customer actions with reusable accessible dialogs

Use a reusable, customer-facing confirmation dialog for deletion and for the navigation decision after successful save.

**Acceptance criteria**

- Delete opens a dialog that identifies the number of customers to be deleted, explains that deletion cannot be undone, and provides Yes and No actions.
- While the dialog is open, background content is inert; focus is contained in the dialog and restored to the invoking control when it closes. Escape and No cancel without sending a delete request.
- Only Yes confirms deletion and sends the existing atomic bulk-delete request.
- A successful create or update first displays a success toast, then opens a dialog asking whether to return to the customer list.
- Yes navigates to the customer list. After create, No closes the dialog and resets the form to blank for another customer. After update, No leaves the saved values in place and Save disabled until the form is changed.
- The dialog is generic: its title, message, action labels, and confirmation/cancellation outcomes are supplied by the calling page.

### FR-012 — Notify users of customer mutation outcomes

Display transient, accessible toast messages for customer create, update, and delete outcomes.

**Acceptance criteria**

- Successful create, update, and delete operations display a success toast.
- Failed create, update, or delete operations display an error toast and preserve the current page state, form values, or list selection as appropriate.
- A successful create or update followed by a failed list refresh communicates both facts: the save succeeded, but the list could not be refreshed. The retryable list error remains available.
- Toasts use appropriate live-region semantics, are dismissible, and disappear automatically without blocking further interaction.

## Approved Layout Amendment

This amendment records the latest customer testing feedback, approved by the user on 2026-10-28.

### FR-013 — Keep page context and actions accessible while scrolling

Replace the separate breadcrumb row with a reusable sticky page-context bar directly beneath the top navbar. Put the current breadcrumb hierarchy on the left and group the page title with its description in the center. Move Add New from the customer-list page header into its fixed bottom action bar.

**Acceptance criteria**

- The compact page-context bar remains directly beneath the top navbar while scrolling.
- It displays the navigable breadcrumb hierarchy at left and the current page title with its description together in the center.
- On narrow viewports, the layout reflows without horizontal overflow or hiding the page title or breadcrumb navigation.
- The customer page body begins immediately below the context bar; the previous separate breadcrumb row and duplicated page title/header are removed where represented by the context bar.
- Add New is an action in the customer-list action bar and remains keyboard accessible.
- The page-context bar and bottom action bar each have one accessible show/hide control; no separate minimize/expand behavior is provided.
- Hiding either bar does not disable page actions/navigation; the user can restore it at any time.
- The hidden page-context bar has a compact eye icon restore control; the hidden action bar has a clearly labeled “Show actions” restore control.
- The action bar’s hide control uses a clear eye-off icon rather than a generic close/cancel symbol.

## Out Of Scope

- Search, pagination, sorting, or filtering.
- Persistent customer storage, database changes, migrations, or cross-restart retention.
- Authentication, authorization, production exposure, or deployment changes.
- Customer fields or business rules beyond name and email.
- Email uniqueness enforcement.
- Changes to dashboard behavior beyond switching to focused resource services.
- A quantified performance, uptime, or scalability target.

## Approved Follow-up Layout Amendment

This amendment captures the latest customer testing feedback approved by the user on 2026-10-28.

### FR-013 amendment — Float and fully hide page bars

Keep the page-context and action bars fixed while scrolling, but render them as separate floating surfaces confined to the main-content area, rather than full-viewport strips that cross or visually cut through the feature sidebar.

**Acceptance criteria**

- Both bars remain within the main-content column and never overlap or cover the sidebar, whether the desktop sidebar is expanded or collapsed.
- The compact page-context bar floats directly below the top navbar; the compact action bar floats close to the bottom edge and respects mobile safe-area insets.
- Each bar has a single accessible show/hide control. There is no separate minimize/expand state.
- While the page-context bar is hidden, a compact eye-icon restore control remains at the upper-right of the main-content area. While the action bar is hidden, its “Show actions” restore control remains at the lower-right of the main-content area.
- Restore controls are available independently, do not overlap one another, and restore only their corresponding bar.
- Hiding a bar does not disable its page navigation or actions; those remain available again when the bar is restored.
- The breadcrumb remains left-aligned while the title and description are grouped in the middle; the description is not placed on the right side.
- The action bar hide control uses an eye-off icon rather than a generic cancel/close symbol.
- Floating bars and restore controls remain usable at desktop and mobile widths without horizontal overflow or obscuring page content or focused controls.

### FR-014 — Collapse and restore the desktop feature sidebar

Allow users on wider screens to collapse the feature sidebar so the main-content area can use the available width, and restore the sidebar when needed.

**Acceptance criteria**

- A keyboard-accessible sidebar toggle is available on desktop and its accessible name and expanded state communicate the current state.
- When collapsed, the sidebar no longer consumes main-content width; the main content and floating bars expand into the available space.
- The toggle remains available to restore the sidebar. Sidebar state is independent of the context/action bar states.
- The existing mobile navigation menu behavior remains unchanged.

## Open Items

None blocking specification. The API route/body/status details and atomicity mechanism are proposed in the technical specification for review.
