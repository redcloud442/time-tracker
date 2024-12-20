import { SupabaseClient } from "@supabase/supabase-js";

import { team_table } from "@prisma/client";

export const getTeamOnboarding = async (
  supabase: SupabaseClient,
  params: {
    page: number;
    limit: number;
  }
) => {
  const { data, error } = await supabase.rpc("get_team_onboarding", {
    input_data: params,
  });

  if (error) throw error;

  return data as {
    data: team_table[];
    count: number;
  };
};
