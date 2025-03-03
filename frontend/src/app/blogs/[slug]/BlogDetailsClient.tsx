'use client' // ✅ Ensure this runs only on the client
import { BlogType } from '@/lib/types'
import NoData from '@/components/NoData'
import BlogLayout from '@/layout/BlogLayout'

export default function BlogDetailsClient({ blog, profileInfo }: { blog: BlogType; profileInfo: any }) {
  return (
    <>{blog && profileInfo ? <BlogLayout blog={blog} profileInfo={profileInfo} /> : <NoData allowSpacing={true} />}</>
  )
}
