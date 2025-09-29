# PostgreSQL Setup Guide for Nexus Timetable System

## Prerequisites
- PostgreSQL installed and running
- Access to PostgreSQL command line or a GUI tool like pgAdmin

## Step 1: Create Database User
Connect to PostgreSQL as superuser and create the application user:

```sql
-- Connect as postgres superuser
psql -U postgres

-- Create user for the application
CREATE USER timetable_admin WITH PASSWORD 'postgres';

-- Grant necessary privileges
ALTER USER timetable_admin CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE postgres TO timetable_admin;
```

## Step 2: Create Database
```sql
-- Create the database
CREATE DATABASE timetable_db OWNER timetable_admin;

-- Grant all privileges on the database
GRANT ALL PRIVILEGES ON DATABASE timetable_db TO timetable_admin;

-- Connect to the new database
\c timetable_db

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO timetable_admin;
GRANT ALL ON ALL TABLES IN SCHEMA public TO timetable_admin;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO timetable_admin;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO timetable_admin;

-- Exit psql
\q
```

## Step 3: Verify Connection
Test the connection with the new credentials:

```bash
psql -U timetable_admin -d timetable_db -h localhost -p 5432
```

You should be able to connect without errors.

## Step 4: Alternative - Command Line Setup
If you prefer command line:

```bash
# Create user
createuser -U postgres -P timetable_admin

# Create database
createdb -U postgres -O timetable_admin timetable_db

# Test connection
psql -U timetable_admin -d timetable_db -h localhost
```

## Step 5: Update Next.js Configuration

Your `.env` file should contain:
```bash
DATABASE_URL="postgresql://timetable_admin:postgres@localhost:5432/timetable_db"
```

## Step 6: Initialize Database Schema

Once PostgreSQL is set up, run:

```bash
# Generate Prisma client
npm run db:generate

# Create and apply migrations
npm run db:migrate

# Seed with sample data
npm run db:seed
```

## Connection Parameters Explained

- **Host**: `localhost` - PostgreSQL server location
- **Port**: `5432` - Default PostgreSQL port
- **Database**: `timetable_db` - Our application database
- **User**: `timetable_admin` - Application database user
- **Password**: `postgres` - User password

## Troubleshooting

### Connection Refused
- Ensure PostgreSQL service is running
- Check if PostgreSQL is listening on port 5432: `netstat -an | grep 5432`
- Verify `pg_hba.conf` allows local connections

### Authentication Failed
- Double-check username and password
- Ensure user exists: `psql -U postgres -c "\du"`
- Verify user has database privileges

### Database Does Not Exist
- Create database: `createdb -U postgres timetable_db`
- Or use SQL: `CREATE DATABASE timetable_db;`

## Test API Endpoints

After setup, test these endpoints:

1. **Health Check**: http://localhost:3000/api/health
2. **Database Test**: http://localhost:3000/api/users  
3. **Database Status**: http://localhost:3000/api/test-db

Success response from `/api/users`:
```json
[
  {
    "now": "2025-09-28T10:30:45.123Z"
  }
]
```

## Docker Setup (Alternative)

If you prefer Docker:

```bash
# Start PostgreSQL with Docker
docker-compose up timetable-db -d

# Run migrations
npm run db:migrate

# Start the application
npm run dev
```

This will create PostgreSQL in a container with the correct configuration.