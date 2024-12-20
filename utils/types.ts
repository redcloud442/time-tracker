export type UserProfile = {
  user_id: string;
  user_email: string;
  user_first_name: string;
  user_last_name: string;
  user_active_team: string;
  user_avatar: string;
  user_team: {
    team_id: string;
    team_name: string;
  };
};
