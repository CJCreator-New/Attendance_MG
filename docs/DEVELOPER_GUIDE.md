# Developer Guide

## Architecture

### Tech Stack
- **Frontend:** React 18 + Vite
- **Backend:** Appwrite (BaaS)
- **State:** Zustand
- **Styling:** Tailwind CSS
- **Testing:** Vitest + Playwright

### Project Structure
```
attendance-app/
├── src/
│   ├── components/        # Reusable UI components
│   ├── features/          # Feature modules
│   ├── services/          # API services
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   ├── lib/               # Third-party configs
│   └── __tests__/         # Test files
├── docs/                  # Documentation
└── public/                # Static assets
```

---

## Setup Development Environment

### Prerequisites
- Node.js 18+
- npm/yarn
- Appwrite account

### Installation
```bash
git clone <repo-url>
cd attendance-app
npm install
```

### Environment Variables
Create `.env`:
```
VITE_APPWRITE_ENDPOINT=https://sgp.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=697dac94002f85b009ab
VITE_APPWRITE_DATABASE_ID=attendance-db
```

### Run Development Server
```bash
npm run dev
```

---

## Service Layer Pattern

All Appwrite operations go through service classes:

```javascript
// services/employeeService.js
export const EmployeeService = {
  async getAllEmployees() {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
    return response.documents;
  },
  
  async createEmployee(data) {
    return await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), data);
  }
};
```

### Benefits
- Centralized API logic
- Easy to test
- Consistent error handling
- Cache integration

---

## Adding New Features

### 1. Create Service
```javascript
// services/myService.js
import { databases } from '../lib/appwrite';
import { ID } from 'appwrite';

const COLLECTION_ID = 'my-collection';

export const MyService = {
  async getAll() {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
    return response.documents;
  },
  
  async create(data) {
    return await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), data);
  }
};
```

### 2. Create Component
```javascript
// features/myfeature/MyComponent.jsx
import { useState, useEffect } from 'react';
import { MyService } from '../../services/myService';

export default function MyComponent() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    const result = await MyService.getAll();
    setData(result);
  };
  
  return <div>{/* UI */}</div>;
}
```

### 3. Add Route
```javascript
// main.jsx
const MyComponent = lazy(() => import('./features/myfeature/MyComponent'));

// In routes
<Route path="/myfeature" element={<MyComponent />} />
```

---

## State Management

### Zustand Store
```javascript
// stores/myStore.js
import { create } from 'zustand';

export const useMyStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) }))
}));
```

### Usage
```javascript
const { items, addItem } = useMyStore();
```

---

## Security Best Practices

### Input Sanitization
```javascript
import { sanitize } from '../utils/sanitize';

const cleanData = sanitize.object(userInput);
```

### Rate Limiting
```javascript
import { withRateLimit } from '../utils/rateLimit';

const createEmployee = withRateLimit(async (data) => {
  return await EmployeeService.createEmployee(data);
}, 20); // 20 requests/minute
```

### Validation
```javascript
import { validateEmployee } from '../utils/validation';

const errors = validateEmployee(data);
if (errors.length > 0) {
  throw new Error(errors.join(', '));
}
```

---

## Testing

### Unit Tests
```javascript
// __tests__/services/myService.test.js
import { describe, it, expect, vi } from 'vitest';
import { MyService } from '../../services/myService';

describe('MyService', () => {
  it('should fetch data', async () => {
    const data = await MyService.getAll();
    expect(data).toBeDefined();
  });
});
```

### Component Tests
```javascript
// __tests__/components/MyComponent.test.jsx
import { render, screen } from '@testing-library/react';
import MyComponent from '../../components/MyComponent';

test('renders component', () => {
  render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

### E2E Tests
```javascript
// __tests__/e2e/myfeature.spec.js
import { test, expect } from '@playwright/test';

test('should complete workflow', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.click('text=My Feature');
  await expect(page.locator('h1')).toContainText('My Feature');
});
```

### Run Tests
```bash
npm run test          # Unit tests
npm run test:e2e      # E2E tests
npm run test:coverage # Coverage report
```

---

## Performance Optimization

### Caching
```javascript
import { apiCache } from '../utils/cache';

const data = apiCache.get('employees');
if (!data) {
  const fresh = await EmployeeService.getAllEmployees();
  apiCache.set('employees', fresh);
}
```

### Pagination
```javascript
import { usePagination } from '../hooks/usePagination';

const { paginatedItems, nextPage, prevPage } = usePagination(items, 10);
```

### Lazy Loading
```javascript
const MyComponent = lazy(() => import('./MyComponent'));
```

---

## Real-Time Features

### Subscribe to Changes
```javascript
import { useRealtimeAttendance } from '../hooks/useRealtimeAttendance';

const { isConnected, lastUpdate } = useRealtimeAttendance(() => {
  // Callback on update
  loadData();
});
```

---

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
vercel deploy
```

### Deploy to Netlify
```bash
netlify deploy --prod
```

### Environment Variables
Set in hosting platform:
- `VITE_APPWRITE_ENDPOINT`
- `VITE_APPWRITE_PROJECT_ID`
- `VITE_APPWRITE_DATABASE_ID`

---

## Debugging

### Enable Debug Logs
```javascript
localStorage.setItem('debug', 'true');
```

### Appwrite Console
- View database records
- Check permissions
- Monitor API calls

### React DevTools
- Inspect component state
- Profile performance
- Debug re-renders

---

## Code Style

### ESLint
```bash
npm run lint
```

### Prettier
```bash
npm run format
```

### Naming Conventions
- Components: PascalCase
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE
- Files: kebab-case or PascalCase

---

## Contributing

1. Create feature branch
2. Make changes
3. Write tests
4. Run linter
5. Submit PR
6. Wait for review

---

## Resources

- [React Docs](https://react.dev)
- [Appwrite Docs](https://appwrite.io/docs)
- [Vite Docs](https://vitejs.dev)
- [Tailwind Docs](https://tailwindcss.com)
