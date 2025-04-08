'use client'

import NoSSRWrapper from "@/app/NoSSRWrapper";
import GrabitbPage from "@/app/grabit/GrabitPage";

export default function GrabitPageView() {
    return <NoSSRWrapper><GrabitbPage /></NoSSRWrapper>
}
