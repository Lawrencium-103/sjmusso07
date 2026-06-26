import crypto from "crypto";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is required");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function tableExists(tableName) {
  const result = await sql`
    SELECT tablename FROM pg_catalog.pg_tables
    WHERE schemaname = 'public' AND tablename = ${tableName}
  `;
  return result.length > 0;
}

// ─── CREATE TABLES ───
if (!(await tableExists("alumni"))) {
  console.log("Creating tables...");
  await sql`
    CREATE TABLE alumni (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone_no TEXT,
      gender TEXT,
      location TEXT,
      occupation TEXT,
      role TEXT DEFAULT 'user',
      created_at TIMESTAMP DEFAULT NOW(),
      password_hash TEXT,
      must_change_password INTEGER DEFAULT 1,
      security_question TEXT,
      security_answer TEXT
    )
  `;
  await sql`
    CREATE TABLE meetings (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      meeting_date TIMESTAMP NOT NULL,
      created_by INTEGER,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE attendance (
      id SERIAL PRIMARY KEY,
      meeting_id INTEGER NOT NULL,
      alumni_id INTEGER NOT NULL,
      attended INTEGER DEFAULT 0
    )
  `;
  await sql`
    CREATE TABLE payments (
      id SERIAL PRIMARY KEY,
      alumni_id INTEGER NOT NULL,
      year INTEGER NOT NULL,
      month INTEGER NOT NULL,
      paid INTEGER DEFAULT 0,
      confirmed INTEGER DEFAULT 0,
      confirmed_by INTEGER
    )
  `;
  await sql`
    CREATE TABLE news_updates (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_by INTEGER,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE positions (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT
    )
  `;
  await sql`
    CREATE TABLE aspirants (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      position_id INTEGER NOT NULL,
      cleared INTEGER DEFAULT 0
    )
  `;
  await sql`
    CREATE TABLE votes (
      id SERIAL PRIMARY KEY,
      alumni_id INTEGER NOT NULL,
      aspirant_id INTEGER NOT NULL,
      position_id INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE sessions (
      id SERIAL PRIMARY KEY,
      alumni_id INTEGER NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMP NOT NULL
    )
  `;
  await sql`
    CREATE TABLE settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `;
  console.log("Tables created.");
} else {
  console.log("Tables already exist.");
}

// Get all alumni
const alumni = await sql`SELECT id, name FROM alumni`;
const adminUser = alumni.find(a => a.role === "super_admin");

if (!alumni.length) {
  console.log("No alumni found. Run the main seed first.");
  process.exit(1);
}

console.log(`Found ${alumni.length} alumni.`);

// ─── NEWS ITEMS ───
const newsCount = await sql`SELECT COUNT(*) as c FROM news_updates`;
if (newsCount[0].c < 3) {
  console.log("Seeding news items...");
  const newsItems = [
    { title: "Alumni Reunion 2026 — Save the Date!", content: "The SJMUSSO Class of 2007 Alumni Association is pleased to announce the 2026 Annual Reunion. The event will hold on Saturday, August 15, 2026, at Saint John/Mary's Unity Secondary School, Owo. All alumni are encouraged to attend and reconnect with old classmates. Further details including the program of activities will be communicated soon." },
    { title: "Election 2026 — Nominations Open", content: "Nominations for the 7 executive positions are now open. Campaign period runs until June 26. Voting is June 27-28." },
    { title: "Welcome to the Alumni Platform", content: "We are excited to launch this platform for the SJMUSSO Class of 2007. Stay tuned for updates on the upcoming reunion and elections." },
    { title: "Constitutional Review Committee Concludes Work", content: "The ad-hoc committee tasked with reviewing the alumni association's constitution has submitted its final report. Key amendments include clearer guidelines for executive elections, financial transparency protocols, and the establishment of a welfare fund for members. A copy of the reviewed constitution will be made available to all members ahead of the upcoming general meeting." },
    { title: "Class Project: Library Rehabilitation Drive", content: "The alumni association has adopted the rehabilitation of the school library as its flagship project for 2026. An initial fundraising target of ₦500,000 has been set, with contributions already exceeding ₦180,000. All members are encouraged to contribute through the monthly contribution scheme or make special donations. Let us give back to the school that shaped us." },
    { title: "Alumni Spotlight: Mrs. Babalola Sunmisola Ayotola", content: "We are proud to spotlight one of our own, Mrs. Babalola Sunmisola Ayotola, who has distinguished herself in the field of education. Sunmisola recently completed her Master's degree in Educational Management from the University of Ibadan and currently serves as a senior educator at a leading secondary school in Lagos. Her dedication to academic excellence embodies the SJMUSSO spirit of 'To Know, To Love, To Serve.'" },
    { title: "Membership Drive: 42 Alumni Registered and Counting", content: "We are thrilled to announce that all 42 members of the graduating Class of 2007 have now been registered on the alumni platform. This milestone marks a significant achievement in our goal of fostering a united and active alumni community. Reach out to classmates who may not yet be active on the platform and encourage them to log in and participate." },
    { title: "Welfare Committee: Support for Members in Need", content: "The Welfare Committee, in collaboration with the executive council, has launched a support initiative to assist alumni facing medical or financial challenges. Members are encouraged to reach out to the Welfare Director or any executive council member if they require assistance. The committee is also organizing a fundraising drive to bolster the welfare fund." },
    { title: "Year-End Celebration and Awards Ceremony", content: "Plans are underway for the SJMUSSO '07 Year-End Celebration and Awards Ceremony, scheduled for December 2026. The event will recognize outstanding contributions by members to the association and the wider community. Categories include 'Alumni of the Year', 'Most Active Member', and 'Community Service Award'. Nominations will open in October." },
  ];

  const timeOffsets = ["-30 days", "-14 days", "-7 days", "-5 days", "-3 days", "-1 days", "+0 hours", "+2 hours", "+6 hours"];

  for (let i = 0; i < newsItems.length; i++) {
    const existing = await sql`SELECT id FROM news_updates WHERE title = ${newsItems[i].title}`;
    if (!existing.length) {
      await sql`
        INSERT INTO news_updates (title, content, created_by, created_at)
        VALUES (${newsItems[i].title}, ${newsItems[i].content}, ${adminUser?.id || alumni[0].id}, NOW() + INTERVAL ${timeOffsets[i % timeOffsets.length]})
      `;
      console.log(`  Added: ${newsItems[i].title}`);
    }
  }
} else {
  console.log("News already seeded. Skipping.");
}

// ─── MEETINGS ───
const meetingCount = await sql`SELECT COUNT(*) as c FROM meetings`;
if (meetingCount[0].c < 2) {
  console.log("Seeding meetings...");
  const meetingsData = [
    { title: "Constitutional Drafting Session", description: "Working session to draft the alumni association constitution, covering membership criteria, executive roles, and operational guidelines.", date: "2026-01-25", offset: "-150 days" },
    { title: "Annual General Meeting", description: "First annual general meeting of the SJMUSSO '07 Alumni Association. Agenda includes election planning, financial review, and project discussions.", date: "2026-03-10", offset: "-104 days" },
    { title: "Planning Committee Meeting", description: "Meeting of the reunion and election planning committees to finalize logistics, budget, and timeline for the 2026 events.", date: "2026-05-15", offset: "-38 days" },
    { title: "First Reunion Meeting", description: "Quarterly general meeting for the Class of 2007 alumni association.", date: "2026-06-20", offset: "-2 days" },
    { title: "Post-Election Handover Ceremony", description: "Official handover ceremony from the electoral committee to the newly elected executive council. All alumni are expected to attend.", date: "2026-07-18", offset: "+26 days" },
  ];

  for (const m of meetingsData) {
    const existing = await sql`SELECT id FROM meetings WHERE title = ${m.title}`;
    if (!existing.length) {
      await sql`
        INSERT INTO meetings (title, description, meeting_date, created_by, created_at)
        VALUES (${m.title}, ${m.description}, ${m.date}, ${adminUser?.id || alumni[0].id}, NOW() + INTERVAL ${m.offset})
      `;
      console.log(`  Added meeting: ${m.title}`);
    }
  }

  // Now fix attendance for all meetings
  console.log("  Fixing attendance records...");
  const allMeetings = await sql`SELECT id FROM meetings`;

  for (const meeting of allMeetings) {
    for (const a of alumni) {
      const existing = await sql`SELECT id FROM attendance WHERE meeting_id = ${meeting.id} AND alumni_id = ${a.id}`;
      if (!existing.length) {
        const attended = Math.random() < 0.7 ? 1 : 0;
        await sql`INSERT INTO attendance (meeting_id, alumni_id, attended) VALUES (${meeting.id}, ${a.id}, ${attended})`;
      }
    }
  }

  // Make the admins and super_admin always present
  const adminAlumni = await sql`SELECT id FROM alumni WHERE role IN ('admin', 'super_admin')`;
  for (const meeting of allMeetings) {
    for (const a of adminAlumni) {
      await sql`UPDATE attendance SET attended = 1 WHERE meeting_id = ${meeting.id} AND alumni_id = ${a.id}`;
    }
  }

  const totalAttendance = await sql`SELECT COUNT(*) as c FROM attendance`;
  console.log(`  Total attendance records: ${totalAttendance[0].c}`);
} else {
  console.log("Meetings already seeded. Skipping.");
}

// ─── PAYMENTS ───
const paymentCount = await sql`SELECT COUNT(*) as c FROM payments`;
if (paymentCount[0].c === 0) {
  console.log("Seeding payments for 2026...");

  const patterns = [
    { paidMonths: [1,2,3,4,5,6], confirmed: true },
    { paidMonths: [1,2,3,4,5,6], confirmed: true },
    { paidMonths: [1,2,3,4,5,6], confirmed: true },
    { paidMonths: [1,2,3,4,5,6], confirmed: false },
    { paidMonths: [1,2,3,4,5], confirmed: true },
    { paidMonths: [1,2,3,4,5], confirmed: true },
    { paidMonths: [1,2,3,4,5], confirmed: true },
    { paidMonths: [1,2,3,4], confirmed: true },
    { paidMonths: [1,2,3,4], confirmed: true },
    { paidMonths: [1,2,3,4], confirmed: false },
    { paidMonths: [1,2,3], confirmed: true },
    { paidMonths: [1,2,3], confirmed: true },
    { paidMonths: [1,2,3], confirmed: false },
    { paidMonths: [1,2], confirmed: true },
    { paidMonths: [1,2], confirmed: true },
    { paidMonths: [1,2], confirmed: false },
    { paidMonths: [1], confirmed: true },
    { paidMonths: [1], confirmed: false },
    { paidMonths: [1], confirmed: false },
    { paidMonths: [], confirmed: false },
  ];

  const confirmMonthThreshold = 4;

  for (let i = 0; i < alumni.length; i++) {
    const pattern = patterns[i % patterns.length];
    for (let month = 1; month <= 6; month++) {
      const paid = pattern.paidMonths.includes(month) ? 1 : 0;
      const confirmed = paid && month <= confirmMonthThreshold && pattern.confirmed ? 1 : 0;
      const confirmedBy = confirmed ? (adminUser?.id || alumni[0].id) : null;
      await sql`
        INSERT INTO payments (alumni_id, year, month, paid, confirmed, confirmed_by)
        VALUES (${alumni[i].id}, 2026, ${month}, ${paid}, ${confirmed}, ${confirmedBy})
      `;
    }
  }

  console.log(`  Seeded ${alumni.length * 6} payment records (6 months each).`);
} else {
  console.log(`Payments already seeded (${paymentCount[0].c} records). Skipping.`);
}

// ─── ATTENDANCE FIX: Ensure all alumni have records for all meetings ───
const meetings = await sql`SELECT id, title FROM meetings`;
let attendanceFixed = 0;
for (const meeting of meetings) {
  for (const a of alumni) {
    const existing = await sql`SELECT id FROM attendance WHERE meeting_id = ${meeting.id} AND alumni_id = ${a.id}`;
    if (!existing.length) {
      const attended = Math.random() < 0.7 ? 1 : 0;
      await sql`INSERT INTO attendance (meeting_id, alumni_id, attended) VALUES (${meeting.id}, ${a.id}, ${attended})`;
      attendanceFixed++;
    }
  }
}
if (attendanceFixed > 0) {
  console.log(`Fixed ${attendanceFixed} missing attendance records.`);
}

console.log("\nSeed complete!");
process.exit(0);
