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
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#0a0d14]">
      {/* Dynamic Animated Background Mesh Gradients */}
      <div className="absolute top-[-25%] left-[-15%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-[#026E40]/25 to-blue-500/10 blur-[120px] animate-[pulse_6s_infinite_alternate] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-15%] w-[65%] h-[65%] rounded-full bg-gradient-to-bl from-[#F5B927]/15 to-[#026E40]/20 blur-[130px] animate-[pulse_8s_infinite_alternate_delay-1000] pointer-events-none"></div>
      
      {/* Ambient center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-[#026E40]/10 blur-[90px] pointer-events-none"></div>

      {/* The Login Card - macOS Style Glass Window */}
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[420px] mx-4 rounded-3xl bg-white/[0.02] backdrop-blur-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-white/[0.06] overflow-hidden"
      >
        {/* macOS Style Titlebar Window Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04] bg-white/[0.01]">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-[#e0443e] opacity-80 hover:opacity-100 transition-opacity"></span>
            <span className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123] opacity-80 hover:opacity-100 transition-opacity"></span>
            <span className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-[#1aab29] opacity-80 hover:opacity-100 transition-opacity"></span>
          </div>
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Koneksi Aman</span>
          <div className="w-12"></div> {/* Spacer for symmetry */}
        </div>

        {/* Card Body */}
        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="mx-auto w-16 h-16 bg-gradient-to-tr from-[#026E40] to-[#038c52] rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-5 shadow-[0_8px_25px_rgba(2,110,64,0.4)] border border-[#038c52]/30"
            >
              M
            </motion.div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h1>
            <p className="text-gray-400 text-xs mt-2 font-medium">MTs Muhammadiyah 07 Purbalingga</p>
          </div>

          <form action={handleAction} className="space-y-5">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-2xl text-xs flex items-center gap-2.5 font-medium"
              >
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </motion.div>
            )}
            
            {/* Email Field */}
            <div className="space-y-1.5 relative">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  name="email"
                  className="w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-2xl focus:border-[#026E40] focus:ring-4 focus:ring-[#026E40]/20 outline-none transition-all text-white placeholder:text-gray-600 text-sm font-medium"
                  placeholder="admin@sekolah.id"
                  required
                />
              </div>
            </div>
            
            {/* Password Field */}
            <div className="space-y-1.5 relative">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full pl-11 pr-11 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-2xl focus:border-[#026E40] focus:ring-4 focus:ring-[#026E40]/20 outline-none transition-all text-white placeholder:text-gray-600 text-sm font-medium"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
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
              className="w-full mt-4 py-4 bg-gradient-to-r from-[#026E40] to-[#038c52] text-white rounded-2xl font-semibold hover:from-[#038c52] hover:to-[#026E40] transition-all duration-300 shadow-[0_8px_25px_-5px_rgba(2,110,64,0.4)] hover:shadow-[0_12px_30px_-5px_rgba(2,110,64,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
