# Issue #11 BDD Test Specification

**Status:** Approved by the user on 2026-10-28<br />
**Issue:** [#11 — Implement customer CRUD management pages](https://github.com/umair2malpara/dotnet-agentic-poc/issues/11)

Scenarios describe expected observable behavior. Frontend scenarios should use the configured Angular/Vitest test setup and mocked HTTP; backend scenarios should use xUnit and the existing API/repository test project. No implementation or tests are created in this specification phase.

**Approved UX amendment:** The user approved TC-031–TC-037 on 2026-10-28.

**Approved layout amendment:** The user approved TC-038 on 2026-10-28.

## Success Scenarios

### TC-001 — Load the customer list

**Given** the customer API returns customer records<br />
**When** the user opens Customers<br />
**Then** the page displays each customer's name and email<br />
**And** the table is operable at desktop and mobile sizes using keyboard and assistive technology

### TC-002 — Create a customer

**Given** the user is on the dedicated creation page with valid name and email<br />
**When** the user saves<br />
**Then** the API receives trimmed values<br />
**And** a success toast is shown followed by a dialog asking whether to return to the list<br />
**When** the user chooses Yes<br />
**Then** the user returns to the list<br />
**When** the user chooses No<br />
**Then** the user stays on a blank form ready to add another customer

### TC-003 — Edit a customer

**Given** exactly one customer is selected and still exists<br />
**When** the user opens Edit<br />
**Then** the form is populated with that customer's current values<br />
**When** the user saves valid changes<br />
**Then** the API updates the record and a success toast is shown<br />
**And** a dialog asks whether to return to the list<br />
**When** the user chooses Yes<br />
**Then** the user returns to the list<br />
**When** the user chooses No<br />
**Then** the user stays on the form with saved values and Save is disabled until a value changes

### TC-004 — Confirm and delete selected customers

**Given** one or more customers are selected<br />
**When** the user chooses Delete and confirms Yes in the blocking dialog<br />
**Then** the frontend sends one request to the bulk-delete endpoint containing the selected IDs<br />
**And** on success all selected rows are removed and selection is cleared

### TC-005 — Cancel create, edit, or delete

**Given** the user is creating or editing a customer, or has requested deletion<br />
**When** the user cancels the form or dismisses the delete confirmation<br />
**Then** no corresponding mutation request is sent<br />
**And** existing customer data remains unchanged

### TC-006 — Split resource services without changing dashboard behavior

**Given** the dashboard uses the customer, product, and weather resource services<br />
**When** the dashboard loads<br />
**Then** it requests five weather forecasts and loads all three datasets independently<br />
**And** existing counts, loading/error/retry behavior, and rendered dataset content remain unchanged

### TC-007 — Display empty customer list

**Given** the customer API successfully returns no records<br />
**When** the user opens Customers<br />
**Then** the page displays an announced empty state<br />
**And** list actions remain in their correct disabled/enabled state

### TC-008 — Seed deterministic sample customers

**Given** a new in-memory customer repository is created<br />
**When** its records are retrieved<br />
**Then** exactly 20 fictional customers are present<br />
**And** the existing three sample records remain present with non-empty names and `@example.test` emails

## Validation Scenarios

### TC-009 — Reject invalid create/update values in the form

**Given** the user submits a blank/whitespace-only name or missing/malformed email<br />
**When** the form validates<br />
**Then** it displays accessible field-level validation feedback<br />
**And** it does not send a mutation request

### TC-010 — Enforce customer validation through the API

**Given** an API caller submits an empty/whitespace-only name or missing/malformed email (including `a..b@example.test`, `.a@example.test`, `a.@example.test`, `a@localhost`, or `"person"@example.test`) to create or update<br />
**When** the API validates the request<br />
**Then** it returns HTTP 400<br />
**And** it does not create or update a customer

### TC-011 — Trim customer values and permit duplicate email

**Given** a valid customer request contains leading/trailing whitespace and an email already used by another customer<br />
**When** the customer is created or updated<br />
**Then** the persisted name and email are trimmed<br />
**And** email syntax accepted by both form and API is accepted<br />
**And** duplicate email is accepted

### TC-012 — Validate bulk-delete request shape

**Given** the bulk-delete request contains an empty ID collection or malformed JSON/IDs<br />
**When** the API processes it<br />
**Then** it returns HTTP 400<br />
**And** no customer is deleted

### TC-013 — Enforce selection-dependent actions

**Given** no rows, exactly one row, or multiple rows are selected<br />
**When** the customer grid renders its actions<br />
**Then** Delete is enabled only when at least one row is selected<br />
**And** Edit is enabled only when exactly one row is selected

## Error Handling Scenarios

### TC-014 — Preserve all records when any bulk ID is missing

**Given** a bulk-delete request includes existing IDs and at least one missing ID<br />
**When** the API processes the request<br />
**Then** it returns HTTP 404 with a clear failure response<br />
**And** none of the existing requested records are deleted

### TC-015 — Preserve list and selection after bulk-delete failure

**Given** selected customers are displayed and the atomic delete API fails<br />
**When** the UI receives the failure<br />
**Then** all displayed records and the selection remain<br />
**And** a retryable error is announced without a success message

### TC-016 — Show list loading and retrieval error states

**Given** the customer list request is pending or fails<br />
**When** the page renders the request state<br />
**Then** a visible, announced loading state or actionable error state is shown<br />
**And** the error is not rendered as an empty successful list

### TC-017 — Show create/update API failure

**Given** a valid form is submitted and the API request fails<br />
**When** the UI receives the error<br />
**Then** it keeps the user on the form with an actionable error<br />
**And** it displays an accessible error toast<br />
**And** it does not navigate away or claim the record was saved

### TC-018 — Handle customer not found during edit

**Given** a customer was removed after the list was loaded<br />
**When** the edit page requests that customer<br />
**Then** the UI displays a clear not-found/error state<br />
**And** it provides a way to return to the list

### TC-019 — Distinguish mutation success from list-refresh failure

**Given** a create or update mutation succeeds and the user chooses Yes to return
**And** the following list refresh fails<br />
**When** the UI reports the outcome<br />
**Then** it communicates that the mutation succeeded but refresh failed<br />
**And** it presents an accessible warning toast with the distinct save and refresh outcome
**And** a successful retry confirms that the customer list was refreshed
**And** it does not misreport the mutation as failed or the refresh as successful

## Edge Cases

### TC-020 — Deduplicate repeated IDs in a bulk request

**Given** a bulk-delete request includes the same existing ID more than once<br />
**When** the API processes the request<br />
**Then** the customer is deleted once<br />
**And** the request succeeds without partial deletion

### TC-021 — Prevent concurrent mutations from partially applying a batch

**Given** another request attempts to mutate a customer while a bulk delete is being applied<br />
**When** the operations execute concurrently<br />
**Then** the repository serializes relevant reads/mutations around the batch<br />
**And** the bulk request either deletes all requested existing IDs or deletes none

### TC-022 — Clear selection after successful list refresh

**Given** a successful bulk deletion removes selected records<br />
**When** the customer list refreshes<br />
**Then** removed records are absent<br />
**And** no deleted IDs remain selected

## Security Scenarios

### TC-023 — Validate IDs and customer input at the API boundary

**Given** a client bypasses frontend validation<br />
**When** it sends invalid customer fields or an invalid bulk-delete request<br />
**Then** the API rejects the request without mutating data

### TC-024 — Avoid exposing customer data in logs or markup

**Given** customer names and emails are rendered or an API request fails<br />
**When** the application displays the values or records the failure<br />
**Then** customer text is rendered as escaped Angular interpolation<br />
**And** submitted customer values and raw exception details are not logged or exposed

### TC-025 — Keep demo access and CORS scope explicit

**Given** the frontend calls customer CRUD endpoints from its configured origin<br />
**When** the API applies CORS<br />
**Then** the configured frontend origin is permitted for required CRUD methods<br />
**And** no wildcard origin or claim of authentication is introduced

## Non-Functional Scenarios

### TC-026 — Operate the customer UI by keyboard

**Given** a user navigates without a pointer<br />
**When** they select rows, open forms, validate fields, confirm deletion, and activate actions<br />
**Then** all controls are reachable and operable by keyboard<br />
**And** focus and validation/status information remain perceivable

### TC-027 — Announce asynchronous and validation states

**Given** a customer operation is loading, fails, returns empty, or has invalid fields<br />
**When** the page state changes<br />
**Then** assistive technology receives meaningful status or error announcements<br />
**And** status is not communicated by color alone

### TC-028 — Regress dashboard behavior after service split

**Given** customer, product, or weather service requests succeed or fail independently<br />
**When** the dashboard renders each dataset<br />
**Then** one dataset's failure does not block the others<br />
**And** the existing five-forecast request and retry actions remain unchanged

### TC-029 — Navigate the customer breadcrumb hierarchy

**Given** the user opens the customer creation page<br />
**When** the breadcrumb renders<br />
**Then** it displays `Home > Customers > Add New`<br />
**And** activating the Customers breadcrumb navigates to `/customers`

### TC-030 — Keep Angular feature responsibilities localized

**Given** a developer changes a feature's routes or behavior tests<br />
**When** they locate the corresponding route definitions, model contracts, and tests<br />
**Then** those artifacts are in the relevant feature or focused model file<br />
**And** the root route table only composes feature-owned routes

## Approved UX Amendment Scenarios

### TC-031 — Keep customer actions visible while scrolling

**Given** the user is on the customer list or customer create/edit form<br />
**When** the user scrolls the page at desktop or mobile width<br />
**Then** a reusable action bar remains fixed at the bottom of the viewport<br />
**And** it does not obscure page content or focused controls

### TC-032 — Enable customer list actions according to selection

**Given** no, one, or multiple customers are selected<br />
**When** the customer action bar renders<br />
**Then** Edit is enabled only for exactly one selection<br />
**And** Delete is enabled only when at least one customer is selected

### TC-033 — Show form actions in the shared action bar

**Given** the user is creating or editing a customer<br />
**When** the form is invalid, submitting, unchanged after save, or valid and changed<br />
**Then** Save has the corresponding disabled or enabled state in the shared action bar<br />
**And** Cancel is available in the shared action bar

### TC-034 — Confirm deletion in a reusable blocking dialog

**Given** one or more customers are selected<br />
**When** the user chooses Delete<br />
**Then** a reusable dialog identifies the deletion and offers Yes and No<br />
**And** the background is inert and focus stays within the dialog<br />
**When** the user chooses No or presses Escape<br />
**Then** the dialog closes without a request and selection remains<br />
**When** the user chooses Yes<br />
**Then** the atomic delete request is sent

### TC-035 — Decide whether to return after a successful save

**Given** customer creation or update succeeds<br />
**When** the success toast is displayed<br />
**Then** a reusable dialog asks whether to return to the customer list<br />
**When** the user chooses Yes<br />
**Then** the user navigates to the customer list<br />
**When** the user chooses No<br />
**Then** after create, the user remains on a blank form ready to add another customer<br />
**And** after edit, the user remains on the form with saved values and Save is disabled until a value changes

### TC-036 — Notify mutation failures with an error toast

**Given** a create, update, or delete request fails<br />
**When** the UI receives the failure<br />
**Then** an accessible error toast is displayed<br />
**And** the form values or list selection remain available for correction or retry

### TC-037 — Cancel deletion from the blocking dialog

**Given** the customer deletion dialog is open<br />
**When** the user chooses No or presses Escape<br />
**Then** the dialog closes and focus returns to the Delete action<br />
**And** no delete request is sent and the selection remains

## Approved Layout Amendment Scenario

### TC-038 — Keep page context and actions visible and independently collapsible

**Given** the user is on a customer page with breadcrumbs, a centered title/description group, and page actions<br />
**When** the user scrolls the page<br />
**Then** the compact context bar stays close below the top navbar with breadcrumb on the left and title/description together in the center<br />
**And** Add New is available in the customer-list action bar<br />
**When** the user hides the context bar or action bar<br />
**Then** only the selected bar is hidden and its show control remains available<br />
**And** the other bar retains its current visibility state<br />
**And** the content remains usable at narrow viewport widths without horizontal overflow

## Approved Floating Bars and Sidebar Amendment Scenarios

### TC-039 — Keep floating bars within the main-content area

**Given** the desktop feature sidebar is expanded or collapsed<br />
**When** the user scrolls a page with the context and action bars visible<br />
**Then** each bar floats within the main-content area without crossing or covering the sidebar<br />
**And** the context bar remains below the top navbar and the action bar remains above the bottom edge<br />
**And** the content remains usable at desktop and mobile widths without horizontal overflow

### TC-040 — Hide and restore each floating bar independently

**Given** the context and action bars are independently visible<br />
**When** the user hides either bar<br />
**Then** that bar's surface is removed from view and a compact restore control remains at its corresponding upper-right or lower-right position in the main-content area<br />
**And** the other bar and its state remain unchanged<br />
**When** the user activates the restore control<br />
**Then** only that bar returns to the main-content area<br />
**And** the page-context restore control is an eye icon and the action-bar restore control reads “Show actions”<br />
**And** the action-bar hide control uses an eye-off icon

### TC-041 — Collapse and restore the desktop feature sidebar

**Given** the user is viewing the application at desktop width<br />
**When** the user activates the sidebar toggle<br />
**Then** the sidebar stops consuming layout width and the main content expands<br />
**And** the toggle remains available with an accessible name and expanded state to restore the sidebar<br />
**And** the context and action bar visibility states do not change<br />
**When** the viewport is mobile width<br />
**Then** the existing mobile navigation behavior remains available
