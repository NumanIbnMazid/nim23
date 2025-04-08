'use client'

import NoSSRWrapper from "@/app/NoSSRWrapper";
import GrabitbPage from "@/app/apps/grabit/GrabitPage";

export default function GrabitPageView() {
    return <NoSSRWrapper><GrabitbPage /></NoSSRWrapper>
}
