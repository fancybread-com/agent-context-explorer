# Create Plan

## Overview
Create a detailed technical implementation plan for a story by analyzing requirements, reviewing the codebase, and generating a structured plan document.

## Definitions

- **{TASK_KEY}**: Story/Issue ID from the issue tracker (e.g., `FB-6`, `PROJ-123`, `KAN-42`)
- **Branch Name Format**: Use short format `{type}/{TASK_KEY}` (e.g., `feat/FB-6`, `fix/PROJ-123`)
  - Short format is recommended: `feat/FB-6` (not `feat/FB-6-file-watching-workspace-commands`)
  - **Important**: Be consistent within a project - use the same format for all branches
- **Plan Document**: Technical implementation plan saved at `.plans/{TASK_KEY}-{description}.plan.md`
  - Contains story details, technical design, implementation steps, and testing strategy
- **Story Details**: Information from issue tracker (Jira, GitHub Issues, Azure DevOps, etc.)
  - Includes title, description, acceptance criteria, and related context
- **User Story Format**: Typically follows "As a [user type], I want [goal], so that [benefit]"
- **Acceptance Criteria**: Specific, testable conditions that must be met for the story to be considered complete

## Prerequisites

Before proceeding, verify:

1. **MCP Status Validation**: Perform MCP server status checks (see `mcp-status.md` for detailed steps)
   - Test each configured MCP server connection (Atlassian, GitHub, etc.)
   - Verify all required integrations are authorized and operational
   - **If any MCP server fails validation, STOP and report the failure. Do not proceed.**

2. **Story Exists**: Verify the story exists in the issue tracker
   - Use MCP tools to fetch story by `{TASK_KEY}`
   - **If story doesn't exist, STOP and report error: "Story {TASK_KEY} not found"**

3. **Story Has Sufficient Detail**: Verify story has:
   - Clear description or user story format
   - At least 3-5 acceptance criteria
   - Context about the problem being solved
   - **If story lacks sufficient detail, STOP and ask user for clarification before proceeding.**

## Steps

1. **Analyze story**
   - **Fetch story from issue tracker using MCP:**
     - Use `mcp_Atlassian-MCP-Server_getJiraIssue` for Jira issues
     - Use `mcp_github_issue_read` for GitHub Issues
     - Extract: title, description, acceptance criteria, labels, priority, related issues
   - **Parse user story format:**
     - Identify user persona ("As a...")
     - Extract goal ("I want...")
     - Understand benefit ("so that...")
     - If not in user story format, extract requirements from description
   - **Extract acceptance criteria:**
     - Look for numbered lists, checkboxes, or "Given/When/Then" format
     - Convert each criterion into a testable requirement
     - **If no acceptance criteria found, STOP and ask user to provide them.**
   - **Identify technical requirements:**
     - Parse technical constraints from description
     - Note any dependencies mentioned
     - Identify performance or security requirements
   - **Check for missing information:**
     - Is the problem clearly defined?
     - Are acceptance criteria specific and testable? (Minimum 3-5 criteria)
     - Is the scope clear?
     - Does it follow user story format or have clear requirements?
     - **If critical information is missing, STOP and ask specific questions to fill gaps.**
     - **Reference**: See `create-task.md` for detailed validation criteria

2. **Analyze codebase**
   - **Use codebase_search to find similar implementations:**
     - Search for similar features or patterns
     - Example: "How is file watching implemented?" or "Where is user authentication handled?"
     - Review 3-5 similar implementations to understand patterns
   - **Identify affected components:**
     - Use `codebase_search` to find related modules/components
     - Use `grep` to find specific patterns, functions, or classes
     - Review directory structure to understand organization
   - **Review existing patterns:**
     - How are similar features structured?
     - What testing patterns are used?
     - What naming conventions are followed?
     - How are errors handled?
   - **Identify files to examine:**
     - Main implementation files
     - Test files (look for `*.test.ts`, `*_test.py`, `*Test.java`, etc.)
     - Configuration files
     - Documentation files
   - **Review related test files:**
     - Understand test structure and patterns
     - Note test utilities and helpers
     - Identify test coverage expectations
   - **If codebase analysis reveals blockers or unclear patterns, note them in the plan for discussion.**

3. **Design implementation**
   - **Break down into subtasks:**
     - Create 3-7 logical subtasks
     - Each subtask should be a complete, testable unit of work
     - Order subtasks by dependencies
   - **Identify files to create/modify:**
     - List new files to create (with paths)
     - List existing files to modify (with specific changes)
     - Group by component/module
   - **Plan database changes (if applicable):**
     - Schema changes
     - Migration scripts
     - Data model updates
   - **Design API changes (if applicable):**
     - New endpoints
     - Modified endpoints
     - Request/response formats
     - Error handling
   - **Plan test strategy:**
     - Unit tests for each component
     - Integration tests for workflows
     - Test data requirements
     - Mock/stub requirements
   - **Document dependencies:**
     - External libraries needed
     - Internal dependencies
     - Order of implementation
   - **Plan error handling:**
     - Error scenarios to handle
     - Error messages and codes
     - Logging requirements

4. **Generate plan document**
   - **Create plan file at `.plans/{TASK_KEY}-{kebab-case-description}.plan.md`:**
     - **First, check if file already exists (optional - for information only):**
       - Use `glob_file_search` with pattern: `**/.plans/{TASK_KEY}-*.plan.md`
       - If files found, note them but proceed with creation (overwriting is acceptable for plan updates)
     - Use kebab-case for description (e.g., `PROJ-123-user-authentication.plan.md`)
   - **Write plan using the following structure:**
     ```markdown
     # {Story Title} ({TASK_KEY})

     ## Story
     [User story format or description]

     ## Context
     [Background information, why this is needed, related issues]

     ## Scope
     ### In Scope
     - [What is included]

     ### Out of Scope
     - [What is explicitly excluded]

     ## Acceptance Criteria
     1. [Criterion 1]
     2. [Criterion 2]
     3. [Criterion 3]
     ...

     ## Technical Design
     ### Architecture
     [High-level design approach]

     ### Components
     - Component 1: [Description]
     - Component 2: [Description]

     ### Data Model
     [If applicable: database schema, data structures]

     ### API Design
     [If applicable: endpoints, request/response formats]

     ## Implementation Steps
     1. **Subtask 1**: [Description]
        - Files to create: `path/to/file1.ts`
        - Files to modify: `path/to/file2.ts`
        - Tests: `path/to/file1.test.ts`

     2. **Subtask 2**: [Description]
        ...

     ## Testing
     ### Unit Tests
     - [Test cases for component 1]
     - [Test cases for component 2]

     ### Integration Tests
     - [Integration test scenarios]

     ### Test Data
     - [Test data requirements]

     ## Dependencies
     - [External libraries]
     - [Internal dependencies]

     ## Status
     - [ ] Story analyzed
     - [ ] Codebase reviewed
     - [ ] Technical design complete
     - [ ] Implementation steps defined
     - [ ] Testing strategy defined
     - [ ] Ready for implementation
     ```
   - **Verify plan file was created successfully**
   - **Post plan summary to issue tracker:**
     - **Sequence:**
       1. Fetch issue to verify it exists: `mcp_Atlassian-MCP-Server_getJiraIssue` or `mcp_github_issue_read`
       2. Create comment with plan summary: `mcp_Atlassian-MCP-Server_addCommentToJiraIssue` or `mcp_github_add_issue_comment`
       3. Verify comment was posted (optional - check issue comments)
     - Comment should include:
       - Link to plan file: `.plans/{TASK_KEY}-*.plan.md`
       - Brief summary of approach
       - Key implementation steps (3-5 bullets)
     - **If posting fails, note it but don't stop - plan file creation is the primary goal.**

## Tools

### MCP Tools (Atlassian)
- `mcp_Atlassian-MCP-Server_atlassianUserInfo` - Verify Atlassian MCP connection
- **Obtaining CloudId for Atlassian Tools:**
  - **Method 1 (Recommended)**: Use `mcp_Atlassian-MCP-Server_getAccessibleAtlassianResources`
    - Returns list of accessible resources with `cloudId` values
    - Use the first result or match by site name
    - Only call if cloudId is not already known or has expired
  - **Method 2**: Extract from Atlassian URLs
    - Jira URL format: `https://{site}.atlassian.net/...`
    - CloudId can be extracted from the URL or obtained via API
  - **Error Handling**: If cloudId cannot be determined, STOP and report: "Unable to determine Atlassian cloudId. Please verify MCP configuration."
- `mcp_Atlassian-MCP-Server_getJiraIssue` - Fetch story details by {TASK_KEY}
  - Parameters: `cloudId`, `issueIdOrKey` = {TASK_KEY}
  - Extract: title, description, acceptance criteria, labels, priority, status
- `mcp_Atlassian-MCP-Server_getJiraIssueRemoteIssueLinks` - Get related issues/links
  - Parameters: `cloudId`, `issueIdOrKey` = {TASK_KEY}
- `mcp_Atlassian-MCP-Server_addCommentToJiraIssue` - Post plan summary comment to issue
  - Parameters: `cloudId`, `issueIdOrKey` = {TASK_KEY}, `commentBody` = markdown summary

### MCP Tools (GitHub)
- `mcp_github_get_me` - Verify GitHub MCP connection
- `mcp_github_issue_read` - Fetch GitHub issue details
  - Parameters: `owner`, `repo`, `issue_number` = {TASK_KEY} (if numeric)
  - Extract: title, body, labels, state
- `mcp_github_add_issue_comment` - Post plan summary comment to GitHub issue
  - Parameters: `owner`, `repo`, `issue_number` = {TASK_KEY}, `body` = markdown summary

### Filesystem Tools
- `glob_file_search` - Check if plan file already exists
  - Pattern: `**/.plans/{TASK_KEY}-*.plan.md`
- `write` - Create new plan document file
  - Parameters: `file_path` = `.plans/{TASK_KEY}-{description}.plan.md`, `contents` = markdown plan
- `read_file` - Read existing code files for analysis
- `list_dir` - Explore directory structure to understand codebase organization

### Codebase Tools
- `codebase_search` - Search for similar implementations and patterns
  - Query: "How is [similar feature] implemented?"
  - Query: "Where is [component/pattern] used?"
  - Query: "How does [existing functionality] work?"
  - Use to find: similar features, existing patterns, architectural decisions
- `grep` - Find specific patterns, functions, classes, or imports
  - Pattern: function names, class names, imports, file extensions
  - Use to find: related files, test patterns, configuration files
- `glob_file_search` - Find files by pattern
  - Pattern: `**/*.test.ts`, `**/*_test.py`, `**/*Test.java` (test files)
  - Pattern: `**/config.*`, `**/*.config.*` (config files)

### Terminal Tools
- `run_terminal_cmd` - Execute commands for codebase analysis
  - `find . -name "*.test.*" -type f` - Find test files
  - `git log --oneline --grep="{keyword}"` - Search commit history for related work
  - `git ls-files | grep {pattern}` - List files matching pattern

## Planning Checklist
- [ ] MCP status validation performed
- [ ] Story fetched from issue tracker
- [ ] Story has sufficient detail (description, acceptance criteria)
- [ ] User story format parsed (or requirements extracted)
- [ ] Acceptance criteria extracted and validated
- [ ] Codebase searched for similar implementations
- [ ] Existing patterns reviewed
- [ ] Affected components identified
- [ ] Related test files reviewed
- [ ] Implementation broken down into subtasks
- [ ] Files to create/modify identified
- [ ] Database changes planned (if applicable)
- [ ] API changes designed (if applicable)
- [ ] Test strategy defined
- [ ] Dependencies documented
- [ ] Error handling planned
- [ ] Plan document created with required sections
- [ ] Plan file verified
- [ ] Plan summary posted to issue

## Plan Document Structure

The plan document must include the following sections:

1. **Story**: User story format or clear description
2. **Context**: Background, motivation, related issues
3. **Scope**: What's included and explicitly excluded
4. **Acceptance Criteria**: Numbered, testable criteria
5. **Technical Design**: Architecture, components, data model, API design
6. **Implementation Steps**: Ordered subtasks with file changes
7. **Testing**: Unit tests, integration tests, test data
8. **Dependencies**: External and internal dependencies
9. **Status**: Checklist for tracking progress

## Guidance

### Role
Act as a **software engineer** responsible for creating a detailed technical implementation plan. You are analytical, thorough, and consider both technical feasibility and maintainability.

### Instruction
Execute the create-plan workflow to generate a comprehensive technical implementation plan for a story. This includes:
1. Performing prerequisite validation checks
2. Analyzing the story and extracting requirements
3. Reviewing the codebase to understand patterns and identify similar implementations
4. Designing the technical approach and breaking it down into actionable steps
5. Generating a structured plan document with all required sections

### Context
- The story is tracked in an issue management system (Jira, Azure DevOps, GitHub Issues, etc.)
- The codebase has existing patterns, conventions, and architectural decisions that should be respected
- MCP integrations provide access to issue trackers for fetching story details
- Plan documents are stored in `.plans/` directory and follow naming convention `{TASK_KEY}-{description}.plan.md`
- The plan will be used by developers to implement the story in subsequent steps
- Plans should be detailed enough for implementation but not overly prescriptive

### Examples

**Example Story Input (from Jira):**
```
Title: Add user authentication
Description: As a user, I want to log in with OAuth2, so that I can access my account securely.

Acceptance Criteria:
1. User can log in using Google OAuth2
2. User session is maintained for 24 hours
3. Failed login attempts are logged
4. User can log out
5. Session expires after inactivity
```

**Example Plan Document Output:**
```markdown
# Add user authentication (PROJ-123)

## Story
As a user, I want to log in with OAuth2, so that I can access my account securely.

## Context
Currently, users cannot access their accounts. We need to implement OAuth2 authentication to provide secure access. This is part of the user management epic.

## Scope
### In Scope
- OAuth2 login with Google
- Session management
- Logout functionality
- Session expiration

### Out of Scope
- Password-based authentication
- Multi-factor authentication
- Social login providers other than Google

## Acceptance Criteria
1. User can log in using Google OAuth2
2. User session is maintained for 24 hours
3. Failed login attempts are logged
4. User can log out
5. Session expires after inactivity

## Technical Design
### Architecture
- Use OAuth2 library for authentication flow
- Store sessions in Redis
- Middleware for session validation

### Components
- AuthService: Handles OAuth2 flow
- SessionManager: Manages user sessions
- AuthMiddleware: Validates sessions on requests

### Data Model
- User table: id, email, oauth_id, created_at
- Session table: session_id, user_id, expires_at

## Implementation Steps
1. **Set up OAuth2 library**: Install and configure OAuth2 client
   - Files to create: `src/auth/config.ts`
   - Tests: `src/auth/config.test.ts`

2. **Implement AuthService**: Create service for OAuth2 flow
   - Files to create: `src/auth/service.ts`
   - Tests: `src/auth/service.test.ts`

3. **Implement SessionManager**: Create session management
   - Files to create: `src/auth/session.ts`
   - Tests: `src/auth/session.test.ts`

4. **Create AuthMiddleware**: Add middleware for session validation
   - Files to create: `src/auth/middleware.ts`
   - Tests: `src/auth/middleware.test.ts`

5. **Add login/logout endpoints**: Create API endpoints
   - Files to modify: `src/routes/auth.ts`
   - Tests: `src/routes/auth.test.ts`

## Testing
### Unit Tests
- AuthService: OAuth2 flow, token validation
- SessionManager: Session creation, expiration, validation
- AuthMiddleware: Session validation, error handling

### Integration Tests
- Complete login flow
- Session persistence
- Logout flow
- Session expiration

### Test Data
- Mock OAuth2 provider responses
- Test user accounts
- Test session data

## Dependencies
- oauth2-client library
- redis client library
- express (for middleware)

## Status
- [x] Story analyzed
- [x] Codebase reviewed
- [x] Technical design complete
- [x] Implementation steps defined
- [x] Testing strategy defined
- [ ] Ready for implementation
```

**Example Issue Comment (Plan Summary):**
```
## Implementation Plan Created

Plan document: `.plans/PROJ-123-user-authentication.plan.md`

### Approach
- OAuth2 authentication with Google
- Redis-based session management
- Middleware for session validation

### Key Implementation Steps
1. Set up OAuth2 library and configuration
2. Implement AuthService for OAuth2 flow
3. Create SessionManager for session handling
4. Add AuthMiddleware for request validation
5. Create login/logout API endpoints

### Testing Strategy
- Unit tests for each component
- Integration tests for complete flows
- Session expiration and error handling tests

Ready for implementation.
```

### Constraints

**Rules (Must Follow):**
1. **Prerequisites Must Pass**: Do not proceed if MCP validation fails or story doesn't exist. STOP and report the issue.
2. **Story Validation**: Story must have sufficient detail (description, 3+ acceptance criteria). If missing, STOP and ask for clarification.
3. **Plan File Naming**: Use format `.plans/{TASK_KEY}-{kebab-case-description}.plan.md`
   - Example: `PROJ-123-user-authentication.plan.md`
   - If creating a plan and file doesn't exist, that's expected - proceed with creation
4. **Required Sections**: Plan document must include all sections: Story, Context, Scope, Acceptance Criteria, Technical Design, Implementation Steps, Testing, Dependencies, Status
5. **Codebase Analysis**: Must search for similar implementations before designing. Don't reinvent patterns that already exist.
6. **Implementation Steps**: Break down into 3-7 logical subtasks. Each should be complete and testable.
7. **File Identification**: Must specify exact file paths for files to create/modify. Use relative paths from project root.
8. **Test Strategy**: Must include unit tests, integration tests, and test data requirements. Follow existing test patterns.
9. **Error Handling**: If story analysis reveals blockers or missing information, STOP and ask specific questions. Don't proceed with assumptions.
10. **Plan Summary**: Post summary to issue tracker after plan creation. If posting fails, note it but don't fail the command.

**Existing Standards (Reference):**
- MCP status validation: See `mcp-status.md` for detailed MCP server connection checks
- Plan file location: `.plans/{TASK_KEY}-*.plan.md` (referenced in `start-task.md` and `complete-task.md`)
- **Plan File Selection**: If multiple files match the pattern `.plans/{TASK_KEY}-*.plan.md`:
  - Use the most recently modified file (check file modification time)
  - If modification time cannot be determined, use the first file found alphabetically
  - Report which file was selected: "Using plan file: {filename}"
- Story format: User story format ("As a... I want... So that...") as used in `create-task.md`
- File naming: Kebab-case for plan files (consistent with branch naming conventions)
- Branch naming: Short format `{type}/{TASK_KEY}` (consistent with `start-task.md` and `complete-task.md`)

### Output
1. **Plan Document**: Structured markdown file at `.plans/{TASK_KEY}-{description}.plan.md` containing:
   - Story details and context
   - Technical design and architecture
   - Step-by-step implementation guide
   - Testing strategy
   - Dependencies and status tracking

2. **Issue Comment**: Plan summary posted to the issue tracker with:
   - Link to plan file
   - Brief approach summary
   - Key implementation steps

The plan should be detailed enough for a developer to implement the story without additional clarification, while being flexible enough to allow for implementation adjustments.
