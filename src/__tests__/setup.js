import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Appwrite
vi.mock('../lib/appwrite', () => ({
  client: {},
  account: {
    get: vi.fn(),
    createEmailSession: vi.fn(),
    deleteSession: vi.fn(),
  },
  databases: {
    listDocuments: vi.fn(),
    getDocument: vi.fn(),
    createDocument: vi.fn(),
    updateDocument: vi.fn(),
    deleteDocument: vi.fn(),
  },
}));

// Mock toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
  },
  Toaster: () => null,
}));
