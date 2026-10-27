# Issue #6 Technical Specification

**Status:** Approved; updated to reflect implementation  
**Issue:** [Create Angular Frontend Application with Dashboard, Navbar, and API Integration](https://github.com/umair2malpara/dotnet-agentic-poc/issues/6)

## Impact Analysis

### Controllers

- `WeatherForecastController` exposes `GET /api/weatherforecast` and accepts the optional `count` query parameter (default 5).
- `CustomersController` exposes `GET /api/customers`.
- `ProductsController` exposes `GET /api/products`.
- No controller or resource contract changes are required.

### Services

- Existing weather, customer, and product services remain the API’s business layer.
- Add no new API services unless needed to initialize seeded repository data; prefer initializing the current in-memory repositories without expanding the layering.

### Repositories

- `InMemoryCustomerRepository` currently starts empty. Initialize it with three fictional `Customer` records.
- `InMemoryProductRepository` currently starts empty. Initialize it with three sample `Product` records.
- Keep the current in-memory storage and CRUD semantics. Seed records exist for the lifetime of the API process and reset on restart.
- Use deterministic IDs and fictional values so the sample data is stable and repeatable.

### Models

- Reuse `Customer` (`Id`, `Name`, `Email`), `Product` (`Id`, `Name`, `Price`), and `WeatherForecast` (`Date`, `TemperatureC`, `TemperatureF`, `Summary`).
- Do not alter existing model or JSON contracts for this dashboard.

### DTOs

- No new API DTOs are required. The dashboard consumes the existing response shapes.
- Define frontend TypeScript interfaces for the three API response models rather than using untyped response data.

### Middleware

- No middleware changes are expected.

### Configuration

- Add Angular environment configuration for the API base URL. The Angular API services should use that setting when constructing endpoint URLs.
- Add an API CORS policy named for the frontend, registered in `Program.cs`.
- In Development, allow the known Angular development origin `http://localhost:4200`.
- In non-Development environments, read allowed origins from configuration (for example, a `Cors:AllowedOrigins` array). Do not use a wildcard origin with credentials. Production origin values are deployment-owned and must not be guessed.
- Register CORS services and apply the policy before controller endpoint execution.

### Database

- No database or migrations. The existing repositories are in-memory; seeded records are ephemeral.

## File Changes

### Files To Add

- `frontend/` Angular workspace and application generated using the Angular CLI.
- `frontend/src/app/app.routes.ts` — root, dashboard, and fallback route definitions, with the dashboard component lazy-loaded.
- `frontend/src/app/features/dashboard/` — dashboard feature component, shell template, and responsive layout styles.
- `frontend/src/app/components/dashboard-stat-card/` — reusable summary-card component.
- `frontend/src/app/components/dataset-status/` — shared loading, error, and retry component.
- `frontend/src/app/components/weather-forecast/`, `customer-list/`, and `product-list/` — typed presentation components for each dataset.
- `frontend/src/app/components/index.ts` — exports reusable dashboard components.
- Frontend API model interfaces and a typed API service for the weather, customer, and product endpoints.
- Frontend environment configuration and Angular Material setup.
- Frontend unit tests for API services, display states, reusable components, and route redirects.
- `specifications/issue-6-functional-spec.md`
- `specifications/issue-6-technical-spec.md`
- `specifications/issue-6-bdd-tests.md`

### Files To Modify

- `frontend/src/app/app.html` — keep the root template to the router outlet.
- `frontend/src/app/app.config.ts` — register the Angular router and fragment/scroll behavior.
- `DotnetAgenticPoc.Api/Program.cs` — register and apply the configured CORS policy.
- `DotnetAgenticPoc.Api/appsettings.json` — define the non-secret CORS allowed-origin configuration structure; deployment values remain environment-specific.
- `DotnetAgenticPoc.Api/Repositories/InMemoryCustomerRepository.cs` — initialize three fictional sample customers.
- `DotnetAgenticPoc.Api/Repositories/InMemoryProductRepository.cs` — initialize three sample products.
- `DotnetAgenticPoc.Api.Tests/` — add focused tests for seed contents and CORS behavior if the existing test host supports them.
- Root `README.md` — document how to run the API and frontend together, API URL configuration, Development CORS behavior, and ephemeral sample data.

### Files To Delete

- None.

## Technical Design

### Architecture Overview

- Keep the frontend as an independent Angular application under `frontend/`; do not mix Angular build artifacts or dependencies into the .NET project.
- Keep `src/app/app.html` as a minimal router outlet. Configure `/` to redirect to `/dashboard`, lazy-load the dashboard feature at `/dashboard`, and redirect unknown paths to `/dashboard`.
- Configure Angular router anchor scrolling and scroll-position restoration for the dashboard section links.
- Use Angular standalone components and the current Angular CLI defaults unless implementation reveals a repository/tooling constraint.
- Compose the dashboard page from reusable weather, customer-list, product-list, summary-card, and dataset-status components. Keep API fetching/state coordination in the dashboard feature component and pass typed state to presentation components.
- Keep presentation components independent of the API service. Data components receive a typed dataset state through inputs and emit retry events to the dashboard feature; the shared dataset-status component presents loading and error/retry UI.
- Use Angular Material for the application shell and dashboard UI, with responsive CSS for layout behavior.
- Keep HTTP access in typed Angular services using `HttpClient`; the dashboard feature owns request and loading/error/retry state.
- Retain the existing .NET controller → service → repository architecture and in-memory storage.

### Data Flow

1. The Angular router maps `/` to `/dashboard`, lazy-loads the dashboard feature, and renders it through the root router outlet without a full-page navigation.
2. On dashboard activation, the dashboard feature independently requests weather, customers, and products through the typed API service.
3. Each service builds its URL from the configured API base URL:
   - `GET {apiBaseUrl}/api/weatherforecast?count=5`
   - `GET {apiBaseUrl}/api/customers`
   - `GET {apiBaseUrl}/api/products`
4. The dashboard feature passes typed state to the reusable presentation components. The components render data, empty states, or the shared loading/error/retry component and emit retry events to the dashboard feature.
5. Dashboard section links update the route fragment and scroll to the selected section without reloading the document.
6. The API’s in-memory customer and product repositories provide the three startup seed records; the weather repository continues generating its existing sample forecasts.
7. Browser requests from the Angular Development origin are accepted by the API’s configured CORS policy.

### API Changes

- No route, method, request, or response-shape changes.
- Add CORS configuration and middleware wiring.
- Populate the in-memory customer and product repositories with three sample records each.

### Database Changes

- None. No persistence is introduced.

### Validation Strategy

- Use typed frontend interfaces for API contracts and verify that all expected data fields render correctly.
- Confirm the Angular API base URL is read from environment configuration and used for all three requests.
- For the read-only dashboard, no customer/product request forms or mutation payload validation are in scope.
- Validate the configured CORS origin values as origins (scheme and host, optional port), rather than accepting arbitrary URL paths or wildcard origins.

### Error Handling Strategy

- Track each dashboard dataset’s loading, success, empty, and error states independently so one failed request does not suppress successful sections.
- Display a concise failure message and retry control for the affected dataset. A retry reissues only that dataset’s request.
- Treat a successful empty collection as an empty state, not a request error.
- Do not silently replace failed requests with empty arrays or demo data in the frontend.
- Keep API exception/status handling consistent with existing middleware/controller behavior.

### Logging Strategy

- Do not log customer email addresses or full response payloads in the browser or API logs.
- Use the existing API logging configuration; add no new logging dependency for this dashboard.
- Surface request failures in the UI without exposing stack traces, internal host details, or sensitive configuration values.

### Security Considerations

- CORS is a browser-origin policy, not authentication or authorization. The API remains unauthenticated as currently implemented.
- Keep CORS allowlists explicit; do not enable arbitrary origins or credentials with wildcard origins.
- Store no credentials or secrets in Angular environment files. The API base URL and allowed origins are deployment configuration, not secrets.
- Use fictional seed data only.
- Do not render API-provided strings as trusted HTML.
