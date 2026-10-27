# Issue #7 Functional Specification

**Status:** Approved
**Issue:** [Restructure Repository To Enterprise Agentic SDLC Layout](https://github.com/umair2malpara/dotnet-agentic-poc/issues/7)
**Source:** GitHub Issue #7
**Work item type:** Repository structure and automation enhancement
**Priority / reporter / assignee:** Not specified in the issue

## Business Objective

Provide a consistent repository layout that separates application source, work-item specifications, documentation, Copilot configuration, and automation. The structure must support the existing .NET and Angular applications and their future growth without changing current application behavior.

## Problem Statement

The repository has some documentation and prompt organization already, but backend and frontend source remain at the root and a single workflow combines build and test checks. Existing work-item specifications are not grouped in per-item folders. This makes the repository harder to navigate and extend consistently.

## Functional Requirements

### FR-001 — Organize full-stack source under `src/`

**Priority:** Must
Move the existing backend, backend tests, and Angular application beneath `src/` using the agreed target layout. Retain the `.slnx` solution format and update references to the new locations.

**Acceptance criteria**

- Backend projects are under `src/backend/`.
- The Angular application, including its package manifests and Angular CLI configuration, is under `src/frontend/`.
- The solution file remains at the repository root and refers to the relocated backend projects.
- Application behavior and existing API contracts remain unchanged by the relocation.

### FR-002 — Establish backend layers

**Priority:** Must
Separate the backend into `Api`, `Application`, `Domain`, `Infrastructure`, and `Tests` projects beneath `src/backend/`.

**Acceptance criteria**

- Each layer has a clear project boundary and responsibility.
- The API composes the application and infrastructure layers through dependency injection.
- Application and infrastructure project references respect the dependency direction in the approved design.
- Existing API routes, response shapes, sample data, and behavior are preserved.

### FR-003 — Group work-item specifications

**Priority:** Must
Keep specifications separate from source and organize them in work-item-specific folders.

**Acceptance criteria**

- Existing Issue #6 specification documents are moved into `specifications/issue-6/`.
- This Issue #7 specification package is stored in `specifications/issue-7/`.
- Each work-item folder can contain functional, technical, BDD, and traceability documents.

### FR-004 — Separate documentation and agent configuration

**Priority:** Must
Keep architecture, API, workflow, setup, and decision documentation under `docs/`, and keep Copilot instructions, prompts, and workflow configuration under `.github/`.

**Acceptance criteria**

- Existing architecture and decision documentation remains under `docs/`.
- Structural sections `docs/api/`, `docs/workflows/`, and `docs/setup/` are created without introducing substantive content beyond minimal directory placeholders.
- Existing Copilot prompts remain discoverable under `.github/prompts/`.
- Root documentation describes the new layout and local run commands.

### FR-005 — Separate build, test, and PR validation automation

**Priority:** Must
Provide dedicated GitHub Actions workflows for build, test, and pull-request validation.

**Acceptance criteria**

- Build and test workflows run on pushes and pull requests; on pull requests, PR validation invokes both checks.
- PR validation succeeds only when both build and test workflows succeed.
- Backend and frontend build and test steps are covered.
- Workflow failures remain visible as failed checks.

### FR-006 — Provide local cross-platform helper scripts

**Priority:** Must
Provide root-level PowerShell and shell scripts for build and test operations.

**Acceptance criteria**

- `scripts/build.ps1` and `scripts/build.sh` run the backend and frontend build validations.
- `scripts/test.ps1` and `scripts/test.sh` run the backend and frontend test validations.
- Scripts work independently of the caller’s current directory and return a non-zero exit status if a required command fails.

### FR-007 — Preserve behavior and validate the reorganization

**Priority:** Must
Preserve current application functionality while updating path references.

**Acceptance criteria**

- The backend restores and builds, and its test suite passes.
- The frontend dependencies install from its relocated lockfile, and its build and tests pass.
- Local run instructions, solution references, workflow working directories, and script paths use the new locations.
- No application API endpoint, request/response contract, or user-facing dashboard behavior is changed by this work.

## User Journeys

### Normal flow

1. A developer opens the repository and locates the backend, frontend, specs, docs, prompts, and automation in their designated areas.
2. The developer runs the corresponding root-level build or test helper script.
3. GitHub Actions runs build and test checks on pushes and pull requests.
4. For a pull request, the PR-validation workflow waits for both checks and reports success only if both pass.
5. A developer opens a work-item folder and finds its specifications grouped together.

### Alternative flow

- A developer runs a backend or frontend command directly from that project’s folder rather than using a root helper script.
- A new work item adds its specifications in a new folder without changing the source or documentation layout.

### Exception flow

- If required tooling is unavailable or a restore, build, or test command fails, the helper script or workflow exits unsuccessfully and reports the failing operation.
- If a moved project or frontend path is stale in a solution, workflow, script, or README reference, validation fails and the affected reference must be corrected before completion.

## Non-Functional Requirements

- **Maintainability:** Project and documentation responsibilities are discoverable from directory names and project boundaries.
- **Scalability:** New backend layers, frontend features, work-item specs, and docs can be added without repeating root-level layout.
- **Reliability:** CI and scripts propagate failures; no successful fallback may conceal a failed build or test.
- **Compatibility:** Existing API and Angular behavior remains unchanged.
- **Security:** No credentials or secrets are added to source, scripts, frontend configuration, or workflows.
- **Performance:** No runtime performance change is required or expected.
- **Monitoring and logging:** No application observability change is in scope; CI provides build and test outcome reporting.
- **Accessibility:** No application UI change is in scope.
- **Availability:** No deployment or runtime availability change is in scope.

## Constraints

### Technical

- Use the framework and package versions already declared by the .NET projects and Angular package manifest.
- Retain the root `.slnx` solution file.
- Retain existing GitHub Copilot prompts under `.github/prompts/`.
- Keep workflows and scripts aligned on the same backend/frontend validation commands.

### Business

- The change is repository organization and automation, not a feature release.
- Existing functional behavior and API contracts must remain intact.

### Operational

- CI runners must provision the required .NET SDK and Node.js version compatible with the repository.
- Deployment configuration and production infrastructure are not part of this work.

## Assumptions

- Existing Issue #6 specifications are relocated without rewriting their approved requirements.
- The Issue #7 folder contains the four specification artifacts in this package.
- The five backend layers are separate projects, with minimal references and no new third-party dependencies unless required by the existing code.
- The helper scripts are run from any current working directory and resolve the repository root from their own file location.
- Build and test workflows are reusable by the PR-validation workflow; push checks run directly, avoiding a second bespoke implementation of validation commands.
- Existing empty documentation files are retained; new empty documentation sections use minimal placeholders so they are tracked by Git.

## Risks

- Solution and project references may break when projects and source files move.
- Splitting the backend into projects may expose implicit dependencies that were previously hidden within one project.
- A workflow trigger or reusable workflow misconfiguration could skip PR checks or duplicate runs.
- Inconsistent commands between CI and local scripts could give developers misleading validation results.
- README and frontend local-run instructions may retain stale paths after relocation.

## Out Of Scope

- Jira MCP or GitHub MCP implementation.
- Deployment workflows, production infrastructure, hosting, or production configuration.
- Authentication, authorization, or new business features.
- Changes to API routes, request/response shapes, dashboard behavior, or persisted data.
- Substantive documentation content for the new API, workflow, and setup documentation sections.
- Retrofitting missing Issue #6 specification artifacts.
