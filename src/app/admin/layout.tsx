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
  Handshake, HelpCircle, Search, Briefcase, Megaphone, FolderDown, Activity
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
      { name: "Pengaturan Sistem", href: "/admin/pengaturan", icon: Settings, color: "bg-gray-500", roles: ["SUPERADMIN"] },
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
      initial={{ scale: 0.97, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="flex h-screen bg-[#e8e8ed] overflow-hidden mac-admin"
    >
      
      {/* 1. Seamless Sidebar (macOS Style) */}
      <aside className="hidden md:flex flex-col w-[250px] h-full shrink-0 bg-transparent">
        
        {/* Brand & Traffic Lights */}
        <div className="h-24 flex flex-col justify-center px-5 pt-3">
          {/* Traffic Lights */}
          <div className="flex items-center gap-2 mb-4 ml-2 group">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] shadow-sm flex items-center justify-center opacity-90 hover:opacity-100">
              <X size={8} className="text-black/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] shadow-sm flex items-center justify-center opacity-90 hover:opacity-100"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] shadow-sm flex items-center justify-center opacity-90 hover:opacity-100"></div>
          </div>
          
          <div className="flex items-center gap-3 ml-1.5">
            <div className="w-9 h-9 bg-gradient-to-b from-gray-700 to-gray-900 rounded-[0.55rem] flex items-center justify-center text-white font-bold text-lg shadow-sm border border-gray-900/10">
              M
            </div>
            <div>
              <span className="font-bold text-[15px] text-gray-900 tracking-tight leading-none block">Admin</span>
              <span className="font-medium text-[11px] text-gray-500 tracking-wider uppercase mt-0.5 block">Workspace</span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 py-2 flex flex-col gap-0.5 px-3 overflow-y-auto">
          {MENU_GROUPS.map((group, groupIdx) => {
            const filteredItems = group.items.filter(item => item.roles.includes(role || "SUPERADMIN"));
            if (filteredItems.length === 0) return null;

            return (
              <div key={group.label} className={groupIdx !== 0 ? "mt-4" : ""}>
                <p className="text-[11px] font-bold text-gray-400/80 uppercase tracking-widest pl-3 mb-1.5">{group.label}</p>
                <div className="flex flex-col gap-[2px]">
                  {filteredItems.map((item) => {
                    const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-1.5 rounded-[0.4rem] font-medium transition-all duration-200 outline-none",
                          isActive
                            ? "bg-black/5 text-gray-900"
                            : "text-gray-600 hover:bg-black/5"
                        )}
                      >
                        <div className={cn("w-6 h-6 rounded-[0.35rem] flex items-center justify-center text-white shadow-[0_1px_2px_rgba(0,0,0,0.1)] shrink-0", item.color)}>
                          <item.icon size={14} strokeWidth={2.5} />
                        </div>
                        <span className="text-[13px] tracking-tight">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* User Profile & Logout */}
        <div className="p-3 mb-3">
          <form action={doLogout}>
            <button 
              type="submit"
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-[0.4rem] font-medium text-gray-500 hover:text-red-600 hover:bg-red-500/10 w-full transition-all active:scale-95 duration-200"
            >
              <LogOut size={14} strokeWidth={2.5} className="text-gray-400" />
              <span className="text-[13px]">Akhiri Sesi</span>
            </button>
          </form>
        </div>
      </aside>

      {/* 2. Main Content Area (Elevated White Layer) */}
      <div className="flex-1 flex flex-col min-w-0 bg-white md:rounded-[0.8rem] md:my-2 md:mr-2 md:border md:border-white/60 md:ring-1 md:ring-black/5 md:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25),0_0_15px_rgba(0,0,0,0.05)] overflow-hidden relative">
        
        {/* Top Navbar / Titlebar */}
        <header className="h-14 shrink-0 flex items-center justify-between px-6 border-b border-gray-100/60 bg-white/60 backdrop-blur-2xl backdrop-saturate-[180%] sticky top-0 z-20">
          
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileOpen(true)} className="md:hidden flex items-center justify-center w-8 h-8 text-gray-600 hover:bg-gray-100 rounded-md transition-colors active:scale-95">
              <Menu size={18} />
            </button>
            <div className="hidden md:flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
              <span className="text-[14px] font-bold text-gray-800 tracking-tight">
                {MENU_GROUPS.flatMap(g => g.items).find(i => pathname === i.href || (pathname.startsWith(i.href) && i.href !== "/admin"))?.name || 'Dashboard'}
              </span>
            </div>
          </div>

          {/* Spotlight Search (Visual) */}
          <div className="hidden md:flex flex-1 max-w-sm mx-6">
            <button onClick={() => setIsCmdKOpen(true)} className="flex items-center w-full h-[30px] bg-gray-500/5 hover:bg-gray-500/10 border border-gray-900/5 rounded-[0.45rem] px-3 transition-colors text-gray-400 group cursor-text outline-none">
              <Search size={14} strokeWidth={2.5} className="mr-2 opacity-60 group-hover:text-gray-900 transition-colors" />
              <span className="text-[13px] font-medium tracking-tight flex-1 text-left group-hover:text-gray-900 transition-colors">Search...</span>
              <div className="flex items-center gap-0.5 opacity-60">
                <kbd className="font-sans text-[10px] font-bold bg-white/50 border border-gray-200/60 rounded-[0.25rem] px-1.5 py-[1px] shadow-sm">⌘</kbd>
                <kbd className="font-sans text-[10px] font-bold bg-white/50 border border-gray-200/60 rounded-[0.25rem] px-1.5 py-[1px] shadow-sm">K</kbd>
              </div>
            </button>
          </div>
          
          {/* Right: User Profile Mini */}
          <div className="flex items-center gap-2.5 cursor-pointer group px-2 py-1 hover:bg-gray-50 rounded-[0.4rem] transition-colors active:scale-95 shrink-0">
            <div className="flex flex-col items-end justify-center">
              <p className="font-semibold text-gray-900 text-[12px] leading-none">Superadmin</p>
            </div>
            <div className="w-7 h-7 rounded-full bg-gradient-to-b from-[#f5f5f7] to-[#e5e5ea] border border-gray-300 flex items-center justify-center font-bold text-gray-600 text-[10px] shadow-sm">
              AD
            </div>
          </div>
        </header>

        {/* Main Scrolling Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#ffffff] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
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
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCmdKOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="relative w-full max-w-lg bg-white/70 backdrop-blur-3xl backdrop-saturate-[200%] border border-white/50 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] rounded-2xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center px-4 py-3 border-b border-gray-200/50">
                <Search size={18} className="text-gray-400 mr-3 shrink-0" />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Spotlight Search... (misal: galeri, berita)"
                  className="flex-1 bg-transparent text-[16px] text-gray-900 placeholder:text-gray-400 outline-none font-medium"
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
              </div>
              <div className="max-h-[300px] overflow-y-auto p-2">
                {MENU_GROUPS.flatMap(g => g.items)
                  .filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((item) => (
                    <button
                      key={item.href}
                      onClick={() => { router.push(item.href); setIsCmdKOpen(false); setSearchQuery(""); }}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#007aff] hover:text-white text-gray-700 rounded-xl transition-colors text-left group"
                    >
                      <div className={cn("w-6 h-6 rounded-[0.35rem] flex items-center justify-center text-white shadow-sm shrink-0", item.color)}>
                        <item.icon size={14} strokeWidth={2.5} />
                      </div>
                      <span className="text-[14px] font-medium tracking-tight group-hover:text-white">{item.name}</span>
                    </button>
                  ))
                }
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
