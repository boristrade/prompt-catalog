---
name: db-migration
description: Change a database schema without losing data or breaking the running app. Use when the user adds a column, renames something, changes a type, splits a table, or asks for a migration.
---

# Changing a schema while the app is running

The old code and the new code overlap in production for at least a few
minutes, and on a rollback for much longer. Every migration must leave
both able to run.

That single constraint decides almost everything below.

## The safe shapes

**Adding a column:** nullable, or with a default. A `NOT NULL` column
with no default fails the moment old code inserts a row.

**Renaming:** never in one step. Add the new column, write to both,
backfill, switch reads, stop writing the old one, drop it later. Four
deploys, not one. A rename in a single migration breaks every running
instance of the old code at once.

**Changing a type:** the same shape as a rename. Widening (int to
bigint, varchar to text) is usually safe in place; narrowing never is.

**Dropping anything:** in a separate, later deploy from the code that
stopped using it. If the drop and the code ship together, a rollback
leaves code that expects a column that no longer exists.

## Before writing the SQL

- **How many rows?** A backfill over ten thousand rows is a statement;
  over ten million it is a batched job with a limit and a sleep, or it
  holds a lock long enough to take the site down.
- **Which indexes?** Adding an index locks the table unless created
  concurrently. Check whether your database supports it and use it.
- **What is the default?** A default on a large existing table can mean
  a full rewrite depending on the version.

## Always write the down migration

Write it, and read it. If it cannot restore the data — a dropped column
usually cannot — say so in the migration file itself, so the person at
3am knows the rollback is one-way before they run it.

## Verify

Run it against a copy of production data, not an empty local database.
An empty database proves the syntax parses and nothing else: the
problems are duplicate values that block a new unique constraint, nulls
in a column about to become required, and rows that violate the new
check.

Then count rows before and after, and say the two numbers.
