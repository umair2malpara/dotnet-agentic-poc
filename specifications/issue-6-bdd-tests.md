# Issue #6 BDD Test Specification

**Status:** Approved; updated to reflect implementation  
**Issue:** [Create Angular Frontend Application with Dashboard, Navbar, and API Integration](https://github.com/umair2malpara/dotnet-agentic-poc/issues/6)

These scenarios define expected behavior for implementation and review. Frontend component/service tests should use controlled HTTP responses; API tests should verify the repository and CORS behavior without relying on external services.

## Success Cases

### Scenario: Redirect the application root to the dashboard

**Given** the Angular single-page application is loaded at `/`  
**When** the router resolves the initial URL  
**Then** the browser URL becomes `/dashboard`  
**And** the dashboard is rendered inside the root router outlet  
**And** the transition does not cause a full-page reload

### Scenario: Render the dashboard from a direct route

**Given** the application is opened directly at `/dashboard`  
**When** Angular resolves the route  
**Then** the dashboard shell and its reusable dashboard components are rendered

### Scenario: Redirect an unknown route

**Given** the application is opened at an unrecognized path  
**When** Angular resolves the route  
**Then** the router redirects to `/dashboard`  
**And** the dashboard is displayed

### Scenario: Render the dashboard shell

**Given** the Angular application has started successfully  
**When** the dashboard page is displayed  
**Then** the top bar shows the “Dotnet Agentic POC” wordmark  
**And** the left navigation contains links to weather, customers, and products  
**And** each link uses client-side routing to target its corresponding section on the dashboard  
**And** selecting a section link updates the route fragment and scrolls to that section without reloading the page

### Scenario: Compose the dashboard from reusable components

**Given** the `/dashboard` route is active  
**When** the dashboard is rendered  
**Then** the page composes reusable weather, customer-list, product-list, and summary-card components  
**And** loading and request errors use the shared dataset-status component  
**And** the root application template contains only the router outlet

### Scenario: Render shared dataset status consistently

**Given** a dashboard dataset is loading or has failed  
**When** its presentation component renders the state  
**Then** the shared dataset-status component displays the appropriate loading message or error  
**And** when the dataset has failed, it displays a retry action  
**And** selecting retry emits an event to the dashboard feature to reload only that dataset

### Scenario: Load and display all three datasets

**Given** the API returns forecast, customer, and product collections successfully  
**When** the dashboard requests its data  
**Then** it requests `GET /api/weatherforecast?count=5`, `GET /api/customers`, and `GET /api/products` using the configured API base URL  
**And** it displays forecast date, summary, and temperature  
**And** it displays customer name and email  
**And** it displays product name and price

### Scenario: Show the initial customer and product sample data

**Given** a fresh API process has started  
**When** a client requests `GET /api/customers` and `GET /api/products`  
**Then** each endpoint returns three fictional sample records  
**And** the response fields match the existing customer and product contracts

### Scenario: Reset sample data after API restart

**Given** the API has been restarted  
**When** a client requests the customer and product collections  
**Then** the three startup sample records are available again  
**And** no persistence across restarts is implied

### Scenario: Use the configured API base URL

**Given** the frontend environment is configured with an API base URL  
**When** the dashboard requests each dataset  
**Then** all three requests target that base URL  
**And** changing the configured base URL does not require changing component source code

### Scenario: Permit the Angular development origin

**Given** the API is running in the Development environment  
**When** a browser request to an API endpoint has origin `http://localhost:4200`  
**Then** the API CORS policy permits that origin

### Scenario: Adapt the layout to a narrow viewport

**Given** the dashboard is displayed at a mobile viewport width  
**When** a user navigates among dashboard sections and views their data  
**Then** navigation and content remain visible and usable  
**And** the page does not require horizontal scrolling for its primary layout

## Validation Failures

### Scenario: Reject an unconfigured cross-origin host

**Given** the API is running with an explicit CORS allowlist  
**And** the browser request origin is not in that allowlist  
**When** the browser requests a dashboard API endpoint  
**Then** the API does not grant that origin cross-origin access

### Scenario: Reject malformed CORS origin configuration

**Given** an allowed-origin setting contains a value that is not a valid origin  
**When** the API CORS configuration is initialized  
**Then** the invalid configuration is reported as a configuration error  
**And** the invalid value is not silently treated as an unrestricted origin

## Error Handling

### Scenario: Show a loading state while requests are pending

**Given** one or more dashboard API requests have not completed  
**When** the corresponding sections are rendered  
**Then** each pending section displays a loading state

### Scenario: Display an error and retry a failed request

**Given** the API request for a dashboard section fails  
**When** the section renders the failed result  
**Then** the section displays a visible error state and retry control  
**And** selecting retry reissues that section’s request  
**And** successful sections continue to display their data

### Scenario: Do not convert an API failure into an empty result

**Given** a dashboard API request fails with a network error or unsuccessful HTTP status  
**When** the section handles the failure  
**Then** it displays an error state  
**And** it does not display the successful-empty state

## Edge Cases

### Scenario: Display an empty collection

**Given** a dashboard API request succeeds with an empty collection  
**When** the section renders the result  
**Then** it displays a clear empty state  
**And** it does not display an error or loading state

### Scenario: Handle datasets completing at different times

**Given** the weather, customer, and product requests complete at different times  
**When** each response arrives  
**Then** each section updates independently  
**And** a pending or failed request does not block another section’s successful data

### Scenario: Retain the existing weather sample-data semantics

**Given** the dashboard requests weather forecasts  
**When** the existing weather endpoint returns generated sample forecasts  
**Then** the dashboard displays the returned forecast fields  
**And** it does not claim that the values are live or location-specific
