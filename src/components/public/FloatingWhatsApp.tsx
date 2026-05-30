"use client";

import React, { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type WAProps = {
  waNumber: string;
  waMessage: string;
  waActive: boolean;
};

export function FloatingWhatsApp({ waNumber, waMessage, waActive }: WAProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(waMessage);

  if (!waActive || !waNumber) return null;

  const handleSend = () => {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${waNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    window.open(url, "_blank");
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] hover:bg-[#1DA851] text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(37,211,102,0.4)] transition-all hover:scale-110 active:scale-95 z-[90]"
        aria-label="Tanya via WhatsApp"
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed bottom-24 right-6 w-[340px] z-[100]">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] overflow-hidden border border-gray-100 flex flex-col"
            >
              {/* Header */}
              <div className="bg-[#007aff] px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0 relative">
                    <MessageCircle size={20} />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#007aff] rounded-full"></span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-[15px] leading-tight">Admin Helpdesk</h3>
                    <p className="text-blue-100 text-[12px]">Online - Siap membantu</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Chat Body */}
              <div className="bg-[#f5f5f7] p-5 h-[200px] overflow-y-auto">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#007aff] flex items-center justify-center text-white shrink-0 mt-1">
                    <MessageCircle size={14} />
                  </div>
                  <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 text-[14px] text-gray-700">
                    <p>Halo! Ada yang bisa kami bantu terkait PPDB atau informasi sekolah?</p>
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-gray-100">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#f5f5f7] rounded-xl p-3 text-[14px] text-gray-900 focus:outline-none resize-none border border-transparent focus:border-gray-200"
                  rows={2}
                  placeholder="Ketik pesan Anda..."
                />
                <button
                  onClick={handleSend}
                  className="w-full mt-2 py-2.5 bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold text-[14px] rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <Send size={16} /> Kirim via WhatsApp
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
