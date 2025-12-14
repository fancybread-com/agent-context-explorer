# Create Test

## Overview
Generate unit tests for code components. The command adapts to backend or frontend code automatically based on the codebase structure and file patterns.

## Usage

The command supports explicit type specification:

```
/create-test --type=unit for [component]
```

**Examples:**
- `/create-test --type=unit for OAuthService`
- `/create-test --type=unit for UserProfile`
- `/create-test --type=unit for auth-utils.ts`

## Steps

1. **Detect codebase type**
   - Analyze project structure
   - Identify if backend (API, services, models) or frontend (components, hooks, utils)
   - Determine test framework in use (Jest, Vitest, pytest, unittest, etc.)
   - Check existing test patterns and conventions

2. **Analyze code to test**
   - Read function/class implementation
   - Identify inputs and outputs
   - Understand expected behavior
   - Review existing tests (if any)
   - Identify dependencies to mock

3. **Identify test cases**
   - Happy path (expected inputs)
   - Edge cases (boundary conditions)
   - Error cases (invalid inputs)
   - State transitions
   - Special values (null, zero, empty, etc.)

4. **Generate test code**
   - Use project's test framework
   - Follow naming conventions
   - Use Arrange-Act-Assert pattern
   - Include descriptive test names
   - Add comments for complex scenarios
   - Adapt mocking strategy for backend vs frontend:
     - **Backend**: Mock external services, databases, APIs
     - **Frontend**: Mock components, hooks, browser APIs, network requests

5. **Create test file**
   - Place in appropriate test directory
   - Follow project's test file naming convention
   - Match project's test structure

6. **Run tests**
   - Execute new tests
   - Verify all pass
   - Check coverage contribution

7. **Review and refine**
   - Ensure tests are independent
   - Verify tests are deterministic
   - Check test clarity and readability
   - Add missing test cases if needed

## Backend vs Frontend Adaptation

### Backend Tests
- Mock external services (databases, APIs, file systems)
- Test business logic and data transformations
- Focus on service methods and API endpoints
- Use appropriate backend testing patterns

### Frontend Tests
- Mock components, hooks, and browser APIs
- Test user interactions and state management
- Focus on component rendering and behavior
- Use appropriate frontend testing patterns (React Testing Library, Vue Test Utils, etc.)

## Unit Test Checklist
- [ ] Codebase type detected (backend/frontend)
- [ ] Test framework identified
- [ ] Code to test analyzed
- [ ] Test cases identified:
  - [ ] Happy path
  - [ ] Edge cases
  - [ ] Error cases
- [ ] Dependencies identified for mocking
- [ ] Tests generated with clear names
- [ ] Tests follow AAA pattern
- [ ] Tests are independent
- [ ] Tests are fast (< 100ms each)
- [ ] All tests pass
- [ ] Coverage increased

