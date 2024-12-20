"use client";

import Header from "@/components/Layout/AuthLayout/Header";
import { AppShell } from "@mantine/core";
import "@mantine/core/styles.css";

export default function AuthLayout({ children }: { children: any }) {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <Header />
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
