# GitHub Copilot Instructions for Elfriedes Accommodations

This document provides guidance for GitHub Copilot when working with this repository.

## Project Overview

Elfriedes Accommodation Service is a full-stack accommodation booking platform with:
- **Backend**: Spring Boot 3.4.3 with Java 23, using Domain-Driven Design (DDD) architecture
- **Frontend**: Next.js 15.2.3 with TypeScript, React 18, and Mantine UI components
- **Purpose**: Provide accommodation booking services with festival integration, payment processing, and user management

## Repository Structure

```
/backend          # Spring Boot Java backend
  /src/main/java/com/jgmt/backend
    /accommodation  # DDD module for accommodations
    /admin         # Admin functionality
    /rating        # Rating system
    /pushNotifications
/frontend         # Next.js frontend
  /src
    /app          # Next.js App Router pages
    /components   # React components
    /lib          # Utilities and configurations
    /models       # TypeScript models
```

## Backend Guidelines (Spring Boot / Java)

### Architecture
- Follow **Domain-Driven Design (DDD)** principles with clear separation:
  - `domain/`: Entities, value objects, repositories (interfaces)
  - `application/`: Service layer with business logic
  - `infrastructure/`: Controllers, data access implementations
- Use Spring Modulith for modular monolith architecture
- Controllers should be thin and delegate to services

### Code Standards
- Use Java 23 features where appropriate
- Follow Spring Boot conventions and best practices
- Use constructor-based dependency injection (recommended over field injection)
- Properly annotate REST endpoints with OpenAPI/Swagger documentation
- Use DTOs for API requests/responses to avoid exposing entities directly
- Implement proper validation using Bean Validation (`@Valid`, `@NotNull`, etc.)

### Database
- Use JPA/Hibernate for data access
- Repository interfaces should extend Spring Data JPA repositories
- Use QueryDSL for complex queries when needed

### Testing
- Write unit tests for services using JUnit
- Use Spring Boot Test for integration tests
- Mock external dependencies appropriately
- Test security configurations with Spring Security Test

### Building & Running
- Build with: `./gradlew build`
- Run tests with: `./gradlew test`
- Run application: `./gradlew bootRun`

## Frontend Guidelines (Next.js / TypeScript / React)

### Architecture
- Use **Next.js App Router** (not Pages Router)
- Follow the `app/` directory structure
- Separate concerns:
  - `(landing)/`: Public-facing pages
  - `(admin)/`: Admin dashboard pages
  - `/components/`: Reusable React components
  - `/lib/`: Utilities, API clients, auth logic
  - `/models/`: TypeScript interfaces and types

### Code Standards
- **Always use TypeScript** - no plain JavaScript
- Use functional components with hooks
- Prefer `"use client"` directive for client components explicitly
- Use Mantine UI components consistently (already installed)
- Follow React best practices:
  - Use `useState`, `useEffect`, `useMemo`, `useCallback` appropriately
  - Extract custom hooks for reusable logic
  - Keep components focused and single-purpose

### Styling
- Primary UI library: **Mantine** (`@mantine/core`)
- Secondary styling: **Tailwind CSS** (use for utilities)
- Use Mantine's theming system for consistent design
- Icons: Use `@tabler/icons-react` from Mantine ecosystem

### Data Fetching
- Use **SWR** for data fetching (already configured)
- HTTP client: `axios` via `@/lib/httpClient`
- Follow existing patterns in the codebase for API calls

### Forms
- Use **Mantine Form** (`@mantine/form`) with Zod validation
- Already integrated: `mantine-form-zod-resolver`
- Example pattern: See `/components/upload/form.tsx`

### State Management
- Use React Context for global state when needed
- Auth state: See `@/lib/auth/use-auth`
- Prefer SWR cache for server state

### Testing
- No test framework currently configured - focus on working features
- Manual testing recommended

### Building & Running
- Development: `npm run dev` (uses Turbopack)
- Build: `npm run build`
- Lint: `npm run lint`
- Production: `npm run start`

## General Conventions

### Naming
- **Backend**: PascalCase for classes, camelCase for methods/variables
- **Frontend**: 
  - PascalCase for components/types/interfaces
  - camelCase for functions/variables
  - kebab-case for file names (except components)
  - Component files: PascalCase (e.g., `ContactDetails.tsx`)

### Git & Commits
- Write clear, descriptive commit messages
- Keep changes focused and atomic
- Test changes before committing

### API Integration
- Backend exposes OpenAPI/Swagger documentation
- Frontend uses axios HTTP client configured in `/frontend/src/lib/httpClient.ts`
- Follow REST conventions for endpoints

### Security
- Backend uses Spring Security with OAuth2 support
- Frontend handles JWT tokens via cookies (`js-cookie`)
- Never commit secrets or credentials
- Use environment variables for configuration

### Error Handling
- Backend: Use proper HTTP status codes and error responses
- Frontend: Use Mantine notifications (`@mantine/notifications`) for user feedback
- Log errors appropriately for debugging

### Code Quality
- Backend: Follow Java code conventions
- Frontend: Use ESLint configuration (`npm run lint`)
- Keep code DRY (Don't Repeat Yourself)
- Write self-documenting code with clear variable names
- Add comments only when necessary to explain "why", not "what"

## Key Features to Understand

1. **Accommodation Booking**: Multi-step booking process with contact details and payment
2. **Festival Integration**: Accommodations can be associated with festivals
3. **Payment Processing**: Supports multiple payment methods including PayPal
4. **User Management**: OAuth2 authentication with user roles (guest, owner, admin)
5. **Rating System**: Users can rate accommodations
6. **Admin Dashboard**: Separate admin interface for management
7. **Image Upload**: AWS S3 integration for accommodation images
8. **Push Notifications**: Web push notification support

## Common Patterns

### Backend Service Pattern
```java
@Service
public class SomeService {
    private final SomeRepository repository;
    
    public SomeService(SomeRepository repository) {
        this.repository = repository;
    }
    
    public SomeDto doSomething(Long id) {
        // Business logic here
    }
}
```

### Frontend Component Pattern
```tsx
"use client"
import { useState } from 'react';
import { Button, TextInput } from '@mantine/core';

export default function SomeComponent() {
    const [value, setValue] = useState('');
    
    return (
        <div>
            <TextInput 
                value={value} 
                onChange={(e) => setValue(e.target.value)} 
            />
        </div>
    );
}
```

### Frontend Data Fetching Pattern
```tsx
import useSWR from 'swr';
import httpClient from '@/lib/httpClient';

const fetcher = (url: string) => httpClient.get(url).then(res => res.data);

export function useSomeData() {
    const { data, error, isLoading } = useSWR('/api/endpoint', fetcher);
    return { data, error, isLoading };
}
```

## When Making Changes

1. **Understand the context**: Review related code before making changes
2. **Maintain consistency**: Follow existing patterns in the codebase
3. **Test thoroughly**: Manually test changes in both frontend and backend
4. **Consider the full stack**: Backend changes may require frontend updates and vice versa
5. **Document as needed**: Update comments or docs if adding complex features
6. **Security first**: Always validate input and handle authorization properly

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Mantine UI Documentation](https://mantine.dev/)
- [Spring Modulith](https://spring.io/projects/spring-modulith)

## Contact Information

For questions about accommodations, users can contact: info@elfriedes-accommodation.com
