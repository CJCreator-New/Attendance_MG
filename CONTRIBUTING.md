# Contributing Guidelines

## Code Standards

### Naming Conventions

- **Variables/Functions**: camelCase (`employeeData`, `calculateSalary`)
- **Components**: PascalCase (`EmployeeModal`, `AttendanceSheet`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_EMPLOYEES`, `STORAGE_WARNING_THRESHOLD`)
- **Files**: Match component name (`EmployeeModal.jsx`)

### Code Style

- Use single quotes for strings
- 2 spaces for indentation
- Semicolons required
- Max line length: 100 characters
- Trailing commas in ES5 style

### Component Structure

```jsx
// 1. Imports
import React, { useState } from 'react';
import { Icon } from 'lucide-react';

// 2. Component
export const MyComponent = ({ prop1, prop2 }) => {
  // 3. State
  const [state, setState] = useState();
  
  // 4. Effects
  useEffect(() => {}, []);
  
  // 5. Handlers
  const handleClick = () => {};
  
  // 6. Render
  return <div>...</div>;
};

// 7. PropTypes
MyComponent.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
};
```

### Commit Messages

Format: `type(scope): message`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Build/tooling

Examples:
- `feat(attendance): add bulk edit functionality`
- `fix(salary): correct EPF calculation threshold`
- `docs(readme): update installation instructions`

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Request review from maintainers

## Questions?

Open an issue for discussion before major changes.
