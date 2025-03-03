import MDXContent from "@/lib/MDXContent";

/**
 * Fetch the Privacy Policy page.
 */
export async function getPrivacyPolicy() {
    const { post: privacyPolicy } = await new MDXContent("src/static_pages").getPostFromSlug("privacy-policy");
    return privacyPolicy;
}
