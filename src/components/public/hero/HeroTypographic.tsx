"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function HeroTypographic({ badge, title, subtitle, cta1, cta2, heroUrl, isVideo }: any) {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 pt-24 bg-white overflow-hidden">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
        className="w-full max-w-7xl flex flex-col items-center text-center z-10">
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-gray-200 bg-gray-50 text-gray-900 font-bold text-sm mb-12">
          {badge}
        </div>
        
        {/* Dynamic Masking Text */}
        <div className="relative w-full mb-10 overflow-hidden rounded-[2rem] lg:rounded-[4rem] aspect-[21/9] bg-gray-100 flex items-center justify-center group">
          <div className="absolute inset-0 w-full h-full">
            {isVideo(heroUrl) ? (
              <video src={heroUrl} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000" />
            ) : (
              <Image src={heroUrl} alt="Hero" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000" priority />
            )}
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          
          <h1 className="relative z-10 text-[8vw] md:text-[6vw] font-black text-white leading-none tracking-tighter uppercase mix-blend-overlay px-4">
            {title.split(",")[0] || title}
          </h1>
        </div>
        
        <p className="text-xl sm:text-2xl text-gray-500 font-medium max-w-3xl mb-12">
          {subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/ppdb" className="flex items-center justify-center px-10 py-5 rounded-full text-lg font-bold bg-gray-900 text-white hover:bg-black transition-all">
            {cta1}
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
