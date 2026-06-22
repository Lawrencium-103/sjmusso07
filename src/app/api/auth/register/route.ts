import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone_no,
      gender,
      location,
      occupation,
      password,
      security_question,
      security_answer,
    } = body;

    if (!name || !email || !password || !security_answer) {
      return NextResponse.json(
        { error: "Name, email, password, and security answer are required" },
        { status: 400 }
      );
    }

    const db = getDb();

    const existing = await db.get(
      "SELECT id FROM alumni WHERE email = $1",
      [email]
    ) as any;
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(password);

    const result = await db.run(
      `INSERT INTO alumni (name, email, phone_no, gender, location, occupation, role, password_hash, must_change_password, security_question, security_answer)
       VALUES ($1, $2, $3, $4, $5, $6, 'user', $7, 1, $8, $9)`,
      [
        name,
        email,
        phone_no || null,
        gender || null,
        location || null,
        occupation || null,
        passwordHash,
        security_question || "What is your mother's maiden name?",
        security_answer.toLowerCase().trim(),
      ]
    );

    return NextResponse.json({
      success: true,
      id: result.lastInsertRowid,
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
