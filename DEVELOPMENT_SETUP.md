# Development Setup Guide

## Prerequisites

- Node.js 18+ and npm
- Git
- Modern browser (Chrome, Firefox, Edge)

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm test` - Run tests
- `npm test:coverage` - Run tests with coverage

## Development Workflow

1. Create a new branch for your feature
2. Make changes and test locally
3. Run `npm run lint:fix` and `npm run format`
4. Commit changes (husky will run pre-commit hooks)
5. Push and create pull request

## Docker Setup

```bash
# Build image
docker build -t attendance-app .

# Run container
docker-compose up

# Access at http://localhost:3000
```

## Code Style

- Use ESLint and Prettier configurations
- Follow React best practices
- Write meaningful commit messages
- Add PropTypes to all components

## Testing

- Write unit tests for utilities
- Add integration tests for components
- Maintain 70%+ code coverage

## Environment Variables

See `.env.example` for all available variables.
