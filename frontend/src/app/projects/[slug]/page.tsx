import { getProjectBySlug } from "@/lib/api/projects/projectDetails";
import ProjectDetailsClient from "@/app/projects/[slug]/ProjectDetailsClient";
import { notFound } from "next/navigation";
import { getPageMetadata, pageMeta } from "@/lib/Meta";
import { Suspense } from "react";
import SkeletonLoader from "@/components/SkeletonLoader";
import type { Metadata } from "next";
import { PUBLIC_SITE_URL } from "@/lib/constants";

// ✅ Generate metadata dynamically
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params; // ✅ Await params correctly
    const project = await getProjectBySlug(slug);

    return getPageMetadata({
        title: project?.title + " - " + pageMeta.projectDetails.title || pageMeta.projectDetails.title,
        description: project?.short_description || pageMeta.projectDetails.description,
        image: project?.image || pageMeta.projectDetails.image,
        keywords: pageMeta.projectDetails.keywords,
        url: project?.slug ? `${PUBLIC_SITE_URL}/projects/${project.slug}` : PUBLIC_SITE_URL,
    });
}

export default async function ProjectDetailsPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    return (
        <Suspense fallback={<SkeletonLoader />}>
            <MainProjectDetailsPage params={params} />
        </Suspense>
    );
}

async function MainProjectDetailsPage({ params }: { params: { slug: string } }) {
    const project = await getProjectBySlug(params.slug);
    if (!project) return notFound(); // ✅ Handle 404 scenario

    return <ProjectDetailsClient project={project} />;
}
