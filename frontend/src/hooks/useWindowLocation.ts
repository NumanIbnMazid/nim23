"use client";

import { usePathname } from "next/navigation"; // ✅ Get the current route path
import { useEffect, useState } from "react";
import { PUBLIC_SITE_URL } from "@/lib/constants";

export default function useWindowLocation() {
  const [currentURL, setCurrentURL] = useState<string>(PUBLIC_SITE_URL); // ✅ Default to base URL
  const pathname = usePathname(); // ✅ Get the current path

  useEffect(() => {
    if (typeof window !== "undefined") {
      const fullURL = `${PUBLIC_SITE_URL}${pathname}`;
      setCurrentURL(fullURL); // ✅ Update current URL on route change
    }
  }, [pathname]); // ✅ Runs whenever the route changes

  return { currentURL };
}
