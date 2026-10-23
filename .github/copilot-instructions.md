# Project Overview

This project is a .NET Web API proof of concept for exploring agentic AI capabilities.

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

## API Standards

- Use appropriate HTTP methods and status codes.
- Validate incoming request data.
- Use DTOs for request and response contracts where appropriate.
- Keep API contracts separate from internal implementation details.
- Maintain consistent error responses.
- Add or maintain OpenAPI documentation where supported by the project.

## Testing Standards

- Use xUnit for automated tests.
- Use Moq when mocking dependencies.
- Write unit tests for business logic and important edge cases.
- Include tests for success scenarios, validation failures, and error handling.
- Keep tests independent and repeatable.
- Run relevant tests before submitting changes.

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

For every GitHub Issue:

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