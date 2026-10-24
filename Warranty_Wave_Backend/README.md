# WarrantyWave backend

Spring Boot REST API for the existing Angular application. It uses Java 17, Spring Boot 4.1.1, MySQL, Spring Data JPA, Flyway, and stateless JWT authentication.

## Database safety

The application targets the `WarrantyWave` database by default and applies the versioned migration in `src/main/resources/db/migration`. Hibernate is configured with `ddl-auto=validate`; it will not create, alter, or drop tables.

**Do not point this backend at an existing, non-empty schema until you have inspected it.** The related WarrantyWave repository documents an older `warrantywave` schema with a different table layout and no compatible Flyway history. Flyway rejects a non-empty schema without its history table rather than adopting it. If this is the same local database, preserve it and configure a separate, empty schema for this application, for example `WarrantyWave_local`. Do not enable Flyway baseline-on-migrate or destructive Hibernate schema settings to bypass this check.

For a new, empty database, create the schema only after checking that it does not already exist:

```sql
CREATE DATABASE WarrantyWave CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Create a dedicated MySQL user with only the application permissions needed for the schema (`SELECT`, `INSERT`, `UPDATE`, `DELETE`, `CREATE`, `ALTER`, `INDEX`, and `REFERENCES`). Do not use a database administrator account as the application user. No database command or migration against a live MySQL instance has been run as part of this implementation.

## Configuration

Copy `.env.example` to `.env` in this directory and set local values. Spring imports this file when launching from the backend directory; environment variables set in Windows or VS Code take precedence.

Required local settings:

- `DB_HOST`, `DB_PORT`, `DB_NAME`
- `DB_USERNAME`, `DB_PASSWORD`
- `JWT_SECRET`: at least 32 characters of random secret material; never commit or share it.

Optional settings:

- `SERVER_PORT` (default `8080`)
- `JWT_EXPIRATION_MS` (default `3600000`, one hour)
- `CORS_ALLOWED_ORIGINS` (comma-separated exact origins; default `http://localhost:4200`)

Windows PowerShell example (use your own local values; do not paste passwords or signing keys into source control):

```powershell
Copy-Item .env.example .env
notepad .env
```

The `.env` file is ignored by Git. The example file contains placeholders only.

## Run and test

Run these commands from this directory:

```powershell
.\mvnw.cmd test
.\mvnw.cmd spring-boot:run
```

Tests use an isolated in-memory H2 database and a test-only JWT key. They do not connect to or alter MySQL.

Run the Angular frontend in a separate PowerShell terminal:

```powershell
Set-Location 'C:\Users\Dhairya Tiwari\Desktop\Project\Warranty-Wave2\frontend'
npm ci
npm start
```

Angular runs at `http://localhost:4200` and its existing development proxy forwards `/api` and `/actuator` to `http://localhost:8080`.

## API

All payloads and responses are JSON. Protected endpoints require `Authorization: Bearer <token>`.

| Method | Path | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create a customer account; supplied role values are ignored |
| POST | `/api/auth/login` | Public | Verify credentials and return a signed JWT, email, and role |
| GET | `/api/plans` | Public | List active warranty plans |
| GET | `/api/plans/{id}` | Public | Read an active warranty plan |
| GET | `/api/vehicles` | Customer | List the authenticated customer's vehicles |
| GET | `/api/vehicles/{id}` | Customer | Read an owned vehicle |
| POST | `/api/vehicles` | Customer | Register an owned vehicle |
| GET | `/api/claims` | Customer/Admin | Return a paginated claim list; customers only see their own claims |
| POST | `/api/claims` | Customer | Submit a claim for an owned vehicle |
| PATCH | `/api/claims/{id}/status` | Admin | Change a claim status |
| GET | `/api/dashboard` | Authenticated | Return dashboard counts |
| GET | `/api/admin/stats` | Admin | Return customer, active plan, and active claim counts |
| GET | `/api/admin/users` | Admin | List account summaries without password data |
| GET | `/api/admin/plans` | Admin | List all plans, including inactive plans |
| POST | `/api/admin/plans` | Admin | Create a warranty plan |
| GET | `/actuator/health` | Public | Health status without dependency details |

Claim pages default to 20 items and are capped at 100. Registration only creates `CUSTOMER` accounts; there is no public admin-registration path or seeded administrator. To provision the first administrator, register the account normally, then have a trusted database operator verify it and promote only that account:

```sql
UPDATE users
SET role = 'ADMIN'
WHERE email = 'verified-admin@example.com' AND account_status = 'ACTIVE';
```

Confirm that exactly one row was updated. The administrator must sign in again to receive a token with the new role. Do not add an admin role to the public registration form.

## Security and integration notes

- Passwords are stored using BCrypt. Invalid login credentials return a generic 401 response.
- JWTs use HS256 and a locally configured signing key; tokens contain only the email subject and role.
- API access is stateless. Browser logout clears the Angular token; it does not revoke a token already issued, so expiration is enforced.
- CORS allows only the exact configured origins. The default is the existing Angular development origin.
- Vehicle and claim records are scoped to their owning customer. Plan and user API responses use DTOs and never serialize persistence relationships.
- The Angular registration, login, vehicles, claims, plans, dashboard, and admin API calls use the existing `/api` paths. The admin stats endpoint now supplies the claim count and service status displayed by the Angular admin page.
- Terminate HTTPS at the production ingress or reverse proxy; local HTTP is for development only.
- Finance is currently a client-side payment estimator; this frontend does not submit loan applications or require a finance API. Warranty plan selection currently links to registration and does not create a subscription.
- No live MySQL connectivity or browser-driven Angular workflow was verified in this environment. Verify the target schema and configure local credentials before starting against MySQL.
