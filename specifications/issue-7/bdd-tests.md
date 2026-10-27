# Issue #7 BDD Test Specification

**Status:** Approved
**Issue:** [Restructure Repository To Enterprise Agentic SDLC Layout](https://github.com/umair2malpara/dotnet-agentic-poc/issues/7)

Scenarios validate the repository after its changes have been applied. Tests and build commands must run against the relocated projects and Angular workspace, not stale build artifacts.

## Success Scenarios

### Scenario: Restore and build the backend solution from the repository root

**Given** the repository has been restructured
**When** a developer restores and builds the root `.slnx` solution
**Then** all five backend projects are included in the solution
**And** project references resolve without dependency cycles
**And** the solution builds successfully

### Scenario: Preserve backend API behavior after relocation

**Given** the API is started from its relocated project
**When** a client calls the existing weather, customer, and product endpoints
**Then** the same routes, methods, response contracts, and sample-data behavior are available
**And** no new or removed endpoint is introduced by the restructuring

### Scenario: Build and test the relocated frontend

**Given** the Angular workspace is located under `src/frontend/`
**When** dependencies are installed from the checked-in lockfile, then the frontend is built and its tests are run
**Then** dependency installation, build, and tests succeed
**And** the existing dashboard behavior is preserved

### Scenario: Find existing and current specifications by work item

**Given** the repository contains specifications for Issues #6 and #7
**When** a developer opens the `specifications/` directory
**Then** Issue #6 documents are grouped under `issue-6/`
**And** the four Issue #7 documents are grouped under `issue-7/`

### Scenario: Find documentation sections

**Given** the repository documentation has been reorganized
**When** a developer opens `docs/`
**Then** architecture, API, workflows, setup, and decisions have distinct locations
**And** the new API, workflows, and setup sections contain only structural placeholders

### Scenario: Run build helpers from any working directory

**Given** a supported .NET SDK and Node.js/npm are installed
**And** a developer invokes either build helper from outside the repository root
**When** the helper executes
**Then** it locates the root solution and frontend workspace from its own path
**And** it builds both backend and frontend successfully

### Scenario: Run test helpers from any working directory

**Given** a supported .NET SDK and Node.js/npm are installed
**And** dependencies have been restored
**When** a developer invokes either test helper from outside the repository root
**Then** it runs backend and frontend tests
**And** it returns success only when both test commands succeed

### Scenario: Run build and test checks on pushes

**Given** a commit is pushed to a branch covered by the workflow configuration
**When** GitHub Actions evaluates the repository workflows
**Then** the build and test checks run
**And** each check reports its own result

### Scenario: Gate pull-request validation on build and test

**Given** a pull request is opened or updated
**When** the PR-validation workflow invokes the build and test workflows
**Then** both checks execute for the pull request revision
**And** PR validation succeeds only when both checks succeed

### Scenario: Update repository guidance

**Given** project files have moved
**When** a developer follows the root README and frontend local-run instructions
**Then** commands and paths refer to the new locations
**And** the documented local workflow remains usable

## Validation and Error Scenarios

### Scenario: Backend build failure fails CI

**Given** a backend compilation error exists
**When** the build workflow runs
**Then** the build check fails
**And** PR validation cannot report success

### Scenario: Frontend build failure fails CI

**Given** the Angular build fails
**When** the build workflow runs
**Then** the build check fails
**And** PR validation cannot report success

### Scenario: Test failure fails CI

**Given** a backend or frontend test fails
**When** the test workflow runs
**Then** the test check fails
**And** PR validation cannot report success

### Scenario: Missing local tooling is reported

**Given** a required `dotnet`, `node`, or `npm` command is unavailable
**When** a local helper script is executed
**Then** it reports the unavailable command
**And** exits with a non-zero status without skipping that validation step

### Scenario: Script command failure is propagated

**Given** one of the build or test commands returns a non-zero status
**When** the corresponding helper script runs
**Then** the script stops subsequent dependent steps
**And** its process exits unsuccessfully

### Scenario: Stale path references are found

**Given** a README, solution, workflow, or script still references a moved project path
**When** the post-move validation is performed
**Then** the stale reference is reported and corrected
**And** the affected build or local-run validation succeeds

## Edge Cases

### Scenario: Invoke a script when the current directory contains spaces

**Given** the repository or caller’s current directory contains spaces
**When** a PowerShell or shell helper is invoked
**Then** paths are handled correctly without splitting the repository path

### Scenario: Build through the root solution after adding backend projects

**Given** the backend has API, Application, Domain, Infrastructure, and Tests projects
**When** the root solution is restored, built, and tested
**Then** each project participates in the corresponding command
**And** no project requires changing to its directory first

### Scenario: A PR validation job is cancelled or skipped

**Given** either required build or test job is cancelled, skipped unexpectedly, or fails
**When** PR validation computes its result
**Then** the aggregate check does not report success

## Security Scenarios

### Scenario: Build workflows do not expose secrets

**Given** build and test workflows execute for a push or pull request
**When** the jobs run
**Then** they use no application credentials or deployment secrets
**And** they do not print secret values

### Scenario: Pull-request validation does not deploy

**Given** a pull request is validated
**When** the PR-validation workflow runs
**Then** it performs build and test checks only
**And** it does not deploy, publish, or modify production infrastructure

## Non-Functional Scenarios

### Scenario: Maintain one source of truth for CI commands

**Given** build and test commands are defined in reusable workflows
**When** PR validation runs
**Then** it invokes those same workflows rather than duplicating their commands

### Scenario: Preserve the existing toolchain versions

**Given** project manifests and existing workflow configuration define the toolchain
**When** CI and local scripts validate the repository
**Then** the selected SDK/runtime versions remain compatible with those declarations
**And** the restructuring introduces no unnecessary third-party package
