"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function HeroImmersive({ badge, title, subtitle, cta1, cta2, heroUrl, isVideo }: any) {
  return (
    <section className="relative w-full h-screen flex items-end justify-center p-4 sm:p-8 overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        {isVideo(heroUrl) ? (
          <video src={heroUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
        ) : (
          <Image src={heroUrl} alt="Hero BG" fill sizes="100vw" className="object-cover" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
      </div>
      
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}
        className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row items-end justify-between gap-8 pb-10">
        <div className="flex-1 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-md text-white font-bold text-sm w-fit border border-white/30">
            {badge}
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight tracking-tight">
            {title}
          </h1>
        </div>
        <div className="w-full md:w-[40%] flex flex-col gap-6">
          <p className="text-lg text-gray-200 font-medium leading-relaxed">
            {subtitle}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/ppdb" className="px-8 py-4 rounded-full text-lg font-bold bg-white text-black hover:bg-gray-100 transition-all">
              {cta1}
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
