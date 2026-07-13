# RDS Proxy Migration Guide

**Version:** 1.0\
**Audience:** Developers, DevOps Engineers, Cloud Engineers, Architects

## Objective

Migrate existing applications from direct Amazon RDS connectivity to
Amazon RDS Proxy with **zero downtime** while improving scalability,
connection management, and failover.

------------------------------------------------------------------------

# 1. Overview

## Current Architecture

``` text
Application(s)
      |
      v
 Amazon RDS
```

Applications connect directly to Amazon RDS.

### Challenges

-   Large number of database connections
-   Connection storms during application scaling
-   Slower database failover
-   Higher database CPU and memory usage
-   Poor connection reuse

------------------------------------------------------------------------

# 2. Target Architecture

``` text
Application(s)
      |
      v
 Amazon RDS Proxy
      |
      v
 Amazon RDS
```

Applications connect only to the RDS Proxy endpoint.

------------------------------------------------------------------------

# 3. Benefits

-   Zero application code changes
-   Only the database endpoint changes
-   Connection pooling
-   Connection multiplexing
-   Faster failover
-   Better scalability
-   Improved database stability
-   Reduced database resource consumption

------------------------------------------------------------------------

# 4. Application Configuration Change

## Before

``` properties
DB_HOST=mydb.xxxxxx.rds.amazonaws.com
DB_PORT=3306
DB_NAME=appdb
USERNAME=appuser
PASSWORD=******
```

## After

``` properties
DB_HOST=myproxy.proxy-xxxxx.rds.amazonaws.com
DB_PORT=3306
DB_NAME=appdb
USERNAME=appuser
PASSWORD=******
```

Only **DB_HOST** changes.

------------------------------------------------------------------------

# 5. How It Works

1.  Application requests a database connection.
2.  RDS Proxy checks for an available pooled connection.
3.  If available, it reuses the connection.
4.  Otherwise, it opens a new backend connection to RDS.
5.  After the query completes, the backend connection is returned to the
    pool.

------------------------------------------------------------------------

# 6. Deployment Checklist

## Pre-Deployment

-   Review RDS health
-   Verify Multi-AZ configuration
-   Take a database snapshot
-   Verify Secrets Manager credentials
-   Review Security Groups
-   Confirm DB endpoint is configurable

## Infrastructure

-   Create RDS Proxy
-   Configure IAM Role
-   Configure Secrets Manager
-   Register RDS Target
-   Configure proxy settings
-   Update Security Groups

## Validation

-   Proxy status is Available
-   Target status is Healthy
-   Test login
-   Test read operations
-   Test write operations
-   Verify transactions
-   Validate application connectivity

## Production Rollout

1.  Deploy one application instance.
2.  Monitor logs and metrics.
3.  Deploy remaining instances using rolling deployment.
4.  Confirm all applications use the proxy endpoint.

------------------------------------------------------------------------

# 7. Rollback

If an issue occurs:

1.  Stop deployment.
2.  Change DB_HOST back to the original RDS endpoint.
3.  Redeploy affected applications.
4.  Validate connectivity.
5.  Investigate and retry later.

------------------------------------------------------------------------

# 8. Failure Handling

## Proxy Creation Failure

-   Verify IAM permissions
-   Verify Secrets Manager configuration
-   Delete and recreate the proxy if required

## Authentication Failure

-   Validate credentials
-   Verify IAM authentication (if used)

## Application Cannot Connect

Check:

-   Security Groups
-   VPC/Subnets
-   Proxy endpoint
-   DNS resolution
-   Port configuration

## Database Overload

Review:

-   MaxConnectionsPercent
-   Slow queries
-   Missing indexes
-   Long-running transactions

------------------------------------------------------------------------

# 9. Monitoring

Monitor:

-   DatabaseConnections
-   ClientConnections
-   ConnectionBorrowLatency
-   Database CPU
-   Memory
-   Slow Queries
-   Error Rates
-   Application Response Time

------------------------------------------------------------------------

# 10. Best Practices

-   Use rolling or blue/green deployment.
-   Keep the endpoint configurable.
-   Let RDS Proxy manage connection pooling.
-   Monitor CloudWatch metrics after deployment.
-   Test failover before production rollout.
-   Document rollback procedures.

------------------------------------------------------------------------

# 11. Production Deployment Flow

``` text
Review Infrastructure
        |
        v
Take Database Snapshot
        |
        v
Create RDS Proxy
        |
        v
Configure IAM & Secrets
        |
        v
Register RDS Target
        |
        v
Update Security Groups
        |
        v
Validate Proxy
        |
        v
Deploy One Instance
        |
        v
Monitor
        |
        v
Rolling Deployment
        |
        v
All Applications Use RDS Proxy
```

------------------------------------------------------------------------

# 12. FAQs

**Does application code change?**

No. Only the database endpoint changes.

**Does JDBC URL change?**

Yes. Replace the RDS hostname with the RDS Proxy hostname.

**Does the port change?**

No. It remains the same (typically 3306 for MySQL or 5432 for
PostgreSQL).

**Does RDS Proxy auto-scale?**

Yes. AWS automatically manages proxy capacity.

**Can applications still connect directly to RDS?**

Yes, but production applications should use the proxy endpoint to
benefit from pooling and failover.
