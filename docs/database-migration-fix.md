# Warranty Wave database migration diagnosis

## Cause

The `warrantywave` database was non-empty and had no `flyway_schema_history`, so Flyway correctly refused to guess which migrations had already run. Read-only inspection connected to MySQL 8.0.46, confirmed the history table is absent, and counted zero rows in all nine existing tables.

The existing schema is not the schema represented by this checkout. It has `app_user`, `finance_application`, `finance_contract`, `rate_config`, `repayment_schedule`, `vehicle`, `warranty_claim`, `warranty_plan`, and `warranty_policy`, with audit/version columns and different fields (for example, `app_user.name` instead of `users.first_name`/`last_name`, `vehicle.make`/`model_year` instead of `vehicles.manufacturer`/`manufacture_year`, and `warranty_plan.duration_months` instead of `warranty_plans.coverage_duration_months`). The Java entities and migrations instead target `users`, `vehicles`, `warranty_plans`, and `claims`; this checkout has no finance entities or mappings. Neither Hibernate validation nor recording V1/V2 as already applied would make these schemas compatible.

## Safe strategy

- Leave the existing `warrantywave` schema and its tables unchanged. No baseline or DDL was run against it.
- Preserve Flyway's default behavior: it remains enabled and refuses to migrate an untracked, non-empty schema.
- For this version of the application, use a separate, empty `warrantywave_local` schema. The opt-in Spring profile `fresh-local` targets that schema by default; V1 and V2 create the schema for this checkout, and subsequent starts use Flyway history normally.
- Before first use, an operator must create `warrantywave_local` and grant the app account privileges there. The exact SQL and PowerShell commands are in the root README. This database change was not performed as part of the code fix.
- Do not baseline or point this application at the existing `warrantywave` schema. If that older application needs its own migrations, recover and maintain migrations for that implementation separately. A future data transfer into this application's schema needs a reviewed mapping and backup; no automatic conversion is safe to infer.

`spring.jpa.hibernate.ddl-auto=validate` remains enabled. No migration was changed, no table was dropped or renamed, and no existing data was modified.
