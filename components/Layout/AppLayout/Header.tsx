"use client";

import { createClient } from "@/utils/supabase/client";
import {
  AppShell,
  AspectRatio,
  Button,
  Group,
  Image,
  Modal,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Header = () => {
  const [opened, { toggle }] = useDisclosure();
  const supabaseClient = createClient();
  const router = useRouter();
  const [
    logoutModalOpened,
    { open: openLogoutModal, close: closeLogoutModal },
  ] = useDisclosure();

  const handleLogout = async () => {
    try {
      await supabaseClient.auth.signOut();
      closeLogoutModal();
      router.push("/auth/login");
    } catch (error) {
      notifications.show({
        title: "Logout failed",
        message: "Please try again",
        color: "red",
      });
    }
  };

  return (
    <>
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Link href="/user/onboarding">
              <AspectRatio ratio={80 / 20} w={140} h={35}>
                <Image src={"/timeleap.svg"} alt="logo" />
              </AspectRatio>
            </Link>
          </Group>
          <Group>
            <Button onClick={openLogoutModal}>Logout</Button>
          </Group>
        </Group>
      </AppShell.Header>

      <Modal
        opened={logoutModalOpened}
        onClose={closeLogoutModal}
        title="Confirm Logout"
        centered
      >
        <Text>Are you sure you want to logout?</Text>
        <Group mt="md" justify="flex-end">
          <Button variant="default" onClick={closeLogoutModal}>
            Cancel
          </Button>
          <Button color="red" onClick={handleLogout}>
            Logout
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default Header;
