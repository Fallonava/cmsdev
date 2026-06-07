"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { doLogout } from "@/actions/auth";
import { getSessionRole } from "@/actions/role";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, FileText, Users, Settings, LogOut, Menu, X, 
  GraduationCap, Trophy, Calendar, ImageIcon, MessageSquareQuote, 
  Handshake, HelpCircle, Search, Briefcase, Megaphone, FolderDown, Activity, CheckCircle, BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

const MENU_GROUPS = [
  {
    label: "Utama",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard, color: "bg-blue-500", roles: ["SUPERADMIN", "ADMIN", "GURU"] },
    ]
  },
  {
    label: "Akademik & Kesiswaan",
    items: [
      { name: "Absensi Harian", href: "/admin/absensi", icon: CheckCircle, color: "bg-green-500", roles: ["SUPERADMIN", "ADMIN", "GURU"] },
      { name: "Manajemen Kelas", href: "/admin/kelas", icon: BookOpen, color: "bg-blue-600", roles: ["SUPERADMIN", "ADMIN"] },
      { name: "Direktori Siswa", href: "/admin/siswa", icon: Users, color: "bg-violet-500", roles: ["SUPERADMIN", "ADMIN", "GURU"] },
      { name: "Ekstrakurikuler", href: "/admin/ekskul", icon: Activity, color: "bg-rose-500", roles: ["SUPERADMIN", "ADMIN", "GURU"] },
      { name: "Direktori Guru", href: "/admin/guru", icon: Briefcase, color: "bg-amber-500", roles: ["SUPERADMIN", "ADMIN"] },
      { name: "Data PPDB", href: "/admin/ppdb", icon: Users, color: "bg-indigo-500", roles: ["SUPERADMIN", "ADMIN"] },
      { name: "Program Studi", href: "/admin/program", icon: GraduationCap, color: "bg-orange-500", roles: ["SUPERADMIN", "ADMIN"] },
      { name: "Prestasi Siswa", href: "/admin/prestasi", icon: Trophy, color: "bg-yellow-500", roles: ["SUPERADMIN", "ADMIN", "GURU"] },
      { name: "Kalender", href: "/admin/kalender", icon: Calendar, color: "bg-red-500", roles: ["SUPERADMIN", "ADMIN"] },
    ]
  },
  {
    label: "Konten & Publikasi",
    items: [
      { name: "Berita & Artikel", href: "/admin/berita", icon: FileText, color: "bg-teal-500", roles: ["SUPERADMIN", "ADMIN", "GURU"] },
      { name: "Pengumuman", href: "/admin/pengumuman", icon: Megaphone, color: "bg-rose-500", roles: ["SUPERADMIN", "ADMIN"] },
      { name: "Galeri Foto", href: "/admin/galeri", icon: ImageIcon, color: "bg-pink-500", roles: ["SUPERADMIN", "ADMIN"] },
      { name: "Testimoni", href: "/admin/testimoni", icon: MessageSquareQuote, color: "bg-purple-500", roles: ["SUPERADMIN"] },
    ]
  },
  {
    label: "Informasi Publik",
    items: [
      { name: "Pusat Unduhan", href: "/admin/dokumen", icon: FolderDown, color: "bg-blue-600", roles: ["SUPERADMIN", "ADMIN"] },
      { name: "Mitra Kerja", href: "/admin/mitra", icon: Handshake, color: "bg-emerald-500", roles: ["SUPERADMIN", "ADMIN"] },
      { name: "FAQ", href: "/admin/faq", icon: HelpCircle, color: "bg-sky-500", roles: ["SUPERADMIN", "ADMIN"] },
    ]
  },
  {
    label: "Konfigurasi",
    items: [
      { name: "Pengaturan Sistem", href: "/admin/pengaturan", icon: Settings, color: "bg-gray-500", roles: ["SUPERADMIN", "ADMIN"] },
    ]
  }
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [isCmdKOpen, setIsCmdKOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [role, setRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchRole() {
      const userRole = await getSessionRole();
      setRole(userRole || "ADMIN"); // Default fallback
    }
    fetchRole();
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCmdKOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsCmdKOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-4">
        {children}
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
      className="flex h-screen bg-[#e8e8ed] overflow-hidden mac-admin"
    >
      
      {/* 1. Sidebar — macOS Vibrancy */}
      <aside className="hidden md:flex flex-col w-[240px] h-full shrink-0 mac-vibrancy border-r border-black/[0.06]">
        
        {/* Brand & Traffic Lights */}
        <div className="h-[60px] flex items-center px-4 gap-3 shrink-0">
          {/* Traffic Lights */}
          <div className="flex items-center gap-1.5 group">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] flex items-center justify-center">
              <X size={7} className="text-[#820005] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
          </div>
          
          <div className="flex items-center gap-2.5 ml-1">
            <div className="w-8 h-8 bg-gradient-to-b from-[#3a3a3c] to-[#1c1c1e] rounded-[0.5rem] flex items-center justify-center text-white font-bold text-sm shadow-sm">
              M
            </div>
            <div>
              <span className="mac-headline text-[#1c1c1e] leading-none block">Admin</span>
              <span className="mac-caption tracking-wider uppercase mt-0.5 block">CMS Workspace</span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 py-2 flex flex-col gap-0 px-2 overflow-y-auto">
          {MENU_GROUPS.map((group, groupIdx) => {
            const filteredItems = group.items.filter(item => item.roles.includes(role || "SUPERADMIN"));
            if (filteredItems.length === 0) return null;

            return (
              <div key={group.label} className={groupIdx !== 0 ? "mt-5" : "mt-2"}>
                <p className="mac-label-caps pl-2 mb-1.5">{group.label}</p>
                <div className="flex flex-col gap-[1px]">
                  {filteredItems.map((item) => {
                    const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-2.5 px-2.5 py-[5px] rounded-[0.45rem] transition-all duration-100 outline-none select-none",
                          isActive
                            ? "bg-[#007AFF] text-white shadow-[0_1px_3px_rgba(0,122,255,0.3)]"
                            : "text-[#3c3c43] hover:bg-black/[0.05] active:bg-black/[0.08]"
                        )}
                      >
                        <div className={cn(
                          "w-[22px] h-[22px] rounded-[0.3rem] flex items-center justify-center text-white shrink-0",
                          isActive ? "opacity-100" : "shadow-[0_1px_2px_rgba(0,0,0,0.12)]",
                          item.color
                        )}>
                          <item.icon size={13} strokeWidth={2.5} />
                        </div>
                        <span className="mac-callout font-semibold">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Logout */}
        <div className="p-2 pb-3">
          <form action={doLogout}>
            <button 
              type="submit"
              className="flex items-center gap-2.5 px-2.5 py-[5px] rounded-[0.45rem] text-[#8e8e93] hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 w-full transition-all duration-100 active:bg-[#FF3B30]/20"
            >
              <div className="w-[22px] h-[22px] rounded-[0.3rem] bg-[#8e8e93]/15 flex items-center justify-center shrink-0">
                <LogOut size={12} strokeWidth={2.5} />
              </div>
              <span className="mac-callout font-semibold">Akhiri Sesi</span>
            </button>
          </form>
        </div>
      </aside>

      {/* 2. Main Content Area (Elevated White Layer) */}
      <div className="flex-1 flex flex-col min-w-0 bg-white md:rounded-[0.75rem] md:my-2 md:mr-2 md:border md:border-white/60 md:ring-1 md:ring-black/[0.06] md:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.2)] overflow-hidden relative">
        
        {/* Toolbar / Titlebar */}
        <header className="h-[46px] shrink-0 flex items-center justify-between px-4 border-b border-[#e5e5ea]/60 bg-white/70 backdrop-blur-2xl backdrop-saturate-[180%] sticky top-0 z-20">
          
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileOpen(true)} className="md:hidden flex items-center justify-center w-7 h-7 text-[#636366] hover:bg-[#f5f5f7] rounded-md transition-colors">
              <Menu size={16} />
            </button>
            <div className="hidden md:flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#d1d1d6]" />
              <span className="mac-callout font-semibold text-[#3c3c43]">
                {MENU_GROUPS.flatMap(g => g.items).find(i => pathname === i.href || (pathname.startsWith(i.href) && i.href !== "/admin"))?.name || 'Dashboard'}
              </span>
            </div>
          </div>

          {/* Spotlight Search */}
          <div className="hidden md:flex flex-1 max-w-xs mx-4">
            <button onClick={() => setIsCmdKOpen(true)} className="flex items-center w-full h-[26px] bg-black/[0.04] hover:bg-black/[0.07] border border-black/[0.06] rounded-md px-2.5 transition-colors text-[#aeaeb2] group cursor-text outline-none">
              <Search size={12} strokeWidth={2.5} className="mr-1.5 opacity-60" />
              <span className="mac-callout flex-1 text-left text-[#aeaeb2]">Cari fitur…</span>
              <div className="flex items-center gap-0.5 opacity-50">
                <kbd className="font-sans text-[9px] font-bold bg-white/70 border border-[#c7c7cc] rounded-[0.2rem] px-1 py-[1px]">⌘</kbd>
                <kbd className="font-sans text-[9px] font-bold bg-white/70 border border-[#c7c7cc] rounded-[0.2rem] px-1 py-[1px]">K</kbd>
              </div>
            </button>
          </div>
          
          {/* Avatar */}
          <div className="flex items-center gap-2 cursor-pointer group px-2 py-1 hover:bg-[#f5f5f7] rounded-md transition-colors shrink-0">
            <span className="mac-caption font-semibold text-[#636366] hidden sm:block">Superadmin</span>
            <div className="w-6 h-6 rounded-full bg-gradient-to-b from-[#f5f5f7] to-[#e5e5ea] border border-[#c7c7cc] flex items-center justify-center font-bold text-[#636366] text-[9px] shadow-sm">
              AD
            </div>
          </div>
        </header>

        {/* Main Scrolling Content */}
        <main className="flex-1 overflow-y-auto p-5 bg-white relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.998 }}
              transition={{ type: "spring", stiffness: 340, damping: 30 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* 3. Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm md:hidden flex justify-start" onClick={() => setIsMobileOpen(false)}>
          <div className="w-[80%] max-w-[300px] h-full bg-[#f5f5f7] flex flex-col shadow-2xl transition-transform" onClick={e => e.stopPropagation()}>
            <div className="h-20 flex items-center justify-between px-6 border-b border-gray-200/50">
               <span className="font-extrabold text-lg text-gray-900 tracking-tight">Admin</span>
               <button onClick={() => setIsMobileOpen(false)} className="w-8 h-8 flex items-center justify-center text-gray-500">
                 <X size={20} />
               </button>
            </div>
            <div className="flex-1 py-4 flex flex-col gap-1 px-4 overflow-y-auto">
              {MENU_GROUPS.map((group, groupIdx) => (
                <div key={group.label} className={groupIdx !== 0 ? "mt-4" : ""}>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-4 mb-2">{group.label}</p>
                  <div className="flex flex-col gap-0.5">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileOpen(false)}
                          className={cn(
                            "flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all",
                            isActive
                              ? "bg-white text-gray-900 shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
                              : "text-gray-600 hover:bg-black/5"
                          )}
                        >
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0", item.color)}>
                            <item.icon size={18} strokeWidth={2.5} />
                          </div>
                          <span className="text-[15px]">{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Spotlight Command Palette (Cmd+K) */}
      <AnimatePresence>
        {isCmdKOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh]">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCmdKOpen(false)}
              className="absolute inset-0 bg-black/25 backdrop-blur-[6px]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              className="relative w-full max-w-[520px] bg-white/75 backdrop-blur-3xl backdrop-saturate-[200%] border border-white/50 shadow-[0_32px_80px_-10px_rgba(0,0,0,0.28)] rounded-[1.25rem] overflow-hidden flex flex-col"
            >
              {/* Search input */}
              <div className="flex items-center px-4 py-3 border-b border-[#e5e5ea]/50">
                <Search size={16} className="text-[#aeaeb2] mr-3 shrink-0" />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Cari halaman, fitur, data…"
                  className="flex-1 bg-transparent mac-body text-[#1c1c1e] placeholder:text-[#aeaeb2] outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const allItems = MENU_GROUPS.flatMap(g => g.items);
                      const match = allItems.find(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
                      if (match) {
                        router.push(match.href);
                        setIsCmdKOpen(false);
                        setSearchQuery("");
                      }
                    }
                  }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="text-[#aeaeb2] hover:text-[#636366] transition-colors">
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Results */}
              <div className="max-h-[340px] overflow-y-auto p-2">
                {MENU_GROUPS.map((group) => {
                  const matches = group.items.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
                  if (matches.length === 0) return null;
                  return (
                    <div key={group.label} className="mb-2">
                      <p className="mac-label-caps px-2 py-1">{group.label}</p>
                      {matches.map((item) => (
                        <button
                          key={item.href}
                          onClick={() => { router.push(item.href); setIsCmdKOpen(false); setSearchQuery(""); }}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#007AFF] hover:text-white text-[#3c3c43] rounded-[0.5rem] transition-colors text-left group"
                        >
                          <div className={cn("w-6 h-6 rounded-[0.35rem] flex items-center justify-center text-white shadow-sm shrink-0", item.color)}>
                            <item.icon size={13} strokeWidth={2.5} />
                          </div>
                          <span className="mac-callout font-semibold group-hover:text-white">{item.name}</span>
                        </button>
                      ))}
                    </div>
                  );
                })}
                {MENU_GROUPS.flatMap(g => g.items).filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                  <div className="text-center py-8">
                    <p className="mac-callout text-[#8e8e93]">Tidak ada hasil untuk "{searchQuery}"</p>
                  </div>
                )}
              </div>

              {/* Footer hint */}
              <div className="flex items-center gap-4 px-4 py-2.5 border-t border-[#e5e5ea]/50 bg-[#f5f5f7]/50">
                <span className="mac-caption">↵ Buka</span>
                <span className="mac-caption">Esc Tutup</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
