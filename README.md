# dotnet-agentic-poc

Full-stack proof of concept for agentic SDLC workflows, with an ASP.NET Core API, Angular dashboard, GitHub Copilot prompts, and work-item specifications.

## Repository layout

```text
.github/                 Copilot instructions, prompts, and GitHub Actions
docs/                    Architecture, API, workflow, setup, and decision docs
specifications/<issue>/  Work-item specifications
src/backend/             API, Application, Domain, Infrastructure, and Tests
src/frontend/            Angular dashboard workspace
scripts/                 Cross-platform build and test helpers
dotnet-agentic-poc.slnx  Backend solution
```

## Dashboard

The Angular dashboard is in [`src/frontend/`](./src/frontend/). It reads weather, customer, and product data from the API. Customer and product records are fictional in-memory samples and reset when the API restarts.

The frontend is a single-page application: `/` and unknown paths redirect to `/dashboard`. The **Dotnet Agentic POC** wordmark returns to the dashboard, and the responsive feature navigation links to `/customers` and `/products`. These routes are available directly and use client-side navigation. Each page has a route-aware breadcrumb. Customers supports listing, creating, editing, and atomically deleting customers; its seeded records are in-memory and reset when the API restarts. Customer management is an unauthenticated proof-of-concept feature and is not intended for production exposure. See the [customer API contract](./docs/api/customers.md). Products remains a placeholder.

## Run locally

1. Start the API from the repository root:

   ```powershell
   dotnet run --project .\src\backend\Api\DotnetAgenticPoc.Api.csproj --launch-profile https
   ```

2. In another terminal, install frontend dependencies and start Angular:

   ```powershell
   cd .\src\frontend
   npm.cmd ci
   npm.cmd start
   ```

3. Open `http://localhost:4200`. The Development frontend uses the API at `https://localhost:7068`; configure the matching ASP.NET Core development certificate as trusted in the browser if required.

The API base URL is configured in `src/frontend/src/environments/environment.ts` and `src/frontend/src/environments/environment.development.ts`. The API permits `http://localhost:4200` in Development. For other environments, set `Cors:AllowedOrigins` to an explicit list of allowed origins, for example through the `Cors__AllowedOrigins__0` environment variable. The API fails startup outside Development when no allowed origins are configured or when an origin value is invalid. CORS does not provide authentication or authorization.

## Build and test

Run all baseline validations from the repository root:

```powershell
.\scripts\build.ps1
.\scripts\test.ps1
```

Equivalent Bash scripts are available as `scripts/build.sh` and `scripts/test.sh`. From the repository root, invoke them with `bash scripts/build.sh` and `bash scripts/test.sh`; from another working directory, invoke them using the script path, for example `bash /path/to/repository/scripts/build.sh`. They resolve the repository root from their own file location. The scripts restore frontend dependencies from the checked-in lockfile.

To run commands directly, use `dotnet restore`, `dotnet build`, and `dotnet test` with the root solution, and run `npm ci`, `npm run build`, or `npm test -- --watch=false` from `src/frontend/`. In PowerShell, use `npm.cmd` if the execution policy blocks `npm.ps1`.
