# Docker Deployment Guide

## Overview
This document provides instructions for deploying the AI Timetable Generation System using Docker containers.

## Prerequisites
- Docker Engine (v20.10+)
- Docker Compose (v2.0+)
- At least 2GB RAM available
- Ports 3000, 5432, and 8080 available

## Quick Start

### 1. Environment Setup
```bash
# Copy the environment template
cp .env.example .env

# Edit the environment variables as needed
# The default values should work for development
```

### 2. Build and Run
```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

### 3. Access the Application
- **Main Application**: http://localhost:3000
- **Database Admin (PgAdmin)**: http://localhost:8080
  - Email: admin@nexus.local
  - Password: admin123

## Services

### Frontend (Next.js)
- **Container**: `timetable-frontend`
- **Port**: 3000
- **Build Context**: Current directory
- **Dependencies**: PostgreSQL database

### Database (PostgreSQL)
- **Container**: `timetable-db`
- **Port**: 5432
- **Volume**: `postgres_data` (persistent storage)
- **Init Scripts**: `/scripts/*.sql` files are automatically executed

### Database Admin (PgAdmin)
- **Container**: `pgadmin`
- **Port**: 8080
- **Volume**: `pgadmin_data` (persistent storage)

## Development vs Production

### Development Mode
```bash
# Start only the database for local development
docker-compose up db

# Run Next.js locally
npm run dev
```

### Production Mode
```bash
# Build and deploy all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Scale the frontend if needed
docker-compose up --scale timetable-frontend=2
```

## Database Management

### Initial Setup
The database is automatically initialized with:
- Tables from `scripts/01-create-tables.sql`
- Time slots from `scripts/02-seed-time-slots.sql`
- Sample data from `scripts/03-seed-sample-data.sql`

### Backup and Restore
```bash
# Backup database
docker-compose exec timetable-db pg_dump -U nexus_user nexus_timetable > backup.sql

# Restore database
docker-compose exec -T timetable-db psql -U nexus_user nexus_timetable < backup.sql
```

## Troubleshooting

### Common Issues

#### Port Conflicts
If ports are already in use, modify `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Change external port
```

#### Database Connection Issues
Check the database is running:
```bash
docker-compose logs timetable-db
```

#### Build Failures
Clean and rebuild:
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### Logs and Debugging
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs timetable-frontend
docker-compose logs timetable-db

# Follow logs in real-time
docker-compose logs -f
```

## Production Deployment

### Environment Variables
For production, update `.env` with:
- Strong database passwords
- Secure authentication secrets
- Production API URLs
- SSL certificates (if using HTTPS)

### Performance Optimization
- Use Docker multi-stage builds (already configured)
- Enable Next.js standalone output
- Configure reverse proxy (Nginx/Traefik)
- Set up health checks
- Configure log rotation

### Security Considerations
- Change default passwords
- Use secrets management
- Enable container security scanning
- Configure firewall rules
- Regular security updates

## Maintenance

### Updates
```bash
# Pull latest images
docker-compose pull

# Rebuild and restart
docker-compose up --build -d
```

### Cleanup
```bash
# Stop and remove containers
docker-compose down

# Remove volumes (WARNING: Data loss)
docker-compose down -v

# Clean up unused images
docker image prune -a
```