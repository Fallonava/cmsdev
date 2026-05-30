"use client";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HeroFloating({ badge, title, subtitle, cta1, cta2, heroUrl, isVideo }: any) {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center p-4 sm:p-8 pt-24 overflow-hidden">
      {/* Background Image Deep Blur */}
      <div className="absolute inset-0 w-full h-full">
        {isVideo(heroUrl) ? (
          <video src={heroUrl} autoPlay loop muted playsInline className="w-full h-full object-cover scale-110 blur-3xl opacity-60" />
        ) : (
          <Image src={heroUrl} alt="Hero BG" fill sizes="100vw" className="object-cover scale-110 blur-3xl opacity-60" priority />
        )}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>
      
      {/* Floating Island Container */}
      <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-5xl bg-white/80 backdrop-blur-3xl rounded-[3rem] sm:rounded-[4rem] p-8 sm:p-16 lg:p-24 border border-white shadow-[0_40px_100px_rgba(0,0,0,0.1)] flex flex-col items-center text-center overflow-hidden">
        
        {/* Subtle mesh gradient inside island */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"></div>
        
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-primary font-bold text-sm w-fit border border-gray-100 shadow-sm mb-8 relative z-10">
          <Sparkles size={16} className="text-amber-400" />
          {badge}
        </div>
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-6 relative z-10 max-w-4xl">
          {title}
        </h1>
        
        <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed font-medium max-w-2xl mb-12 relative z-10">
          {subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
          <Link href="/ppdb" className="flex items-center justify-center gap-2 w-full sm:w-auto px-10 py-5 rounded-full text-xl font-bold bg-gray-900 text-white hover:bg-black hover:scale-105 hover:shadow-xl transition-all duration-300">
            {cta1} <ArrowRight size={22} />
          </Link>
          <Link href="/profil" className="flex items-center justify-center gap-2 w-full sm:w-auto px-10 py-5 rounded-full text-xl font-bold bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:scale-105 shadow-sm transition-all duration-300">
             {cta2}
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
