import { UserProfile } from "@/utils/types";
import { create } from "zustand";

interface UserProfileState {
  userProfile: UserProfile;
  setUserProfile: (userProfile: UserProfile) => void;
}

export const useUserProfileStore = create<UserProfileState>((set) => ({
  userProfile: {
    user_id: "",
    user_email: "",
    user_first_name: "",
    user_last_name: "",
    user_active_team: "",
    user_avatar: "",
    user_team: {
      team_id: "",
      team_name: "",
    },
  },
  setUserProfile: (userProfile) =>
    set((state) => ({
      userProfile: { ...state.userProfile, userProfile },
    })),
}));
