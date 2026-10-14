# Warranty Wave

Warranty Wave uses Angular 21 and Spring Boot 3.3 / Java 17. The backend persists accounts, vehicles, warranty plans, and claims in MySQL 8. Flyway applies versioned schema migrations at startup; Hibernate validates the resulting schema.

## Prerequisites

- Java 17 and Maven 3.9+ (or `backend/mvnw` if a Maven wrapper is added)
- Node.js compatible with Angular 21 and npm
- MySQL 8.0.16+ (the Compose setup uses MySQL 8.4)
- A strong JWT signing secret of at least 32 characters

## Database setup

For a new MySQL server, connect as a database administrator and run these commands after replacing the two password placeholders with separate strong values:

```sql
CREATE DATABASE warrantywave CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER 'warrantywave_app'@'localhost' IDENTIFIED BY '<replace-with-strong-app-password>';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, REFERENCES ON warrantywave.* TO 'warrantywave_app'@'localhost';
FLUSH PRIVILEGES;
```

The app user needs schema privileges because Flyway creates and updates the schema on startup. For a remote database, create the MySQL account with a host restriction matching the backend host, rather than `%` where possible. Do not run the SQL migrations manually; Flyway records and applies them in order.

There is deliberately no seeded administrator or password. Register the intended administrator through the normal registration flow, verify the email/account out of band, then have a database operator promote that exact account:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'verified-admin@example.com';
```

Confirm exactly one row was changed before proceeding. Do not expose this database privilege to the public application account or use this procedure without an approved identity check.

Migrations:

- `backend/src/main/resources/db/migration/V1__initial_schema.sql`: users, vehicles, warranty plans.
- `backend/src/main/resources/db/migration/V2__claims.sql`: persisted claims and their foreign keys/indexes.

To migrate an existing database, first take a backup and inspect its tables. If it was created by this app with Flyway, point the backend at it and Flyway will apply pending versions. If equivalent tables exist without `flyway_schema_history`, reconcile and baseline the database with an operator-reviewed Flyway baseline before starting the app; do not drop or recreate those tables. Check for duplicate legacy data before adding constraints in future migrations.

## Environment variables

Copy `.env.example` to `.env` for Docker Compose and replace every placeholder. Compose reads `.env` automatically. For running the backend directly in PowerShell, set the backend variables in that terminal session:

```powershell
$env:DB_URL = 'jdbc:mysql://localhost:3306/warrantywave?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC'
$env:DB_USERNAME = 'warrantywave_app'
$env:DB_PASSWORD = '<your-app-database-password>'
$env:JWT_SECRET = '<at-least-32-random-characters>'
$env:SERVER_PORT = '8080'
$env:CORS_ALLOWED_ORIGINS = 'http://localhost:4200,http://127.0.0.1:4200'
```

When launched from the `backend` directory, Spring Boot also reads the root `.env` file and uses `MYSQL_DATABASE`, `MYSQL_USER`, and `MYSQL_PASSWORD` as local defaults. Explicit `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` environment variables take precedence.

Backend settings also support `DB_POOL_MAX_SIZE` (10), `DB_POOL_MIN_IDLE` (2), `DB_CONNECTION_TIMEOUT_MS` (30000), `DB_VALIDATION_TIMEOUT_MS` (5000), and `JWT_EXPIRATION_MS` (86400000). Never put database credentials or JWT secrets in frontend files. Do not commit `.env`.

## Run locally in VS Code on Windows

1. Start MySQL and execute the database/user SQL above. If using Docker Desktop instead, from the repository root run `Copy-Item .env.example .env`, edit `.env`, then `docker compose up -d mysql`.
2. Open a backend PowerShell terminal, set the variables above, then run:

   ```powershell
   cd backend
   mvn spring-boot:run
   ```

   Flyway creates the tables on the first start. No sample administrator or customer is created. Register a customer through the UI/API; create administrator accounts through an approved, operator-controlled process.
3. Open a frontend PowerShell terminal and run:

   ```powershell
   cd frontend
   npm ci
   npm start
   ```

   Angular serves on `http://localhost:4200` and proxies `/api` and `/actuator` to the backend at port 8080. For a deployed frontend, route those paths through the deployment's HTTPS reverse proxy to the backend.

## Run with Docker Compose

```powershell
Copy-Item .env.example .env
# Edit .env and replace all placeholder secrets before starting.
docker compose up --build -d
docker compose logs -f backend
```

The MySQL data lives in the named `warrantywave_mysql` volume. `docker compose down` preserves it. `docker compose down -v` permanently deletes that volume and all database records; only do this when intentionally resetting disposable data. Production deployments should use managed secret storage, TLS, restricted network access, backups, and database accounts scoped to the application.

## APIs to exercise

- `GET /actuator/health` — application and database health components.
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`.
- `GET /api/plans`, `GET /api/plans/{id}`.
- Authenticated customer: `GET /api/vehicles`, `POST /api/vehicles`, `GET /api/vehicles/{id}`.
- Authenticated user: `GET /api/dashboard` (database-backed customer, plan, and active claim counts).
- Customer claims: `GET /api/claims?page=0&size=20`, `POST /api/claims` with `{ "vehicleId": 1, "issueDescription": "...", "estimatedCost": 125.50 }`.
- Admin/adjuster: `PATCH /api/claims/{id}/status` with `{ "status": "UNDER_REVIEW" }`.
- Admin: `GET /api/admin/users`, `GET /api/admin/plans`, `POST /api/admin/plans`, `GET /api/admin/stats`.

Claims are scoped to the authenticated customer. Admin and adjuster roles can review all claims and change claim status. Public registration always creates a customer account.

## Verification

Backend tests use an isolated H2 test profile; normal application runs use MySQL. Run:

```powershell
cd backend
mvn test
cd ..\frontend
npm test
npm run build
```

These commands do not verify connectivity to a separately installed MySQL server; check `/actuator/health` with the configured MySQL service for that.

## Troubleshooting

- `Communications link failure`: check MySQL is running, port 3306 is reachable, and `DB_URL` points at the correct hostname (`mysql` inside Compose, `localhost` for a local backend).
- Access denied: verify the app user/password and its database-scoped grants.
- JWT startup error: set `JWT_SECRET` to at least 32 characters; use a stable secret so existing tokens remain valid across restarts.
- CORS errors: set `CORS_ALLOWED_ORIGINS` to the exact trusted frontend origin(s), comma separated.
- Migration failure on an existing schema: stop the backend, back up the data, inspect `flyway_schema_history` and migration state, and reconcile the schema before restarting. Never fix this by dropping production tables.
