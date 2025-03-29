'use client'

import NoSSRWrapper from "@/app/NoSSRWrapper";
import VidgrabPage from "@/app/vidgrab/VidgrabPage";

export default function VidgrabPageView() {
    return <NoSSRWrapper><VidgrabPage /></NoSSRWrapper>
}
