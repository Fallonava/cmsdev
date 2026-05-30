import LandingClientView from "./LandingClientView";
import { getLandingSettings, getMediaSettings } from "@/actions/settings";
import { getLandingData } from "@/actions/landing";

// Generate metadata for the landing page
export async function generateMetadata() {
  const settings = await getLandingSettings();
  
  return {
    title: settings?.hero?.title?.replace(/\n/g, ' ') || "MTs Muhammadiyah 07 Purbalingga",
    description: settings?.hero?.subtitle || "Sekolah Unggulan di Purbalingga",
  };
}

// Server Component
export default async function LandingPage() {
  // Fetch all necessary data concurrently
  const [settings, media, dynamicData] = await Promise.all([
    getLandingSettings(),
    getMediaSettings(),
    getLandingData(),
  ]);

  return (
    <LandingClientView 
      settings={settings} 
      media={media} 
      dynamicData={dynamicData} 
    />
  );
}
