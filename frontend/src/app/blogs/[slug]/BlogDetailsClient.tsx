"use client"; // ✅ Ensure this runs only on the client
import { BlogType } from "@/lib/types";import Loader from "@/components/Loader";
import NoData from "@/components/NoData";
import dynamic from "next/dynamic";

const BlogLayout = dynamic(() => import("@/layout/BlogLayout"), { loading: () => <Loader /> });

export default function BlogDetailsClient({
    blog,
    profileInfo,
}: {
    blog: BlogType;
    profileInfo: any;
}) {
    return (
        <>
            {blog && profileInfo ? (
                <BlogLayout blog={blog} profileInfo={profileInfo} />
            ) : (
                <NoData allowSpacing={true} />
            )}
        </>
    );
}
