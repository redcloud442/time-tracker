import prisma from "@/utils/prisma";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

export const serverProtectionMember = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  const userData = await prisma.user_table.findUnique({
    where: {
      user_id: user.id,
    },
  });

  if (!userData) {
    return redirect("/auth/login");
  }

  if (
    userData.user_type !== "ONBOARDING" &&
    userData.user_active_team !== null
  ) {
    const team = await prisma.team_table.findUnique({
      where: {
        team_id: userData.user_active_team,
      },
    });
    const teamName = team?.team_name.toLowerCase().replace(/\s+/g, "-");
    return redirect(`/${teamName}`);
  } else if (userData.user_type === "PENDING REQUEST") {
    const team = await prisma.team_table.findUnique({
      where: {
        team_id: userData.user_active_team ?? undefined,
      },
    });

    if (team) {
      const teamName = team?.team_name.toLowerCase().replace(/\s+/g, "-");
      return redirect(`/${teamName}`);
    }

    return redirect("/user");
  }
  return {
    userProfile: userData,
  };
};
