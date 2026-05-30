import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getIdentitySettings } from "@/actions/settings";
import { getActiveAnnouncements } from "@/actions/announcement";
import { AnnouncementWrapper } from "@/components/public/AnnouncementWrapper";
import { FloatingWhatsApp } from "@/components/public/FloatingWhatsApp";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const identity = await getIdentitySettings();
  const announcements = await getActiveAnnouncements();

  return (
    <>
      <AnnouncementWrapper announcements={announcements} />
      <Navbar identity={identity} />
      <div className="flex-1">
        {children}
      </div>
      <Footer identity={identity} />
      <FloatingWhatsApp 
        waNumber={identity?.waNumber} 
        waMessage={identity?.waMessage} 
        waActive={identity?.waActive} 
      />
    </>
  );
}
