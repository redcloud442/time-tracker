"use client";

import { AppShell, Button, Group, Text } from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <AppShell.Header>
      <Group justify="space-between" h="100%" px="md">
        <Group>
          <Text>Logo Here</Text>
        </Group>
        <Group>
          {pathname !== "/auth/login" && (
            <Button onClick={() => router.push("/auth/login")}>Login</Button>
          )}
          {pathname !== "/auth/register" && (
            <Button
              onClick={() => router.push("/auth/register")}
              variant="outline"
            >
              Register
            </Button>
          )}
        </Group>
      </Group>
    </AppShell.Header>
  );
};

export default Header;
