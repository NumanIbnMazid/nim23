import ContactClient from "@/app/contact/ContactClient";
import { getPageMetadata, pageMeta } from "@/lib/Meta";
import type { Metadata } from "next";
import { PUBLIC_SITE_URL } from "@/lib/constants";

// ✅ Generate metadata for Contact Page
export const metadata: Metadata = getPageMetadata({
    title: pageMeta.contact.title,
    description: pageMeta.contact.description,
    image: pageMeta.contact.image,
    keywords: pageMeta.contact.keywords,
    url: `${PUBLIC_SITE_URL}/contact`, // ✅ Contact page URL
});

export default function Page() {
    return <ContactClient />;
}
