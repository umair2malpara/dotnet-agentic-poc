# Issue #9 Technical Specification

**Work item:** [#9 — Perform Full Repository Architecture and Standards Compliance Audit](https://github.com/umair2malpara/dotnet-agentic-poc/issues/9)
**Source:** GitHub Issue
**Discovery:** Complete; shared understanding confirmed
**Specification status:** Approved scope amendment implemented; ready for review

## Architecture Overview

This work item is a repository-level standards audit. It uses the existing .NET API, Angular frontend, workflow configuration, prompt files, and repository documentation as the evidence base. The output is a structured compliance assessment and includes the explicitly approved, narrowly scoped Angular organization cleanup for shared API models and the API service.

The audit should be performed against the standards described in [.github/copilot-instructions.md](C:/Users/Umair.Malpara/source/repos/dotnet-agentic-poc/.github/copilot-instructions.md), the repository’s actual code structure, and the issue’s review areas. It should assess architecture quality, security, testing readiness, documentation quality, workflow alignment, and governance consistency.

## Solution Design

### Review methodology

The audit will apply a consistent review flow across the repository:

1. Determine the requirement source and map it to the project standards.
2. Inspect the relevant repository areas for actual implementation evidence.
3. Compare evidence against the expected standards.
4. Classify deviations by severity and business impact.
5. Record remediation recommendations and follow-up work items.

The approved remediation shall move shared API types to `src/frontend/src/app/core/models/api.models.ts` and the API service plus its unit test to `src/frontend/src/app/core/services/`. Update all imports and verify existing service behavior remains unchanged. No other audit findings are included in this implementation scope.

### Backend review design

Review the backend in its current structure under `src/backend/` and assess:

- Controller responsibility and thinness
- Business logic placement in services
- Repository duties and data access boundaries
- Dependency injection registration and lifetimes
- API contract and error-handling behavior
- Logging patterns and sensitive-data protection
- Security and configuration handling

### Frontend review design

Review the Angular application under `src/frontend/` and assess:

- Feature-based organization and route structure
- Component responsibilities and separation of concerns
- Service and model usage patterns
- Forms and validation patterns
- Accessibility and responsiveness
- Type safety and environment configuration
- Browser behavior and client-side routing quality

### Documentation and workflow review design

Review the project-level documentation and operational workflow files and assess:

- README and architecture guidance accuracy
- Copilot prompt alignment with lifecycle stages
- GitHub Action coverage and validation automation
- Git standards for branch and PR governance
- Specification package completeness and traceability

### Reporting design

The final compliance report will contain:

- Executive Summary
- Compliance Score by domain
- Findings by severity
- Technical Debt section
- Recommendations by time horizon
- Definition of Done statements for the audit itself

## Impact Analysis

### Existing functionality affected

No runtime application functionality is changed by this issue. The work affects repository governance, quality review, and reporting only.

### Existing functionality to preserve

- Existing backend API behavior and routing
- Existing frontend navigation and UI flows
- Current repository standards and project documentation
- Current build and test automation setup
- Existing specification and workflow documents

### Backend impact analysis

- **Controllers:** Review for thinness and validation patterns
- **Services:** Review for business logic ownership and orchestration
- **Repositories:** Review for data access only and no business logic
- **Models/DTOs:** Review for appropriateness and type safety
- **Middleware:** Review correlation-ID logging and request context handling
- **Configuration:** Review allowed-origin and environment-based configuration behavior
- **Database:** Review if any persistence layer or seed behavior is coupled to architecture expectations
- **External integrations:** Review whether any external dependencies are dangerous, undocumented, or unmanaged

### Frontend impact analysis

- **Components:** Review for presentation-focused responsibilities
- **Services:** Review for API communication patterns and shared state boundaries
- **Models:** Review for typed contracts and API alignment
- **Routes:** Review for feature-based route design and navigation quality
- **Forms:** Review for validation and access patterns
- **State Management:** Review for unnecessary complexity and observable correctness
- **UI:** Review for responsiveness, accessibility, and keyboard usability
- **Approved organization cleanup:** Place shared API models under `core/models/` and `DashboardApiService` with its unit test under `core/services/`. Preserve the existing endpoints, environment-based URL, request behavior, and dataset flows.

### API impact analysis

- **Endpoints added/modified/removed:** None expected
- **Request/response changes:** None expected
- **Validation/versioning:** Review only; no contract change planned
- **CORS/security behavior:** Must be reviewed against the documented standards and runtime config rules

### Database impact analysis

No database changes required.

### Dependency analysis

- **Internal dependencies:** Backend API, Angular frontend, docs, prompts, and workflows all form the audit scope
- **External dependencies:** GitHub and Jira issue sources are used as evidence where available
- **Libraries impacted:** None. The approved change only relocates existing Angular source and test files.

## Security Considerations

- Audit must identify any exposure of secrets, unsafe configuration, wildcards, or insecure defaults.
- Review must ensure sensitive values are not logged or surfaced in the application or workflow files.
- Validate that any configuration comments or environment usage do not encode credentials.
- Review whether authorization or input validation is missing in API paths.
- Check that CORS configuration supports explicit origins rather than unsafe permissive defaults.

## Performance Considerations

- Review async patterns, cancellation use, and unnecessary blocking calls.
- Look for repeated operations or loops that create avoidable performance risk.
- Evaluate whether list operations or request orchestration need pagination or optimization.
- Ensure the audit does not ignore performance concerns when reviewing architecture and APIs.

## Error Handling Strategy

The audit will classify issues into categories:

- **Validation errors:** Missing or weak validation and user feedback
- **Business errors:** Logic issues, architecture drift, or policy mismatch
- **Technical errors:** Broken or unsafe implementation patterns
- **Operational errors:** Missing automation, weak CI coverage, or bad governance

## Logging and Monitoring Strategy

The audit will review whether the project logs significant actions in a disciplined way:

- Application logs and middleware behavior
- Correlation ID or request diagnostics
- Error logging quality
- Avoidance of sensitive information in logs
- Whether CI and validation runs provide enough signal for repository health

## Files To Add

- `specifications/issue-9/functional-spec.md`
- `specifications/issue-9/technical-spec.md`
- `specifications/issue-9/bdd-tests.md`
- `specifications/issue-9/traceability-matrix.md`
- `specifications/issue-9/architecture-compliance-report.md`
- `src/frontend/src/app/core/models/api.models.ts`
- `src/frontend/src/app/core/services/dashboard-api.service.ts`
- `src/frontend/src/app/core/services/dashboard-api.service.spec.ts`

## Files To Modify

- Frontend imports in `src/frontend/src/app/app.spec.ts`, the dashboard feature, and the customer, product, and weather presentation components
- Issue #9 specification artifacts and compliance report to record the approved remediation and its traceability

## Files To Delete

- `src/frontend/src/app/api.models.ts`
- `src/frontend/src/app/dashboard-api.service.ts`
- `src/frontend/src/app/dashboard-api.service.spec.ts`

## Expected Folder Changes

- **Backend:** No code changes; architecture evidence reviewed under `src/backend/`
- **Frontend:** Shared model and API service organization updated under `src/frontend/src/app/core/`; no runtime behavior or API contract change
- **Tests:** Existing service tests move alongside the service and remain in place; validation confirms behavior is preserved
- **Documentation:** Review of README, docs, and architecture materials; issue #9 specs/report updated to record remediation
- **Configuration:** Review of GitHub workflows and repo configuration only
