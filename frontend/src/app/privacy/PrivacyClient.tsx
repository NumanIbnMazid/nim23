"use client";

import StaticPage from "@/components/StaticPage";
import { pageMeta } from "@/lib/Meta";
import { PostType } from "@/lib/types";

export default function PrivacyClient({ privacyPolicy }: { privacyPolicy: PostType }) {
    return <StaticPage metadata={pageMeta.privacy} page={privacyPolicy} />;
}
