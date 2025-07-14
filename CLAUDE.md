# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NextFij is a Next.js 15 application for college basketball statistical analysis called "DeepFij". It's a modern web application built with React 19, TypeScript, and Tailwind CSS that provides basketball statistics, team information, and administrative tools for managing basketball data.

## Core Architecture

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Runtime**: React 19 with modern features
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **State Management**: TanStack Query for server state, React Context for auth
- **HTTP Client**: Axios with interceptors for API communication
- **Authentication**: JWT tokens stored in cookies with middleware protection
- **Data Visualization**: D3.js for statistical charts and graphs

### Key Directories
- `/src/app/` - Next.js app router pages and API routes
- `/src/components/` - React components including shadcn/ui components
- `/src/lib/` - Utility functions, API client, auth context, and type definitions
- `/src/middleware.ts` - Route protection and authentication middleware

### External API Integration
The application integrates with a backend API at `http://localhost:8080` for:
- Team and conference data management
- Game statistics and scheduling
- Administrative operations
- User authentication

## Development Commands

### Basic Development
```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Testing
The project doesn't have a specific test command defined. Check if tests exist before adding testing functionality.

## Authentication System

The application uses JWT-based authentication with the following flow:
1. Login via `/api/auth/login` endpoint
2. Token stored in HTTP-only cookies
3. Middleware validates tokens on protected routes
4. AuthContext provides authentication state throughout the app
5. API client automatically includes Authorization headers

### Protected Routes
All routes except `/login` and `/api/*` require authentication via middleware.

## API Architecture

### Client Configuration
- Base URL: `http://localhost:8080/api` (configurable via `NEXT_PUBLIC_API_URL`)
- Automatic token injection via request interceptors
- Error handling with automatic logout on 401 responses
- Comprehensive response/error logging

### Key API Endpoints
- `/api/admin/schedule/` - Schedule management
- `/api/admin/stats/` - Statistics management
- `/api/auth/login` - User authentication
- `/api/team/[teamId]` - Team-specific data

## Component Architecture

### UI Components
Built with shadcn/ui providing:
- Consistent design system
- Accessible components
- Customizable with Tailwind CSS
- Located in `/src/components/ui/`

### Key Components
- `Header` - Navigation and user controls
- `AdminPage` - Comprehensive admin dashboard with tabs
- Various team and game display components

## State Management Patterns

### Server State
- TanStack Query for API data fetching and caching
- React Query DevTools enabled in development
- Automatic background refetching and error handling

### Client State
- React Context for authentication state
- Local component state for UI interactions
- Form state managed with controlled components

## Environment Configuration

### Required Environment Variables
- `NEXT_PUBLIC_API_URL` - Backend API base URL (defaults to localhost:8080)
- `NODE_ENV` - Environment setting (development/production)

### Docker Support
The project includes Docker configuration:
- `Dockerfile` for containerization
- `docker-compose.yml` for orchestration
- `Jenkinsfile` for CI/CD pipeline

## Development Guidelines

### Code Organization
- Use absolute imports with `@/` prefix for src directory
- Follow Next.js App Router conventions
- Keep components focused and composable
- Use TypeScript interfaces for type safety

### API Integration
- Always use the configured `apiClient` for API calls
- Handle errors gracefully with toast notifications
- Include proper loading states for better UX
- Use TanStack Query for data fetching when possible

### Authentication
- Never hardcode authentication tokens
- Use the `useAuth` hook for authentication state
- Implement proper error boundaries for auth failures
- Handle token expiration gracefully

## Common Patterns

### Page Structure
Most pages follow this pattern:
1. Authentication check via middleware
2. Data fetching with TanStack Query or direct API calls
3. Loading states and error handling
4. Responsive design with Tailwind CSS

### Admin Operations
Admin functionality includes:
- Team and conference management
- Season data operations
- Statistics model execution
- Toast notifications for user feedback

## Important Notes

- The application is configured for standalone Docker deployment
- Image optimization supports ESPN CDN for team logos
- Middleware provides comprehensive request/response logging
- The backend API uses Bearer token authentication
- All admin operations require proper authentication