import BlogsClient from "@/app/blogs/BlogsClient";
import { Suspense } from "react";
import SkeletonLoader from "@/components/SkeletonLoader";
import { getPageMetadata, pageMeta } from "@/lib/Meta";
import type { Metadata } from "next";
import { PUBLIC_SITE_URL } from "@/lib/constants";
import { notFound } from "next/navigation";

// revalidate all fetch requests in a route segment
export const revalidate = 60 // revalidate at 1 min

// ✅ Generate metadata for All Blogs Page
export const metadata: Metadata = getPageMetadata({
    title: pageMeta.blogs.title,
    description: pageMeta.blogs.description,
    image: pageMeta.blogs.image,
    keywords: pageMeta.blogs.keywords,
    url: `${PUBLIC_SITE_URL}/blogs`, // ✅ Blogs page URL
});

export default async function Page() {
    return (
        <Suspense fallback={<SkeletonLoader />}>
            <MainBlogsPage />
        </Suspense>
    );
}

async function MainBlogsPage() {
    const res = await fetch(`${PUBLIC_SITE_URL}/api/blogs`, {
        // cache: "no-store", // ✅ Prevents caching, always fetch fresh data
    });

    if (!res.ok) {
        console.error("Failed to fetch blogs");
        notFound(); // ✅ Automatically triggers `not-found.tsx`
    }
    
    const blogs = await res.json();

    return <BlogsClient initialBlogs={blogs} />; // ✅ Pass blogs to the Client Component
}