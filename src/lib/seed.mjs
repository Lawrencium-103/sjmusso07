import crypto from "crypto";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is required");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;
const DEFAULT_PASSWORD = "Abc123";
const DEFAULT_QUESTION = "What is your mother's maiden name?";

function hashPassword(password) {
  const salt = crypto.randomBytes(SALT_LENGTH).toString("hex");
  const hash = crypto
    .scryptSync(password, salt, KEY_LENGTH, { N: 16384, r: 8, p: 1 })
    .toString("hex");
  return `${salt}:${hash}`;
}

const hash = hashPassword(DEFAULT_PASSWORD);

const alumni = await sql`SELECT id, name, email FROM alumni`;

for (const row of alumni) {
  const defaultAnswer = row.name.split(" ")[0].toLowerCase();
  await sql`
    UPDATE alumni
    SET password_hash = ${hash}, must_change_password = 1, security_question = ${DEFAULT_QUESTION}, security_answer = ${defaultAnswer}
    WHERE id = ${row.id}
  `;
}

console.log(`Seeded ${alumni.length} alumni with default password.`);
process.exit(0);
