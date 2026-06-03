"use client";

import * as React from "react";
import { doLogin } from "@/actions/auth";

export default function LoginPage() {
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    try {
      const result = await doLogin(formData);
      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      }
    } catch (err: any) {
      // doLogin throws redirect on success, which is normal in Next.js
      // We must re-throw it so Next.js can actually redirect the user!
      if (err?.message?.includes("NEXT_REDIRECT") || err?.digest?.startsWith("NEXT_REDIRECT")) {
        throw err;
      }
      setIsLoading(false);
      setError("Terjadi kesalahan sistem. Silakan coba lagi.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#f0f0f5]">
      {/* Soft Animated Apple-like Mesh Gradient Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-gradient-to-tr from-primary/30 to-blue-300/40 blur-[100px] opacity-70 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[70%] rounded-full bg-gradient-to-bl from-yellow-300/40 to-primary/20 blur-[120px] opacity-80 animate-pulse delay-700"></div>
      
      {/* The Login Card - Glassmorphism */}
      <div className="relative z-10 w-full max-w-[400px] p-8 sm:p-10 rounded-[2.5rem] bg-white/60 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-white/60">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-primary to-primary-dark rounded-[1.25rem] flex items-center justify-center text-white font-bold text-2xl mb-5 shadow-[0_8px_16px_rgba(2,110,64,0.3)]">
            M
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin CMS</h1>
          <p className="text-gray-500 text-sm mt-2">MTs Muhammadiyah 07 Purbalingga</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-500/10 backdrop-blur-md text-red-600 p-3 rounded-2xl text-sm text-center border border-red-500/10 font-medium">
              {error}
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider ml-1">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-5 py-3.5 bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all text-gray-900 placeholder:text-gray-400 font-medium"
              placeholder="admin@sekolah.id"
              required
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider ml-1">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-5 py-3.5 bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all text-gray-900 placeholder:text-gray-400 font-medium"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-4 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-black transition-all shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] hover:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? "Memeriksa..." : "Masuk ke Sistem"}
          </button>
        </form>
      </div>
    </div>
  );
}
