#!/usr/bin/env node
/*
  remove_rls_policies.js
  ----------------------
  Connects to a Postgres database (Supabase) using DATABASE_URL environment
  variable. Scans for RLS policies and prints DROP POLICY statements.

  Usage:
    # Preview (safe - no changes)
    node scripts/remove_rls_policies.js

    # Execute the changes
    node scripts/remove_rls_policies.js --execute

  Requirements:
    - Set DATABASE_URL in your environment (the full Postgres connection URI from Supabase)
    - Node.js installed
    - npm install pg

  Notes:
    - This script is destructive. It will DROP policies and then DISABLE row-level
      security on affected tables when run with --execute. Use the preview first.
*/

const { Client } = require("pg");

function quoteIdent(s) {
  return '"' + String(s).replace(/"/g, '""') + '"';
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  if (!databaseUrl) {
    console.error("ERROR: DATABASE_URL (or SUPABASE_DB_URL) environment variable is required.");
    process.exit(1);
  }

  const execute = process.argv.includes("--execute");

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    // Query policies
    // pg_policies view: schemaname, tablename, policyname
    const res = await client.query(`SELECT schemaname, tablename, policyname FROM pg_policies ORDER BY schemaname, tablename`);

    if (!res.rows.length) {
      console.log("No RLS policies found in the database.");
      return;
    }

    // Group policies by table
    const byTable = new Map();
    for (const row of res.rows) {
      const key = `${row.schemaname}.${row.tablename}`;
      if (!byTable.has(key)) byTable.set(key, { schemaname: row.schemaname, tablename: row.tablename, policies: [] });
      byTable.get(key).policies.push(row.policyname);
    }

    console.log(`Found ${res.rows.length} policy(ies) on ${byTable.size} table(s):`);
    for (const [key, obj] of byTable.entries()) {
      console.log(`- ${key}: ${obj.policies.join(', ')}`);
    }

    console.log("");

    // Prepare SQL statements
    const statements = [];
    for (const [key, obj] of byTable.entries()) {
      const schema = obj.schemaname;
      const table = obj.tablename;
      for (const p of obj.policies) {
        const stmt = `DROP POLICY IF EXISTS ${quoteIdent(p)} ON ${quoteIdent(schema)}.${quoteIdent(table)};`;
        statements.push(stmt);
      }
      // After dropping policies, disable RLS on the table
      statements.push(`ALTER TABLE ${quoteIdent(schema)}.${quoteIdent(table)} DISABLE ROW LEVEL SECURITY;`);
    }

    console.log("Planned statements (preview):\n");
    for (const s of statements) console.log(s);

    if (!execute) {
      console.log("\nRun with --execute to apply these changes.");
      return;
    }

    console.log("\nExecuting statements...");
    try {
      await client.query('BEGIN');
      for (const s of statements) {
        console.log(s);
        await client.query(s);
      }
      await client.query('COMMIT');
      console.log("All statements executed successfully.");
    } catch (err) {
      await client.query('ROLLBACK');
      console.error("Error executing statements, rolled back:", err.message || err);
      process.exitCode = 2;
    }
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("Fatal error:", err.message || err);
  process.exit(1);
});
