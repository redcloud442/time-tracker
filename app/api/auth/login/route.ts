import prisma from "@/utils/prisma";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const supabaseClient = await createClient();
  const { email, password } = await req.json();

  const user = await prisma.user_table.findUnique({
    where: {
      user_email: email,
    },
  });

  if (!user) {
    return NextResponse.json(
      { message: "User not found exists" },
      { status: 404 }
    );
  }

  const { error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const userData = await prisma.user_table.findUnique({
    where: {
      user_email: email,
    },
  });

  if (user.user_type === "ONBOARDING") {
    return NextResponse.json(
      { redirect: "/user/onboarding", message: "Login successful" },
      { status: 200 }
    );
  } else if (user.user_type === "PENDING REQUEST") {
    return NextResponse.json(
      { redirect: "/user", message: "Login successful" },
      { status: 200 }
    );
  } else {
    const team = await prisma.team_table.findFirst({
      where: {
        team_id: userData?.user_active_team ?? undefined,
      },
    });

    const teamName = team?.team_name.toLowerCase().replace(/\s+/g, "-");

    return NextResponse.json(
      { redirect: `/${teamName}`, message: "Login successful" },
      { status: 200 }
    );
  }
};
