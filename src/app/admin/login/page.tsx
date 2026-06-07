"use client";

import * as React from "react";
import { doLogin } from "@/actions/auth";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldAlert, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const handleAction = (formData: FormData) => {
    setError("");
    startTransition(async () => {
      try {
        const result = await doLogin(formData);
        if (result?.error) {
          setError(result.error);
        }
      } catch (err: any) {
        if (err?.message?.includes("NEXT_REDIRECT") || err?.digest?.startsWith("NEXT_REDIRECT")) {
          throw err;
        }
        setError("Terjadi kesalahan sistem. Silakan coba lagi.");
      }
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#f5f5f7] font-sans selection:bg-blue-200 selection:text-blue-900">
      {/* Light macOS Native Style Ambient Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-blue-200/40 to-purple-200/40 blur-[120px] animate-[pulse_8s_infinite_alternate] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-bl from-teal-100/50 to-blue-100/50 blur-[130px] animate-[pulse_10s_infinite_alternate_delay-2000] pointer-events-none"></div>

      {/* The Login Card - macOS Style Glass Window (Light) */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative z-10 w-full max-w-[420px] mx-4 rounded-[20px] bg-white/70 backdrop-blur-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] overflow-hidden"
      >
        {/* macOS Style Titlebar Window Controls */}
        <div className="flex items-center justify-between px-4 py-3 bg-white/40 backdrop-blur-md border-b border-black/5">
          <div className="flex items-center gap-2 group">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] relative flex items-center justify-center overflow-hidden">
              <span className="opacity-0 group-hover:opacity-100 text-[8px] text-black/60 font-black mb-[1px]">x</span>
            </div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] relative flex items-center justify-center overflow-hidden">
              <span className="opacity-0 group-hover:opacity-100 text-[8px] text-black/60 font-black mb-[1px]">-</span>
            </div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] relative flex items-center justify-center overflow-hidden">
              <span className="opacity-0 group-hover:opacity-100 text-[8px] text-black/60 font-black mb-[1px]">+</span>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-gray-500 tracking-wide">Koneksi Aman</span>
          <div className="w-12"></div> {/* Spacer for symmetry */}
        </div>

        {/* Card Body */}
        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
              className="mx-auto w-16 h-16 bg-gradient-to-b from-[#026E40] to-[#014A2B] rounded-2xl flex items-center justify-center text-white font-bold text-3xl mb-4 shadow-[0_8px_16px_rgba(2,110,64,0.3)] border border-black/10"
            >
              M
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Portal</h1>
            <p className="text-gray-500 text-xs mt-1.5 font-medium">MTs Muhammadiyah 07 Purbalingga</p>
          </div>

          <form action={handleAction} className="space-y-4">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-xs flex items-center gap-2.5 font-medium shadow-sm"
              >
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
            
            {/* Email Field */}
            <div className="space-y-1.5 relative group">
              <label className="text-[11px] font-semibold text-gray-500 ml-1">Email</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  name="email"
                  className="w-full pl-10 pr-4 py-3 bg-white/60 border border-gray-200/80 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-900 placeholder:text-gray-400 text-sm font-medium shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
                  placeholder="admin@sekolah.id"
                  required
                />
              </div>
            </div>
            
            {/* Password Field */}
            <div className="space-y-1.5 relative group">
              <label className="text-[11px] font-semibold text-gray-500 ml-1">Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full pl-10 pr-10 py-3 bg-white/60 border border-gray-200/80 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-900 placeholder:text-gray-400 text-sm font-medium shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isPending}
              className="w-full mt-6 py-3 bg-gradient-to-b from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-[0_2px_5px_rgba(59,130,246,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm border border-blue-700/50"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memeriksa Kredensial...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Sistem</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
