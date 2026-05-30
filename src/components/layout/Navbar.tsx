"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Beranda", href: "/" },
  { name: "Profil", href: "/profil" },
  { name: "Akademik", href: "/akademik" },
  { name: "Berita", href: "/berita" },
  { name: "Galeri", href: "/galeri" },
];

export function Navbar({ identity }: { identity?: any }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full px-4 sm:px-6 mt-4 sm:mt-6 pointer-events-none">
      <motion.nav 
        layout
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        className={cn(
          "pointer-events-auto overflow-hidden flex flex-col transition-all duration-500",
          scrolled || isOpen
            ? "w-full max-w-4xl bg-white/85 backdrop-blur-xl border border-gray-200 shadow-sm rounded-[2rem]"
            : "w-full max-w-6xl bg-white/40 backdrop-blur-md border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-[2.5rem]"
        )}
      >
        {/* Header Content (Always Visible) */}
        <div className={cn(
          "flex items-center justify-between w-full transition-all duration-500 ease-in-out",
          scrolled || isOpen ? "px-4 py-3 sm:px-6 sm:py-3.5" : "px-6 py-4"
        )}>
          <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 group shrink-0">
            {identity?.logoUrl ? (
              <motion.div layout="position" className="w-10 h-10 rounded-[1rem] flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm overflow-hidden bg-white border border-gray-100">
                <img src={identity.logoUrl} alt="Logo" className="w-full h-full object-contain" />
              </motion.div>
            ) : (
              <motion.div layout="position" className="w-10 h-10 bg-gray-900 rounded-[1rem] flex items-center justify-center transition-transform group-hover:scale-105 shadow-md">
                <span className="text-white font-bold text-sm tracking-widest">M07</span>
              </motion.div>
            )}
            <motion.span layout="position" className="font-bold text-lg sm:text-xl text-gray-900 tracking-tight hidden sm:block">
              {identity?.shortName || "MTs Muh 07"}
            </motion.span>
          </Link>

          {/* Desktop Nav */}
          <motion.div layout="position" className="hidden md:flex items-center gap-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300",
                    isActive 
                      ? "bg-gray-900 text-white shadow-md" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </motion.div>

          <motion.div layout="position" className="hidden md:flex shrink-0">
            <Link 
              href="/ppdb"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold transition-all bg-primary text-white hover:bg-primary-dark shadow-[0_4px_14px_rgba(2,110,64,0.3)] hover:shadow-[0_6px_20px_rgba(2,110,64,0.4)] hover:scale-105 h-10 px-6 ml-2"
            >
              Daftar PPDB
            </Link>
          </motion.div>

          {/* Mobile Toggle */}
          <motion.button 
            layout="position"
            className="md:hidden w-10 h-10 flex items-center justify-center bg-gray-100/80 rounded-full text-gray-900"
            onClick={() => setIsOpen(!isOpen)}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X size={20} />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Expandable Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden w-full px-4 pb-4 pt-2 flex flex-col gap-2"
            >
              <motion.div 
                initial={{ y: -10, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ delay: 0.1, duration: 0.3 }}
                className="flex flex-col gap-2"
              >
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-base font-bold px-4 py-3.5 rounded-2xl transition-colors",
                      pathname === link.href ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link 
                  href="/ppdb" 
                  onClick={() => setIsOpen(false)}
                  className="mt-4 flex items-center justify-center rounded-2xl text-base font-bold transition-all bg-primary text-white h-14 w-full shadow-[0_4px_14px_rgba(2,110,64,0.3)]"
                >
                  Daftar PPDB Sekarang
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}
