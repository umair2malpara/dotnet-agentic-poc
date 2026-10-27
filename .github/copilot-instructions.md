# Project Overview

This project is a Full Stack (.NET + Angular) proof of concept for exploring agentic AI-assisted software development workflows.

The solution consists of:

- ASP.NET Core Web APIs
- Angular Frontend Application
- GitHub Source Control
- Jira Work Management
- GitHub Copilot Prompt-Based Agents

The goal is to automate repetitive development activities while keeping architectural and business decisions under human control.

## Technology Stack

- C# and ASP.NET Core Web API
- Target framework: Use the framework configured in the project file (`.csproj`).
- Dependency Injection using the built-in ASP.NET Core container.
- OpenAPI for API documentation where configured.

## Architecture

Follow a layered architecture as the project grows:

- **Controller:** Handles HTTP requests, validates input, and returns appropriate HTTP responses.
- **Service:** Contains business logic and coordinates application operations.
- **Repository:** Handles data access when persistence is required.

Keep controllers thin. Do not introduce unnecessary layers for simple functionality.

## Coding Standards

- Use constructor injection for dependencies.
- Use `ILogger<T>` for structured application logging.
- Prefer asynchronous methods and `async`/`await` for I/O-bound operations.
- Pass `CancellationToken` to asynchronous operations where appropriate.
- Avoid static classes for application services and business logic.
- Follow standard C# naming conventions and write clear, maintainable code.
- Keep configuration outside source code.
- Never hardcode credentials, API keys, connection strings containing secrets, or tokens.
- Use appropriate dependency lifetimes: Singleton, Scoped, or Transient.
- Handle exceptions appropriately and return suitable HTTP status codes.
- Avoid logging passwords, tokens, or other sensitive information.

## Dependency Injection Standards

- Register dependencies using built-in DI container.
- Program.cs should be the single composition root.

Service Lifetimes:

- Singleton for stateless shared services.
- Scoped for request-scoped services.
- Transient for lightweight stateless services.

Never instantiate dependencies using "new" when dependency injection should be used.

## .NET API Design Standards

- Use API Versioning when introducing breaking API contract changes.
- Prefer strongly typed request and response DTOs.
- Never expose domain models directly through API endpoints.
- Use ActionResult<T> for controller responses.
- Return appropriate HTTP status codes.
- Validate all external inputs.
- Keep controllers thin and delegate business logic to services.
- Ensure APIs remain backward compatible unless explicitly approved.
- Document API contract changes.

Response Types:

- 200 OK
- 201 Created
- 400 BadRequest
- 401 Unauthorized
- 403 Forbidden
- 404 NotFound
- 409 Conflict
- 422 UnprocessableEntity
- 500 InternalServerError

## Repository Standards

- Repositories are responsible only for data access.
- Business logic must not exist in repositories.
- Repositories should return domain entities or models.
- Services should orchestrate repository calls.
- Repositories should not know about HTTP concerns.
- Keep database-specific code isolated within repositories.

## Logging and Observability Standards

- Use ILogger<T> exclusively for application logging.
- Use structured logging.
- Include contextual information in log entries.
- Avoid string interpolation inside logger methods.
- Log meaningful business events.
- Do not log sensitive information.

Example Context Information:

- CorrelationId
- RequestId
- UserId (where applicable)
- TicketId (where applicable)

Log Levels:

- Trace
- Debug
- Information
- Warning
- Error
- Critical

Each service operation should have:

- Start log
- Success log
- Failure log

## Performance Standards

- Favor asynchronous APIs.
- Avoid unnecessary allocations.
- Avoid synchronous blocking calls.
- Do not perform database queries inside loops.
- Minimize repeated external service calls.
- Consider pagination for list endpoints.
- Consider caching where appropriate.

## Security Standards

- Validate all external input.
- Never trust client-provided data.
- Never log secrets.
- Never hardcode credentials.
- Use secure configuration providers.
- Follow Principle of Least Privilege.
- Protect sensitive endpoints with authorization.
- Sanitize error messages returned to clients.

## Testing Standards

- Use xUnit for automated tests.
- Use Moq when mocking dependencies.
- Write unit tests for business logic and important edge cases.
- Include tests for success scenarios, validation failures, and error handling.
- Keep tests independent and repeatable.
- Run relevant tests before submitting changes.

## Frontend Technology Stack

- Angular (Use the version defined in package.json).
- TypeScript.
- Angular CLI.
- RxJS for reactive programming.
- Angular Router for navigation.
- SCSS for styling unless the project specifies otherwise.
- REST API communication using Angular HttpClient.
- Dependency Injection using Angular's built-in DI container.

---

## Angular Architecture

Follow a feature-based architecture.

Preferred structure:

src/
|
+-- app/
    |
    +-- core/
    |   +-- services/
    |   +-- interceptors/
    |   +-- guards/
    |   +-- models/
    |
    +-- shared/
    |   +-- components/
    |   +-- directives/
    |   +-- pipes/
    |
    +-- features/
        +-- customer/
        +-- product/
        +-- weather/

Guidelines:

- Keep components focused on presentation responsibilities.
- Keep business logic in services.
- Reuse shared components where appropriate.
- Avoid code duplication.
- Follow existing folder structure and patterns.
- Prefer standalone Angular components if already used in the project.
- Do not introduce additional architectural patterns unless justified.

---

## Angular Coding Standards

- Use TypeScript strict typing whenever possible.
- Avoid using "any" unless absolutely necessary.
- Prefer interfaces for contracts and DTOs.
- Use dependency injection instead of manual instantiation.
- Use readonly where appropriate.
- Follow Angular naming conventions.
- Use meaningful variable and method names.
- Keep methods small and focused.
- Avoid large monolithic components.
- Use enums instead of magic strings where appropriate.
- Avoid duplicate business logic across components.
- Never hardcode environment-specific values.
- Store configuration in Angular environment files where appropriate.

---

## Angular Component Standards

- Components should focus on UI rendering.
- Avoid business logic inside components.
- Move business logic to services.
- Keep templates simple and readable.
- Use OnPush change detection strategy where appropriate.
- Minimize direct DOM manipulation.
- Prefer Angular bindings over manual DOM updates.

Each component should have:

- Component
- Template
- Style
- Unit Test

Example:

customer-list.component.ts
customer-list.component.html
customer-list.component.scss
customer-list.component.spec.ts

---

## Angular Service Standards

Services are responsible for:

- API communication
- Business logic
- Data transformation
- Shared state management

Guidelines:

- Register services through dependency injection.
- Keep services focused on a single responsibility.
- Return Observables instead of manually subscribing inside services.
- Handle API errors consistently.
- Avoid storing unnecessary application state.

---

## Angular HTTP Standards

Use Angular HttpClient for all API communication.

Guidelines:

- Centralize API calls within services.
- Use strongly typed request and response models.
- Handle errors using RxJS operators.
- Use interceptors for:
  - Authentication
  - Logging
  - Correlation IDs
  - Global Error Handling

Avoid making HTTP calls directly from components.

---

## Angular State Management Standards

For this proof of concept:

- Prefer service-based state management.
- Use RxJS BehaviorSubject or Signal-based state when required.
- Do not introduce NgRx unless explicitly required.
- Keep state management simple and maintainable.

---

## Angular Routing Standards

- Use feature-based routing.
- Lazy load feature modules where appropriate.
- Keep routes organized and easy to understand.
- Protect routes using guards where required.

Example:

/customers
/customers/:id
/products
/products/:id

---

## Angular UI Standards

- Follow responsive design principles.
- Support desktop and mobile resolutions.
- Use reusable UI components.
- Maintain consistency in spacing, colors, styling, and layout.
- Ensure accessibility wherever possible.
- Provide meaningful validation messages.
- Provide loading indicators during async operations.

---

## Angular Forms Standards

- Prefer Reactive Forms.
- Avoid Template-Driven Forms unless extremely simple.
- Validate all user input.
- Display validation feedback clearly.
- Centralize validation logic where appropriate.

Validation should include:

- Required fields
- Length validation
- Pattern validation
- Business rule validation

---

## Angular Security Standards

- Never store secrets in source code.
- Never expose API keys.
- Use secure authentication mechanisms.
- Sanitize user input where required.
- Protect routes that require authorization.
- Validate server responses.
- Avoid exposing sensitive information in logs.

---

## Angular Error Handling Standards

- Handle errors gracefully.
- Provide user-friendly error messages.
- Log unexpected errors.
- Use global error handling mechanisms when appropriate.
- Avoid swallowing exceptions silently.

---

## Angular Testing Standards

- Use Jasmine and Karma or the configured Angular testing framework.
- Write unit tests for components and services.
- Mock API dependencies.
- Validate success and failure scenarios.
- Validate form validation rules.
- Test component behavior and rendering.
- Keep tests isolated and repeatable.

Include tests for:

- Happy Path
- Validation Failures
- Error Handling
- Edge Cases

---

## Angular API Integration Standards

Backend APIs are considered the source of truth.

When consuming APIs:

- Use DTOs/interfaces for request and response contracts.
- Keep frontend contracts aligned with backend contracts.
- Avoid duplicate business rules that already exist on the backend.
- Handle API errors consistently.
- Validate API responses before use.

---

## Full Stack Development Standards

When implementing a feature affecting both Angular and .NET:

1. Understand the complete business requirement.
2. Update backend contracts first.
3. Update frontend DTOs/interfaces.
4. Update Angular services.
5. Update Angular components.
6. Update unit tests.
7. Build backend successfully.
8. Build frontend successfully.
9. Run backend tests.
10. Run frontend tests.
11. Verify end-to-end functionality.

No feature implementation is considered complete until both backend and frontend validations pass.

---

## AI Assistant Instructions For Angular Development

Before proposing Angular changes:

- Read the existing Angular application structure.
- Follow established Angular patterns already present in the repository.
- Reuse existing services, components, models, and utilities before creating new ones.
- Avoid introducing new libraries without justification.
- Generate strongly typed code.
- Generate corresponding unit tests.
- Update affected documentation.
- Explain significant design decisions.
- Identify potential performance impacts.
- Identify potential security impacts.

Prefer minimal, maintainable, production-quality changes consistent with the existing codebase.

## Agentic AI Development Guidelines

- Keep AI provider integrations behind interfaces or dedicated services.
- Store provider credentials in secure configuration or a secrets manager.
- Handle model failures, timeouts, and rate limits.
- Make tool execution explicit and validate tool inputs.
- Require appropriate authorization and safeguards before performing external or irreversible actions.
- Avoid exposing confidential data in prompts, logs, or model responses.
- Prefer small, testable components over tightly coupled AI workflows.

## Pull Request Standards

Every pull request should include:

- A concise summary of the changes.
- The motivation or problem being addressed.
- Relevant implementation details.
- Tests added or updated.
- Test execution results or other test evidence.
- Configuration changes or migration instructions, if applicable.
- Known limitations, if any.

## Instructions for AI Coding Assistants

- Read the relevant existing code before proposing changes.
- Follow the repository's established patterns and conventions.
- Do not assume dependencies or frameworks are installed; inspect project files first.
- Prefer minimal, focused changes over unnecessary refactoring.
- Explain important design decisions and trade-offs.
- Do not claim tests passed unless they were actually executed successfully.
- Update documentation when behavior or configuration changes.
- Ask for clarification when requirements are ambiguous or could introduce security risks.

## Development Workflow Standards

For every Work Item:

Work Item can be:

- Jira Ticket
- GitHub Issue

1. Understand the requirement before coding.
2. Clarify ambiguities before implementation.
3. Produce a functional and technical specification before development begins.
4. Create a dedicated feature branch.
5. Never perform development on main.
6. Keep changes focused on the scope of the issue.
7. Build the solution after implementation.
8. Run unit tests after implementation.
9. Ensure the solution is in a deployable state.
10. Create meaningful commit messages.
11. Create meaningful Pull Requests.
12. Update documentation when applicable.

No implementation should begin until requirements and specifications are approved.

## Git Standards

Branch Naming Convention

feature/issue-{IssueId}-{short-description}

Examples:

feature/issue-15-customer-pagination
feature/issue-28-product-search

Commit Message Convention

Issue #{IssueId} - <Summary>

Examples:

Issue #15 - Add customer pagination

Issue #28 - Add product search endpoint

Never commit directly to main.
Always use feature branches.

## AI Agent Responsibilities

AI Agents should:

- Read issue requirements first.
- Read impacted source code before proposing changes.
- Present assumptions.
- Surface risks early.
- Explain technical decisions.
- Avoid hidden assumptions.
- Record decisions into specification documents.
- Follow approved specifications during implementation.
- Verify build success before considering work complete.

## AI Agent Guardrails

AI Agents may:

- Analyze requirements.
- Generate specifications.
- Generate code.
- Generate tests.
- Generate documentation.
- Create feature branches.
- Create commit messages.
- Generate Pull Requests.

AI Agents must not:

- Commit directly to main.
- Merge Pull Requests.
- Deploy to production.
- Modify production databases.
- Delete repositories.
- Override human decisions.

Human approval is required before merge operations.

## Work Item Management Standards

The system supports both:

- Jira Tickets
- GitHub Issues

Priority Order:

1. Jira Ticket
2. Linked Jira Epic
3. Jira Acceptance Criteria
4. Jira Comments
5. GitHub Issue
6. GitHub Discussion

If a Jira Ticket exists, Jira becomes the primary source of truth.

GitHub Issues should be treated as supplemental unless explicitly specified otherwise.

## Jira MCP Integration Standards

When Jira MCP is available:

- Retrieve ticket details directly from Jira.
- Retrieve acceptance criteria.
- Retrieve linked stories.
- Retrieve linked subtasks.
- Retrieve linked bugs.
- Retrieve epic information.
- Retrieve ticket comments.
- Retrieve attachments if accessible.

Do not ask the user for information already available through Jira.

If ticket information conflicts with user instructions:

- Highlight the conflict.
- Ask for clarification.
- Do not assume.

All generated specifications must reference the originating Jira Ticket.

## Repository Source Of Truth

Requirements Sources:

1. Jira Ticket
2. Jira Epic
3. Jira Acceptance Criteria
4. Jira Comments
5. GitHub Issue
6. GitHub Discussions

Code Sources:

- Repository Source Code
- Existing Implementation Patterns
- Existing Tests

Architecture Sources:

- Existing Repository Architecture
- Existing Coding Patterns
- copilot-instructions.md

Conflict Resolution:

Requirements:
- Jira overrides GitHub Issues.

Code:
- Existing source code overrides assumptions.

Architecture:
- Existing repository patterns override generated preferences.

---

## Agent Workflow

All work items must follow the defined workflow.

Workflow:

#grill <WorkItem>
→ #spec <WorkItem>
→ #setup <WorkItem>
→ #develop <WorkItem>
→ #review <WorkItem>
→ #commit <WorkItem>
→ #pr <WorkItem>

No phase may be skipped.

Each phase must consume and validate outputs from the previous phase.

Development must not begin until:

- Requirement discovery is complete.
- Specifications are approved.
- Setup phase is completed successfully.

Commit must not begin until:

- Development completed successfully.
- Review completed successfully.

Pull Request creation must not begin until:

- Commit stage completed successfully.
- Branch synchronized successfully.

---

## Specification Standards

Every specification package must include:

- Functional Specification
- Technical Specification
- BDD Test Specification
- Traceability Matrix

Specifications must be reviewed and approved before development begins.

Implementation must remain within approved specification scope.

Any scope expansion requires specification updates and approval.

---

## Traceability Standards

Every requirement must map to:

Requirement
→ Design
→ Implementation
→ Test

Every approved requirement must have:

- At least one implementation artifact.
- At least one associated test case.

Maintain traceability throughout the software development lifecycle.

---

## Build Validation Standards

Backend Validation:

- dotnet restore
- dotnet build
- dotnet test

Frontend Validation:

- npm install
- npm run build
- npm test

Build failures must block progression to subsequent workflow stages.

Test failures must be documented and reviewed before progression.

---

## Review Standards

Every implementation must undergo review before commit.

Review must validate:

- Requirement Compliance
- Specification Compliance
- Architecture Compliance
- Security
- Performance
- Logging
- Testing
- Documentation
- Git Hygiene

Review Outcomes:

- Approved
- Approved With Recommendations
- Changes Required
- Blocked

Commit operations may proceed only when review outcome is:

- Approved
- Approved With Recommendations

---

## Definition Of Done

A work item is complete only when all of the following are true:

- Requirement Discovery completed.
- Functional Specification approved.
- Technical Specification approved.
- BDD Specification approved.
- Traceability Matrix completed.
- Development completed.
- Build successful.
- Backend tests successful.
- Frontend tests successful.
- Review completed.
- Documentation updated.
- Commit completed.
- Pull Request generated.
- Work item ready for human review.

Implementation alone does not constitute completion.

---

## MCP Integration Standards

When MCP servers are available:

- Use MCP as the authoritative source of connected system information.
- Retrieve information directly from connected systems.
- Avoid requesting information already available through MCP.

Supported MCP Integrations:

- Jira MCP
- GitHub MCP
- Future MCP Integrations

All MCP-retrieved information should be validated against repository context before use.

If MCP information conflicts with user instructions:

- Surface the conflict.
- Ask for clarification.
- Do not assume.

---

## Jira MCP Standards

When Jira MCP is available:

Retrieve:

- Ticket Details
- Acceptance Criteria
- Linked Stories
- Linked Tasks
- Linked Bugs
- Linked Epics
- Ticket Comments
- Attachments
- Linked Pull Requests
- Linked Confluence Pages

Do not ask users for information already available through Jira.

All generated specifications must reference the originating Jira Ticket.

Jira is the primary source of truth for requirements.

---

## GitHub MCP Standards

When GitHub MCP is available:

Retrieve:

- Issues
- Pull Requests
- Discussions
- Repository Metadata
- File Contents
- Commit History
- Branch Information

GitHub MCP is the primary source of truth for repository state.

GitHub data should supplement Jira requirements where appropriate.

---

## Git Standards

### Branch Naming Convention

Jira Work Items:

feature/{TicketId}-{short-description}

Examples:

feature/POC-123-customer-pagination

feature/DEV-456-product-search

feature/CUSTOMER-1024-order-history

GitHub Issues:

feature/issue-{IssueId}-{short-description}

Examples:

feature/issue-15-customer-pagination

feature/issue-28-product-search

### Commit Message Convention

Jira:

{TicketId} - Summary

Examples:

POC-123 - Add customer pagination

DEV-456 - Add product search endpoint

GitHub:

Issue #{IssueId} - Summary

Examples:

Issue #15 - Add customer pagination

Issue #28 - Add product search endpoint

Never commit directly to:

- main
- master
- release
- production

Always use feature branches.

---

## AI Decision-Making Standards

AI Agents should:

- Prefer existing patterns over introducing new patterns.
- Prefer modifying existing code over duplicating logic.
- Prefer minimal changes over broad refactoring.
- Reuse existing services, components, repositories, and utilities.
- Explicitly document assumptions.
- Surface risks early.

AI Agents must not:

- Invent requirements.
- Invent acceptance criteria.
- Change approved requirements.
- Expand implementation scope without approval.
- Ignore repository standards.
- Ignore approved specifications.

---

## Agent Handoff Standards

Each agent must generate a handoff summary for the next agent.

Examples:

#grill
→ Requirement Discovery Summary

#spec
→ Development Specification Package

#setup
→ Development Readiness Summary

#develop
→ Development Completion Summary

#review
→ Commit Readiness Summary

#commit
→ Pull Request Readiness Summary

#pr
→ Release Readiness Summary

Each handoff must include:

- Work Item
- Current Status
- Risks
- Outstanding Issues
- Next Recommended Action

---

## Human Approval Requirements

Human approval is required before:

- Requirement approval
- Specification approval
- Merge approval
- Production deployment

AI Agents may assist with analysis and implementation but must not replace human approval for governance decisions.