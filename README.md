# NextFij - DeepFij Basketball Analytics

NextFij is a Next.js 15 application for college basketball statistical analysis called "DeepFij". It's a modern web application built with React 19, TypeScript, and Tailwind CSS that provides basketball statistics, team information, and administrative tools for managing basketball data.

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Runtime**: React 19 with modern features
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **State Management**: TanStack Query for server state, React Context for auth
- **HTTP Client**: Axios with interceptors for API communication
- **Authentication**: JWT tokens stored in cookies with middleware protection
- **Data Visualization**: D3.js for statistical charts and graphs

## Getting Started

### Local Development

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Docker Deployment

### Prerequisites

- Docker and Docker Compose installed
- Domain name configured (for production SSL)
- Required Docker images: `nextfij:latest`, `aifij:latest`, `pystats:latest`

### Environment Setup

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Edit `.env` with your configuration:
```bash
# Required environment variables
DOMAIN_NAME=yourdomain.com
LETSENCRYPT_EMAIL=admin@yourdomain.com
JWT_SECRET=your-secure-jwt-secret-key-minimum-32-characters-long
ADMIN_PASSWORD=your-secure-admin-password
DB_PASSWORD=your-secure-database-password
```

### Test/Development Mode

Uses Let's Encrypt staging certificates (recommended for testing):

```bash
# Build the Next.js image
docker build -t nextfij:latest .

# Start all services in test mode
docker-compose up -d

# View logs
docker-compose logs -f

# Check service health
docker-compose ps

# Stop services
docker-compose down
```

### Production Mode

Uses real Let's Encrypt certificates with automatic renewal:

```bash
# Ensure .env has production values with real domain
# Make sure DOMAIN_NAME and LETSENCRYPT_EMAIL are correctly set

# Start in production mode
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f

# Check service health
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps

# Stop services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
```

### Services

The Docker Compose setup includes:

- **nginx**: Reverse proxy with SSL termination (ports 80/443)
- **certbot**: Let's Encrypt SSL certificate management
- **uberui**: Next.js frontend application (nextfij:latest)
- **deepfij**: Spring Boot backend API (aifij:latest) 
- **deepfij-stats**: Python statistics service (pystats:latest)
- **db**: PostgreSQL database with initialization script

### Key Differences

- **Test Mode**: Uses `--staging` flag for Let's Encrypt (relaxed rate limits)
- **Production Mode**: Uses real Let's Encrypt certificates + automatic renewal service

### Health Checks

All services include health checks with automatic restart policies. Monitor service status with:

```bash
docker-compose ps
docker-compose logs [service-name]
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
