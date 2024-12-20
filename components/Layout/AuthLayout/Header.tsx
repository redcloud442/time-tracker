"use client";

import { AppShell, AspectRatio, Button, Group, Image } from "@mantine/core";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <AppShell.Header>
      <Group justify="space-between" align="center" h="100%" px="md">
        <Link href="/auth/login">
          <AspectRatio ratio={80 / 20} w={140} h={35}>
            <Image src={"/timeleap.svg"} alt="logo" />
          </AspectRatio>
        </Link>

        <Group align="start">
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
