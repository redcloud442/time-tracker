"use client";

import {
  completeNavigationProgress,
  NavigationProgress,
  nprogress,
  startNavigationProgress,
} from "@mantine/nprogress";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function RouterTransition() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      nprogress.start();
      startNavigationProgress();
    }

    const timer = setTimeout(() => {
      completeNavigationProgress();
      previousPathname.current = pathname;
    }, 300);

    return () => {
      clearTimeout(timer);
      nprogress.reset();
    };
  }, [pathname]);

  return <NavigationProgress />;
}
