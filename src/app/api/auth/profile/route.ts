import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone_no, gender, location, occupation, profile_name_whatsapp, facebook_handle, x_handle, linkedin, snapchat, telegram, tiktok, instagram } = body;

    const db = getDb();
    await db.run(
      `UPDATE alumni SET
        name = COALESCE($1, name),
        phone_no = COALESCE($2, phone_no),
        gender = COALESCE($3, gender),
        location = COALESCE($4, location),
        occupation = COALESCE($5, occupation),
        profile_name_whatsapp = COALESCE($6, profile_name_whatsapp),
        facebook_handle = COALESCE($7, facebook_handle),
        x_handle = COALESCE($8, x_handle),
        linkedin = COALESCE($9, linkedin),
        snapchat = COALESCE($10, snapchat),
        telegram = COALESCE($11, telegram),
        tiktok = COALESCE($12, tiktok),
        instagram = COALESCE($13, instagram)
      WHERE id = $14`,
      [
        name ?? null, phone_no ?? null, gender ?? null, location ?? null,
        occupation ?? null, profile_name_whatsapp ?? null, facebook_handle ?? null,
        x_handle ?? null, linkedin ?? null, snapchat ?? null, telegram ?? null,
        tiktok ?? null, instagram ?? null, user.id
      ]
    );

    const updated = await db.get(
      "SELECT id, name, email, phone_no, role, gender, location, occupation, profile_picture, must_change_password FROM alumni WHERE id = $1",
      [user.id]
    );

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
