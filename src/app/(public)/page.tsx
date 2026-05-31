import LandingClientView from "./LandingClientView";
import { getLandingSettings, getMediaSettings } from "@/actions/settings";
import { getLandingData } from "@/actions/landing";
import { draftMode } from "next/headers";
import { cookies } from "next/headers";
import { getDraft } from "@/lib/draftStore";

// Generate metadata for the landing page
export async function generateMetadata() {
  const settings = await getLandingSettings();
  
  return {
    title: settings?.hero?.title?.replace(/\n/g, ' ') || "MTs Muhammadiyah 07 Purbalingga",
    description: settings?.hero?.subtitle || "Sekolah Unggulan di Purbalingga",
  };
}

// Server Component — supports Live Preview via Next.js Draft Mode
export default async function LandingPage() {
  const { isEnabled: isDraftMode } = await draftMode();

  let settings, media;

  if (isDraftMode) {
    // In draft mode: read from in-memory draft store (admin live preview)
    const cookieStore = await cookies();
    const draftToken = cookieStore.get("preview_draft_token")?.value;
    const draft = draftToken ? getDraft(draftToken) : null;

    settings = draft?.settings ?? (await getLandingSettings());
    media    = draft?.media    ?? (await getMediaSettings());
  } else {
    // Normal mode: read from database
    [settings, media] = await Promise.all([
      getLandingSettings(),
      getMediaSettings(),
    ]);
  }

  const dynamicData = await getLandingData();

  return (
    <LandingClientView 
      settings={settings} 
      media={media} 
      dynamicData={dynamicData} 
    />
  );
}
