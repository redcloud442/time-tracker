"use client";

import Header from "@/components/Layout/AppLayout/Header";
import { AppShell } from "@mantine/core";
import "@mantine/core/styles.css";

export default function AppLayout({ children }: { children: any }) {
  //   const supabase = createClient();
  //   const { userProfile, setUserProfile } = useUserProfileStore();

  //   useEffect(() => {
  //     const fetchUserProfile = async () => {
  //       try {
  //         const { data } = await supabase.auth.getUser();

  //       } catch (e) {
  //         notifications.show({
  //           title: "Error",
  //           message: "Failed to fetch user profile",
  //           color: "red",
  //         });
  //       }
  //     };
  //   }, []);

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <Header />
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
