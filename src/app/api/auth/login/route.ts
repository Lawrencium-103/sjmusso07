import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  verifyPassword,
  hashPassword,
  createSession,
  setSessionCookie,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, security_answer, new_password, alumni_id } = body;

    const db = getDb();

    if (password === "__verify_question__") {
      const alumni = await db.get(
        "SELECT id, security_question FROM alumni WHERE email = $1",
        [email]
      ) as any;
      if (!alumni) {
        return NextResponse.json({ error: "Email not found" }, { status: 404 });
      }
      return NextResponse.json(
        {
          security_question: alumni.security_question,
          alumni_id: alumni.id,
        },
        { status: 426 }
      );
    }

    if (password === "__check_answer__") {
      const alumni = await db.get(
        "SELECT id, security_answer FROM alumni WHERE email = $1",
        [email]
      ) as any;
      if (!alumni) {
        return NextResponse.json({ error: "Email not found" }, { status: 404 });
      }
      if (
        security_answer !== alumni.security_answer?.toLowerCase().trim()
      ) {
        return NextResponse.json(
          { error: "Incorrect answer" },
          { status: 426 }
        );
      }
      return NextResponse.json({ verified: true });
    }

    if (password === "__reset_password__") {
      if (!new_password || new_password.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters" },
          { status: 400 }
        );
      }
      const hash = hashPassword(new_password);
      await db.run(
        "UPDATE alumni SET password_hash = $1, must_change_password = 0 WHERE id = $2",
        [hash, alumni_id]
      );
      return NextResponse.json({ success: true });
    }

    if (email === "__change_password__") {
      const cookieStore = await import("next/headers").then((m) => m.cookies());
      const token = cookieStore.get("session_token")?.value;
      if (!token) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      }
      const session = await db.get(
        "SELECT alumni_id FROM sessions WHERE token = $1",
        [token]
      ) as any;
      if (!session) {
        return NextResponse.json({ error: "Invalid session" }, { status: 401 });
      }
      const alumni = await db.get(
        "SELECT password_hash FROM alumni WHERE id = $1",
        [session.alumni_id]
      ) as any;
      if (!alumni?.password_hash) {
        return NextResponse.json(
          { error: "Account not set up" },
          { status: 400 }
        );
      }
      if (!verifyPassword(password, alumni.password_hash)) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }
      if (!new_password || new_password.length < 6) {
        return NextResponse.json(
          { error: "New password must be at least 6 characters" },
          { status: 400 }
        );
      }
      const hash = hashPassword(new_password);
      await db.run(
        "UPDATE alumni SET password_hash = $1, must_change_password = 0 WHERE id = $2",
        [hash, session.alumni_id]
      );

      const user = await db.get(
        "SELECT role FROM alumni WHERE id = $1",
        [session.alumni_id]
      ) as any;
      return NextResponse.json({
        success: true,
        role: user.role,
      });
    }

    const alumni = await db.get(
      "SELECT id, name, email, password_hash, role, must_change_password FROM alumni WHERE email = $1",
      [email]
    ) as any;

    if (!alumni) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (!alumni.password_hash) {
      return NextResponse.json({ error: "Account not set up" }, { status: 401 });
    }

    if (!verifyPassword(password, alumni.password_hash)) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isDefaultPassword = password === "Abc123";
    if (isDefaultPassword && alumni.must_change_password !== 1) {
      await db.run(
        "UPDATE alumni SET must_change_password = 1 WHERE id = $1",
        [alumni.id]
      );
    }

    const { token, expiresAt } = await createSession(alumni.id);
    const response = NextResponse.json({
      success: true,
      role: alumni.role,
      must_change_password: alumni.must_change_password === 1 || isDefaultPassword,
    });

    response.cookies.set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(expiresAt),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
