'use client' // ✅ Ensure this runs only on the client
import { BlogType } from '@/lib/types'
import NoData from '@/components/NoData'
import dynamic from "next/dynamic";
import Loader from "@/components/Loader";


const BlogLayout = dynamic(() => import("@/layout/BlogLayout"), { loading: () => <Loader /> });

export default function BlogDetailsClient({ blog, profileInfo }: { blog: BlogType; profileInfo: any }) {
  return (
    <>{blog && profileInfo ? <BlogLayout blog={blog} profileInfo={profileInfo} /> : <NoData allowSpacing={true} />}</>
  )
}
