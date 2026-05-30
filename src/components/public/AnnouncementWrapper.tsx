"use client";

import React, { useState, useEffect } from "react";
import { X, Megaphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Announcement = {
  id: string;
  content: string;
  isPopup: boolean;
};

export function AnnouncementWrapper({ announcements }: { announcements: Announcement[] }) {
  const popups = announcements.filter((a) => a.isPopup);
  const tickers = announcements.filter((a) => !a.isPopup);

  const [activePopup, setActivePopup] = useState<Announcement | null>(null);

  useEffect(() => {
    if (popups.length > 0) {
      // Check session storage to avoid spamming the user
      const seenPopups = JSON.parse(sessionStorage.getItem("seenPopups") || "[]");
      const unseedPopup = popups.find(p => !seenPopups.includes(p.id));
      if (unseedPopup) {
        setActivePopup(unseedPopup);
      }
    }
  }, [popups]);

  const closePopup = () => {
    if (activePopup) {
      const seenPopups = JSON.parse(sessionStorage.getItem("seenPopups") || "[]");
      sessionStorage.setItem("seenPopups", JSON.stringify([...seenPopups, activePopup.id]));
    }
    setActivePopup(null);
  };

  return (
    <>
      {/* Ticker Bar */}
      {tickers.length > 0 && (
        <div className="bg-[#007aff] text-white py-2 px-4 flex items-center text-sm font-medium z-50 relative overflow-hidden">
          <div className="flex-shrink-0 mr-3 hidden sm:flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            <span className="uppercase tracking-wider font-bold text-xs bg-white/20 px-2 py-0.5 rounded">INFO</span>
          </div>
          <div className="flex-1 overflow-hidden whitespace-nowrap">
            <div className="inline-block animate-marquee">
              {tickers.map((t, idx) => (
                <span key={t.id} className="mx-8">
                  {t.content} {idx !== tickers.length - 1 && <span className="mx-8 text-white/50">•</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Popup Modal */}
      <AnimatePresence>
        {activePopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={closePopup}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              
              <button 
                onClick={closePopup}
                className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 border border-blue-100 shadow-sm">
                <Megaphone size={32} />
              </div>

              <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Pengumuman</h3>
              <p className="text-gray-600 font-medium text-[15px] leading-relaxed mb-8">
                {activePopup.content}
              </p>

              <button 
                onClick={closePopup}
                className="w-full py-3 bg-[#007aff] hover:bg-[#0056b3] text-white font-semibold rounded-xl transition-colors shadow-sm active:scale-[0.98]"
              >
                Mengerti
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 30s linear infinite;
        }
      `}} />
    </>
  );
}
