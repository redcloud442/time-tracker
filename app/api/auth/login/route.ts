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

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  return NextResponse.json({ message: "Login successful" }, { status: 200 });
};
