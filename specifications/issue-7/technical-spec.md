# Issue #7 Technical Specification

**Status:** Approved
**Issue:** [Restructure Repository To Enterprise Agentic SDLC Layout](https://github.com/umair2malpara/dotnet-agentic-poc/issues/7)
**Source:** GitHub Issue #7

## Architecture Overview

Retain the root solution and existing application behavior while placing all backend and frontend code beneath `src/`. Split the existing backend implementation into five project boundaries: API, Application, Domain, Infrastructure, and Tests. Keep GitHub configuration under `.github/`, work-item specifications under `specifications/`, and documentation under `docs/`.

Build and test workflow files should be reusable by the PR-validation workflow. The push triggers run build and test validations directly; the pull-request validation workflow invokes both reusable workflows and reports success only after both complete successfully. Root-level scripts should invoke the same project-level commands and propagate failures.

No API endpoints, database, external services, or runtime features are introduced or changed.

## Solution Design

### Backend design

Target structure:

```text
src/backend/
├── Api/
│   ├── DotnetAgenticPoc.Api.csproj
│   ├── Controllers/
│   ├── Middleware/
│   ├── Properties/
│   └── appsettings*.json
├── Application/
│   ├── DotnetAgenticPoc.Application.csproj
│   ├── Abstractions/
│   └── Services/
├── Domain/
│   ├── DotnetAgenticPoc.Domain.csproj
│   └── Models/
├── Infrastructure/
│   ├── DotnetAgenticPoc.Infrastructure.csproj
│   └── Repositories/
└── Tests/
    ├── DotnetAgenticPoc.Api.Tests.csproj
    ├── Middleware/
    └── Repositories/
```

- `Api` owns ASP.NET Core startup, controllers, HTTP middleware, and API configuration.
- `Application` owns service interfaces/implementations and repository abstractions required by application services.
- `Domain` owns the existing domain/data models.
- `Infrastructure` owns the existing in-memory repository implementations.
- `Tests` owns the existing xUnit test project and tests.
- Preserve existing business behavior, JSON shapes, route behavior, in-memory seed data, and test intent. Namespace changes should be limited to what is needed for clear project boundaries.
- Keep project references acyclic: `Application` references `Domain`; `Infrastructure` references `Application` and `Domain`; `Api` references `Application` and `Infrastructure`; `Tests` references `Api` (and only adds direct references when necessary).
- Keep all projects on the target framework already configured by the existing backend.
- Do not add a persistence provider, database, or third-party dependency.

### Frontend design

Move the existing Angular workspace intact beneath `src/frontend/`, including its `package.json`, lockfile, Angular CLI configuration, TypeScript configuration, public assets, and `src/` application files. Update repository instructions and CI working directories to this path. Do not restructure Angular features or change runtime behavior as part of this issue.

### Integration design

- Update the root `.slnx` to include the relocated API and test projects and the new Application, Domain, and Infrastructure projects.
- Update project references to follow the dependency direction above.
- Keep `.github/prompts/` and `.github/copilot-instructions.md` at their current paths.
- Use reusable `workflow_call` entry points for build and test workflows. The PR-validation workflow invokes both as jobs and fails if either reusable workflow fails.
- Build and test workflows run on pushes. The PR-validation workflow runs on pull requests and calls both workflows, so both checks execute on PRs without duplicating their command definitions.
- Use matching backend and frontend commands in CI and local scripts.
- Scripts resolve the repository root from their own location, do not depend on the caller’s working directory, and stop on the first failure with a non-zero exit status.

## Backend Impact Analysis

### Controllers

- Relocate the existing `CustomersController`, `ProductsController`, and `WeatherForecastController` with the API project.
- Preserve routes, HTTP methods, status codes, and response contracts.

### Services

- Move existing service interfaces and implementations into the Application project.
- Preserve service behavior and dependency injection contracts.

### Repositories

- Place repository interfaces/abstractions in the Application project.
- Move in-memory repository implementations into Infrastructure.
- Preserve seeded sample data and in-memory lifetime/behavior.

### Models

- Move the existing `Customer`, `Product`, and `WeatherForecast` models into Domain.
- Preserve serialized field names and values.

### DTOs

- No new or changed API DTOs are required.

### Middleware and configuration

- Keep correlation-ID middleware and API settings with the API project.
- Update namespaces/usings and file references only as required by project relocation.
- Preserve current CORS configuration and runtime behavior.

### Database and external integrations

- No database, migrations, or external integrations are introduced.

## Frontend Impact Analysis

- Move existing Angular components, services, models, routes, tests, styles, environments, configuration, and assets as a workspace.
- Update path-dependent scripts, documentation, and CI settings.
- Do not change components, routes, HTTP requests, API contracts, visual behavior, or package versions.

## API Impact Analysis

- **Endpoints added:** None.
- **Endpoints modified:** None.
- **Endpoints removed:** None.
- **Request/response changes:** None.
- **Validation changes:** None.
- **Versioning impact:** None; no API contract change.

## Database Impact Analysis

No database changes required. No tables, views, stored procedures, functions, indexes, data migrations, or rollback actions are required.

## Dependency Analysis

- Existing .NET and Angular dependencies remain unchanged unless a project-reference adjustment is needed.
- Add project references for the five backend boundaries; do not add third-party libraries.
- The existing root solution remains the entry point for backend restore, build, and test commands.
- CI Node.js and .NET SDK versions should match the versions already used by the repository workflow and project manifests.

## Build, Test, and PR Workflow Design

### `build.yml`

- Support `workflow_call` for invocation by the PR-validation workflow.
- Run on pushes.
- Restore and build the root solution.
- Build the Angular app from `src/frontend/` using its existing npm script.
- Fail on any command failure.

### `test.yml`

- Support `workflow_call` for invocation by the PR-validation workflow.
- Run on pushes.
- Run backend tests through the root solution.
- Run frontend tests using the configured test script in non-watch/CI mode.
- Fail on any command failure.

### `pr-validation.yml`

- Run on pull requests.
- Call `build.yml` and `test.yml` as separate jobs using reusable-workflow syntax.
- Report success only when both jobs succeed; propagate either failure or cancellation.
- Do not run deployment or publish steps.

## Local Script Design

- `scripts/build.ps1` and `scripts/build.sh` execute backend restore/build and frontend build.
- `scripts/test.ps1` and `scripts/test.sh` execute backend tests and frontend tests in CI-compatible mode.
- All scripts derive the repository root from the script path, use explicit project/workspace paths, and propagate the first non-zero exit code.
- Scripts do not install global tooling or silently skip a project because a command is unavailable.
- Keep shell behavior portable to the CI Linux runner and PowerShell behavior compatible with supported Windows PowerShell.

## Validation Strategy

From the repository root:

1. `dotnet restore .\dotnet-agentic-poc.slnx`
2. `dotnet build .\dotnet-agentic-poc.slnx --no-restore`
3. `dotnet test .\dotnet-agentic-poc.slnx --no-build`
4. From `src/frontend/`, install dependencies with `npm ci`.
5. From `src/frontend/`, run `npm run build`.
6. From `src/frontend/`, run `npm test -- --watch=false`.
7. Invoke the PowerShell helper scripts from a working directory other than the repository root and confirm successful root resolution.
8. Confirm each script returns a non-zero status when a required build/test command fails, using a controlled validation failure.
9. Inspect workflow triggers and job dependencies to verify push coverage and pull-request gating.
10. Run a diff/path-reference check for references to the former backend and frontend paths.

All commands must be executed after the relocation; existing build artifacts are not validation evidence.

## Error Handling Strategy

- Let the command and workflow fail explicitly on restore, build, or test errors.
- Shell and PowerShell scripts stop on the first failed command and return a non-zero process exit code.
- PR validation must not report success when either reusable workflow fails.
- Do not catch and suppress tooling errors or substitute a successful fallback.

## Logging and Monitoring Strategy

- No application logging, metrics, tracing, or audit changes are in scope.
- GitHub Actions logs provide command output and check status.
- Scripts write concise command-stage information to standard output and preserve useful tool diagnostics on failure.
- Do not print credentials, tokens, or secret environment values.

## Security Considerations

- Do not add secrets to workflows, scripts, README files, or frontend configuration.
- Use the existing GitHub Actions checkout/setup actions and avoid introducing privileged permissions or deployment jobs.
- Do not use wildcard permissions; no additional permissions are needed for build and test.
- Keep CI validation read-only with respect to deployment and infrastructure.

## Performance Considerations

- No runtime performance impact is expected.
- Reusable workflows prevent maintaining duplicate build/test command implementations.
- No caching or parallelization changes are required beyond independent build and test jobs.

## File Change Plan

### Files to add

- `src/backend/Application/DotnetAgenticPoc.Application.csproj`
- `src/backend/Domain/DotnetAgenticPoc.Domain.csproj`
- `src/backend/Infrastructure/DotnetAgenticPoc.Infrastructure.csproj`
- `src/backend/Api/` — move the existing API `.csproj`, `.http` file, `Program.cs`, `appsettings.json`, `appsettings.Development.json`, `Properties/launchSettings.json`, `Controllers/CustomersController.cs`, `Controllers/ProductsController.cs`, `Controllers/WeatherForecastController.cs`, and `Middleware/CorrelationIdMiddleware.cs`.
- `src/backend/Application/` — move `Services/CustomerService.cs`, `Services/ICustomerService.cs`, `Services/ProductService.cs`, `Services/IProductService.cs`, `Services/WeatherForecastService.cs`, `Services/IWeatherForecastService.cs`, `Repositories/ICustomerRepository.cs`, `Repositories/IProductRepository.cs`, and `Repositories/IWeatherForecastRepository.cs`.
- `src/backend/Domain/` — move `Models/Customer.cs` and `Models/Product.cs`; move the existing `WeatherForecast.cs` model from the API project here.
- `src/backend/Infrastructure/` — move `Repositories/InMemoryCustomerRepository.cs`, `Repositories/InMemoryProductRepository.cs`, and `Repositories/WeatherForecastRepository.cs`.
- `src/backend/Tests/` — move the existing test `.csproj`, `Middleware/CorrelationIdMiddlewareTests.cs`, and `Repositories/InMemoryRepositorySeedTests.cs`.
- `src/frontend/` — move every tracked file in the existing `frontend/` Angular workspace, preserving its internal relative paths.
- `scripts/build.ps1`
- `scripts/build.sh`
- `scripts/test.ps1`
- `scripts/test.sh`
- `.github/workflows/test.yml`
- `.github/workflows/pr-validation.yml`
- `docs/api/.gitkeep`
- `docs/workflows/.gitkeep`
- `docs/setup/.gitkeep`
- `specifications/issue-7/functional-spec.md`
- `specifications/issue-7/technical-spec.md`
- `specifications/issue-7/bdd-tests.md`
- `specifications/issue-7/traceability-matrix.md`

### Files to modify

- `dotnet-agentic-poc.slnx` — update project paths and include all backend projects.
- `.github/workflows/build.yml` — make build reusable and update project/workspace paths and triggers.
- `README.md` — update repository layout and local build/test/run instructions.
- `src/backend/Api/DotnetAgenticPoc.Api.csproj` and `src/backend/Tests/DotnetAgenticPoc.Api.Tests.csproj` — update project references as needed; the test project file itself is relocated, not recreated.
- The relocated backend source files — update namespaces/usings and project references where needed.
- `specifications/issue-6-functional-spec.md` → `specifications/issue-6/functional-spec.md`.
- `specifications/issue-6-technical-spec.md` → `specifications/issue-6/technical-spec.md`.
- `specifications/issue-6-bdd-tests.md` → `specifications/issue-6/bdd-tests.md`.
- `src/frontend/README.md` — update local instructions and references for the new workspace location.

### Files to delete

- No files are to be deleted for behavior or content removal. Relocated source/specification files cease to exist at their old paths as part of their moves.

### Expected folder changes

- **Backend:** Move the existing API project beneath `src/backend/Api/`; create Application, Domain, and Infrastructure projects; move tests beneath `src/backend/Tests/`.
- **Frontend:** Move the complete Angular workspace from `frontend/` to `src/frontend/`.
- **Tests:** Preserve the existing backend and frontend test files and test intent.
- **Documentation:** Retain existing architecture and decisions; add structural API, workflow, and setup directories.
- **Specifications:** Group Issue #6 files and add this Issue #7 package.
- **Configuration:** Update the solution, project references, workflows, scripts, and README paths.

## Open Implementation Constraints

- Keep the number of new projects and dependencies to the five agreed layers and their project references.
- Avoid unrelated code cleanup during moves.
- Preserve existing local API and Angular startup behavior, adjusting only documented paths.
- If an existing source dependency cannot fit the agreed project reference direction without changing behavior, record the exact conflict and request approval before expanding scope.
