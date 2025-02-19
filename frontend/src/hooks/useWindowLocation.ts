"use client"; // ✅ Mark as a Client Component

import { useRouter } from "next/navigation"; // ✅ Correct import for App Router
import { useEffect, useState } from "react";

export default function useWindowLocation() {
    const [currentURL, setCurrentURL] = useState<string>("");
    const router = useRouter(); // ✅ Now works properly inside App Router

    useEffect(() => {
        if (typeof window !== "undefined") {
            setCurrentURL(window.location.href);
        }
    }, []);

    return { currentURL, router };
}
