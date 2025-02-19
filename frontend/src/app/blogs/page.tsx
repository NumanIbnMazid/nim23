import { getAllBlogs } from "@/lib/api/blogs/blogs";
import BlogsClient from "@/app/blogs/BlogsClient";
import { Suspense } from "react";
import SkeletonLoader from "@/components/SkeletonLoader";
import { getPageMetadata, pageMeta } from "@/lib/Meta";
import type { Metadata } from "next";
import { PUBLIC_SITE_URL } from "@/lib/constants";

// ✅ Generate metadata for All Blogs Page
export const metadata: Metadata = getPageMetadata({
    title: pageMeta.blogs.title,
    description: pageMeta.blogs.description,
    image: pageMeta.blogs.image,
    keywords: pageMeta.blogs.keywords,
    url: `${PUBLIC_SITE_URL}/blogs`, // ✅ Blogs page URL
});

export default async function BlogsPage() {
    return (
        <Suspense fallback={<SkeletonLoader />}>
            <MainBlogsPage />
        </Suspense>
    );
}

async function MainBlogsPage() {
    const blogs = await getAllBlogs(); // ✅ Server-side fetch for better performance

    return <BlogsClient initialBlogs={blogs} />; // ✅ Pass blogs to the Client Component
}
