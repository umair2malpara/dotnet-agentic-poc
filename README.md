# dotnet-agentic-poc

## Dashboard

The Angular dashboard is in [`frontend/`](./frontend/). It reads weather, customer, and product data from the API. Customer and product records are fictional in-memory samples and reset when the API restarts.

The frontend is a single-page application: `/` redirects to `/dashboard`, which is the default dashboard route. Dashboard navigation updates the route fragment to scroll to each data section without a full-page reload.

### Run locally

1. Start the API from the repository root:

   ```powershell
   dotnet run --project .\DotnetAgenticPoc.Api\DotnetAgenticPoc.Api.csproj --launch-profile https
   ```

2. In another terminal, install frontend dependencies and start Angular:

   ```powershell
   cd .\frontend
   npm install
   npm start
   ```

3. Open `http://localhost:4200`. The Development frontend uses the API at `https://localhost:7068`; configure the matching ASP.NET Core development certificate as trusted in the browser if required.

The API base URL is configured in `frontend/src/environments/environment.ts` and `frontend/src/environments/environment.development.ts`. The API permits `http://localhost:4200` in Development. For other environments, set `Cors:AllowedOrigins` to an explicit list of allowed origins, for example through the `Cors__AllowedOrigins__0` environment variable. The API fails startup outside Development when no allowed origins are configured or when an origin value is invalid. CORS does not provide authentication or authorization.

Build and test the dashboard from `frontend/` with `npm run build` and `npm test`. Run API tests from the repository root with `dotnet test`.