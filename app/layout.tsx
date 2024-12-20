import { RouterTransition } from "@/components/RouterTransition/RouterTransition";
import {
  ColorSchemeScript,
  Loader,
  mantineHtmlProps,
  MantineProvider,
} from "@mantine/core";
import "@mantine/core/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import "@mantine/nprogress/styles.css";
import "mantine-datatable/styles.layer.css";
import { Suspense } from "react";
import { theme } from "../theme";
import "./layout.css";

export const metadata = {
  title: "Mantine Next.js template",
  description: "I am using Mantine with Next.js!",
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <ModalsProvider>
            <Notifications />
            <RouterTransition />
            <Suspense fallback={<Loader />}>{children}</Suspense>
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
