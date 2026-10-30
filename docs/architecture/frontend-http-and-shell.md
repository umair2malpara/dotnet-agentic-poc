# Shared Frontend HTTP and Shell Patterns

## API requests

The application registers `apiResponseInterceptor` through the root `provideHttpClient` configuration. API services use typed resource contracts and receive unwrapped `data` values. Keep endpoint URLs, request bodies, and resource-specific transformations in the resource API service; components should not parse the shared envelope.

The interceptor preserves HTTP errors and Problem Details. Requests whose feature displays an inline error should set `suppressErrorNotification`. A user-triggered mutation or explicit refresh may set `successMessage`; routine and background reads should not. Do not catch and replace API errors with empty/success-shaped values.

## Notifications

Use the root `NotificationService` and app-shell toast for accessible global messages. Avoid showing a global failure toast when the same error is already clearly displayed inline. Use warnings only when an operation had a recoverable/cautionary outcome, such as a saved change followed by a failed list refresh.

## Application shell

- `AppShellComponent` composes the shared layout and retains route metadata discovery and responsive state.
- `TopNavigationComponent` renders the brand and navigation controls.
- `FeatureNavigationComponent` renders the centrally configured `FEATURE_NAVIGATION_ITEMS`.
- `PageContextComponent` renders the current route's breadcrumb, title, and description.
- Reuse `ActionBarComponent` for applicable page-level actions.

Keep route title, description, and breadcrumb values in route metadata. Preserve accessible labels, active-route state, keyboard behavior, and responsive presentation when adding navigation or pages.
