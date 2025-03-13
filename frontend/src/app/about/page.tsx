import MDXContent from "@/lib/MDXContent";
import AboutClient from "./AboutClient";
import { PostType, FrontMatter } from "@/lib/types";
import { getPageMetadata, pageMeta } from "@/lib/Meta";
import { Suspense } from "react";
import SkeletonLoader from "@/components/SkeletonLoader";
import type { Metadata } from "next";
import { PUBLIC_SITE_URL } from "@/lib/constants";
import { notFound } from "next/navigation";

/**
 * Default About Metadata if `meta` is not found.
 */
const DEFAULT_META: FrontMatter = {
  slug: "about",
  readingTime: { text: "0 min read", minutes: 0, time: 0, words: 0 },
  excerpt: "About me page.",
  title: pageMeta.about.title,
  date: new Date().toISOString(),
  keywords: pageMeta.about.keywords,
  image: pageMeta.about.image,
  url: `${PUBLIC_SITE_URL}/about`,
  description: pageMeta.about.description,
};

// ✅ Generate metadata using `pageMeta.about`
export const metadata: Metadata = getPageMetadata({
  title: pageMeta.about.title,
  description: pageMeta.about.description,
  image: pageMeta.about.image,
  keywords: pageMeta.about.keywords,
  url: `${PUBLIC_SITE_URL}/about`,
});

// ✅ Fetch about data using API routes
export default function AboutPage() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <MainAboutPage />
    </Suspense>
  );
}

// ✅ Fetch About Page Content and Related Data
async function MainAboutPage() {
  const aboutData = await new MDXContent("src/static_pages").getPostFromSlug("about");

  // ✅ Ensure `aboutData.post` is never null
  const about: PostType = {
    source: aboutData?.post?.source ?? { compiledSource: "", scope: {}, frontmatter: {} },
    tableOfContents: aboutData?.post?.tableOfContents ?? [],
    meta: aboutData?.post?.meta
      ? { ...aboutData.post.meta, description: aboutData.post.meta.description ?? DEFAULT_META.description }
      : DEFAULT_META,
  };

  // ✅ Fetch data from API routes in parallel
  const [experiencesRes, skillsRes, educationsRes, certificatesRes, interestsRes] = await Promise.all([
    fetch(`${PUBLIC_SITE_URL}/api/experiences`, { cache: "no-store" }),
    fetch(`${PUBLIC_SITE_URL}/api/skills`, { cache: "no-store" }),
    fetch(`${PUBLIC_SITE_URL}/api/educations`, { cache: "no-store" }),
    fetch(`${PUBLIC_SITE_URL}/api/certificates`, { cache: "no-store" }),
    fetch(`${PUBLIC_SITE_URL}/api/interests`, { cache: "no-store" }),
  ]);

  if (!experiencesRes.ok || !skillsRes.ok || !educationsRes.ok || !certificatesRes.ok || !interestsRes.ok) {
    return notFound(); // ✅ Redirect to `not-found.tsx` if any API fails
  }

  // ✅ Parse JSON responses
  const [experiences, skills, educations, certificates, interests] = await Promise.all([
    experiencesRes.json(),
    skillsRes.json(),
    educationsRes.json(),
    certificatesRes.json(),
    interestsRes.json(),
  ]);

  return (
    <AboutClient
      about={about}
      experiences={experiences}
      skills={skills}
      educations={educations}
      certificates={certificates}
      interests={interests}
    />
  );
}
