"use client"; // ✅ Mark as a Client Component

import { useEffect } from "react";

export default function SitemapPrefetch() {
  useEffect(() => {
    fetch("/sitemap.xml"); // ✅ Triggers Google to refresh sitemap
  }, []);

  return null; // ✅ No UI needed
}
