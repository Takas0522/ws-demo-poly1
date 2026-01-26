# Frontend Service (BFF)

Frontend service for ws-demo-poly1 project.

## Overview

This service serves as a Backend For Frontend (BFF) that integrates various backend service functionalities and provides users with a single web interface.

### Key Responsibilities

- Provide unified UI
- Aggregate requests to backend services
- Session management
- Client-side authentication state management

## Tech Stack

- **Framework**: Next.js 16.1.4 (App Router)
- **UI Library**: React 19.2.3
- **Language**: TypeScript 5.x
- **Styling**: TailwindCSS 4.x
- **Linting**: ESLint 9.x
- **Formatting**: Prettier

## Prerequisites

- Node.js 18+ (Tested with Node.js 20.x)
- npm 10+

## Installation

```bash
# Navigate to the frontend directory
cd src/front

# Install dependencies
npm install
```

## Configuration

Create `.env.local` file based on `.env.local.example`:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` to configure the backend service endpoints:

```bash
# Backend API endpoints
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:8001
NEXT_PUBLIC_USER_MANAGEMENT_SERVICE_URL=http://localhost:8002
NEXT_PUBLIC_SERVICE_SETTING_SERVICE_URL=http://localhost:8004

# App configuration
NEXT_PUBLIC_APP_NAME=Management Application
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## Running the Service

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Mode

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
src/front/
├── app/                    # Next.js app directory (App Router)
│   ├── (auth)/            # Authentication routes (route group)
│   │   ├── login/         # Login page
│   │   └── logout/        # Logout handler
│   ├── dashboard/         # Dashboard page
│   ├── tenants/           # Tenant management pages
│   ├── users/             # User management pages
│   ├── services/          # Service setting pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── common/           # Common UI components
│   ├── layouts/          # Layout components
│   └── features/         # Feature-specific components
├── lib/                  # Utility functions and API clients
│   ├── api/             # API client functions
│   ├── auth/            # Authentication utilities
│   └── utils/           # Helper functions
├── public/              # Static assets
├── styles/              # Additional styles
├── .env.local.example   # Environment variables template
├── .prettierrc          # Prettier configuration
├── eslint.config.mjs    # ESLint configuration
├── next.config.ts       # Next.js configuration
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.ts   # Tailwind CSS configuration
└── package.json         # Project dependencies
```

## Development

### Linting

```bash
# Run ESLint
npm run lint

# Fix linting issues automatically
npm run lint:fix
```

### Formatting

```bash
# Format code with Prettier
npm run format

# Check formatting without making changes
npm run format:check
```

### Building

```bash
# Create optimized production build
npm run build
```

## Access Control

**IMPORTANT**: Only users belonging to **privileged tenants** can log in to this application.

## API Integration

This frontend communicates with the following backend services:

### Auth Service (Port 8001)
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Token verification
- `POST /api/auth/refresh` - Token refresh

### User Management Service (Port 8002)
- `GET /api/tenants` - List tenants
- `POST /api/tenants` - Create tenant
- `GET /api/tenants/{tenantId}/users` - List tenant users
- `POST /api/tenants/{tenantId}/users` - Add user to tenant

### Service Setting Service (Port 8004)
- `GET /api/services` - List available services
- `GET /api/tenants/{tenantId}/services` - Get tenant services
- `POST /api/tenants/{tenantId}/services` - Assign service to tenant

## Related Documentation

- [Service Specification](../../docs/services/frontend/spec.md)
- [API Guidelines](../../docs/architecture/api-guidelines.md)
- [Authentication Flow](../../docs/architecture/authentication-flow.md)
- [Database Design](../../docs/architecture/database-design.md)

## Related Services

- **Auth Service** (ws-demo-poly3) - Provides authentication and authorization
- **User Management Service** (ws-demo-poly2) - Manages tenants and tenant users
- **Service Setting Service** (ws-demo-poly4) - Manages service assignments to tenants

## Next Steps

See issue [#2 Login Screen](https://github.com/Takas0522/ws-demo-poly1/issues/2) for implementing the login functionality.

## License

This project is part of the ws-demo-poly workspace.
