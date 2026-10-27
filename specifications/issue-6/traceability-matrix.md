# Issue #6 Traceability Matrix

**Work item:** [#6 — Enhance the Angular Dashboard with Customer and Product Navigation](https://github.com/umair2malpara/dotnet-agentic-poc/issues/6)
**Discovery:** Complete; shared understanding confirmed
**Specification status:** Approved by the user for the #setup handoff

Each approved functional and non-functional requirement maps to a design component and one or more verifiable BDD scenarios.

| Requirement | Design / implementation component | Test case(s) |
|---|---|---|
| FR-001 — SPA routes, redirects, direct loading, router-outlet root, and lazy routes | `app.routes.ts`; route-level `AppShellComponent`; root `App` | BDD-001, BDD-002, BDD-003, BDD-016, BDD-023 |
| FR-002 — Wordmark returns to Dashboard | `AppShellComponent` top bar and Angular Router link | BDD-004, BDD-017 |
| FR-003 — Exactly Customers/Products navigation and accessible compact small-screen menu | `AppShellComponent`; responsive navigation and menu state | BDD-005, BDD-006, BDD-024, BDD-027 |
| FR-004 — Route-specific breadcrumb with Home link | `AppShellComponent`; child route metadata | BDD-007, BDD-017, BDD-024 |
| FR-005 — Customer and Product placeholder routes/messages with no CRUD | `CustomersComponent`; `ProductsComponent` | BDD-008, BDD-009, BDD-025 |
| FR-006 — Dashboard API data, sample-weather disclosure, reusable typed components | Existing `DashboardComponent`, `DashboardApiService`, typed models, and presentation components | BDD-010, BDD-011, BDD-026, BDD-030 |
| FR-007 — Independent loading, error/retry, empty, and success states | Existing `DashboardComponent` dataset state; `DatasetStatusComponent`; dataset presentation components | BDD-018, BDD-019, BDD-020, BDD-021, BDD-022 |
| FR-008 — Seed data and exact/no-wildcard CORS behavior | Existing in-memory repositories and API CORS policy in `Program.cs` | BDD-012, BDD-013, BDD-014 |
| FR-009 — WCAG 2.1 AA target, responsive behavior, and run/configuration documentation | `AppShellComponent`; feature and dashboard styles; root `README.md` | BDD-006, BDD-015, BDD-024, BDD-027, BDD-028, BDD-029 |
| NFR — Keep application API contracts backward compatible | Existing API controllers, services, repositories, and frontend API service | BDD-010, BDD-012, BDD-030 |
| NFR — Do not expose secrets/internal diagnostics and render API values safely | Angular interpolation and user-facing dataset errors; environment configuration | BDD-021, BDD-026 |
| NFR — Keep routes and requests usable under independent completion/failure | Angular Router shell and independent Dashboard dataset state | BDD-003, BDD-018, BDD-019, BDD-022, BDD-023 |

## Test Artifact Mapping

| Test area | Expected test location or method |
|---|---|
| Route redirects and direct route rendering | Existing `src/frontend/src/app/app.spec.ts`, extended with shell and feature routes |
| Shell navigation, breadcrumb labels/links, active route, accessible menu behavior | New `src/frontend/src/app/app-shell/app-shell.component.spec.ts` and/or router integration coverage |
| Customer and Product page content and no-CRUD scope | New feature component specs under `src/frontend/src/app/features/customers/` and `products/` |
| Dashboard API requests and independent dataset state/retry/empty behavior | Existing `dashboard-api.service.spec.ts` plus focused Dashboard/component coverage |
| Customer/product seed count and shape | Existing `src/backend/Tests/Repositories/InMemoryRepositorySeedTests.cs` |
| Development and non-Development CORS configuration | Existing API CORS behavior/configuration verification; add focused coverage if current tests do not exercise startup policy |
| Responsive layout, keyboard/focus, contrast, announcements | Manual accessibility and responsive verification supplemented by automated component checks where practical |

## Traceability Notes

- Existing backend seeds and CORS configuration already implement their related requirements; the implementation should preserve and verify these rather than duplicate them.
- Existing issue #6 specifications described the prior fragment-navigation scope and were superseded by the confirmed requirements documented in this package.
- The user approved this specification package before handoff to `#setup`.
