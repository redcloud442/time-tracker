import { applyRateLimit } from "@/utils/helper";
import prisma from "@/utils/prisma";
import { serverProtectionMember } from "@/utils/serverProtection";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";

    await applyRateLimit(ip);

    let AvatarUrl = null;

    const supabase = await createClient();
    const { firstName, lastName, avatar, teamId } = await req.json();
    const { userProfile } = await serverProtectionMember();
    const file = avatar as File;

    if (userProfile.user_type === "PENDING REQUEST") {
      return NextResponse.json(
        { message: "You are already onboarded" },
        { status: 400 }
      );
    }

    if (avatar) {
      const filePath = `uploads/${Date.now()}_${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("USER_AVATAR")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        return NextResponse.json(
          { error: "File upload failed.", details: uploadError.message },
          { status: 500 }
        );
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("USER_AVATAR").getPublicUrl(filePath);
      AvatarUrl = publicUrl;
    }

    await prisma.$transaction([
      prisma.user_table.update({
        where: { user_id: userProfile.user_id },
        data: {
          user_first_name: firstName,
          user_last_name: lastName,
          user_avatar_url: AvatarUrl,
          user_type: "PENDING REQUEST",
        },
      }),
      prisma.team_member_request_table.create({
        data: {
          team_member_request_user_id: userProfile.user_id,
          team_member_request_team_id: teamId,
          team_member_request_status: "PENDING",
        },
      }),
    ]);

    return NextResponse.json(
      { message: "Onboarding successful" },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
};
