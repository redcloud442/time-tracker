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

  if (user) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 404 }
    );
  }

  const { data, error } = await supabaseClient.auth.signUp({
    email: email,
    password: password,
  });

  await prisma.$transaction(async (tx) => {
    await tx.user_table.create({
      data: {
        user_id: data.user?.id,
        user_email: email,
        user_type: "ONBOARDING",
      },
    });
  });

  if (error) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  return NextResponse.json({ message: "Login successful" }, { status: 200 });
};
