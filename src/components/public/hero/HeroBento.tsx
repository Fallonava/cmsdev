"use client";
import { motion } from "framer-motion";
import { ArrowRight, Play, Trophy } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HeroBento({ badge, title, subtitle, cta1, cta2, heroUrl, isVideo, facilityUrl, principalUrl }: any) {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center pt-28 pb-16 px-4 sm:px-8">
      <div className="container mx-auto w-full max-w-7xl flex flex-col md:flex-row items-center gap-10 md:gap-12 lg:gap-20">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 w-full flex flex-col gap-6 lg:gap-8 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 font-bold text-sm w-fit border border-gray-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {badge}
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl sm:text-5xl md:text-4xl lg:text-[4.5rem] font-extrabold text-gray-900 leading-[1.1] tracking-tighter">
              {title.split(",")[0]}{title.includes(",") && ","} <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-600">
                {title.split(",").slice(1).join(",") || " "}
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 leading-relaxed font-medium max-w-xl">{subtitle}</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
            <Link href="/ppdb" className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full text-lg font-bold bg-gray-900 text-white hover:bg-black hover:scale-105 hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all duration-300">
              {cta1} <ArrowRight size={20} />
            </Link>
            <Link href="/profil" className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full text-lg font-bold bg-white text-gray-900 hover:bg-gray-50 border border-gray-200 hover:scale-105 shadow-sm transition-all duration-300">
              <Play size={20} className="fill-gray-900" /> {cta2}
            </Link>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 w-full max-w-lg lg:max-w-none relative aspect-[4/3] lg:aspect-square rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.08)] border border-gray-100 bg-gray-50 shrink-0">
          <motion.div animate={{ scale: [1, 1.15, 1], x: [0, -20, 0] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-[120%] h-[120%] -left-[10%] -top-[10%]">
            {isVideo(heroUrl) ? (
              <video src={heroUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
            ) : (
              <Image src={heroUrl} alt="Hero" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" priority />
            )}
          </motion.div>
          <div className="absolute inset-0 rounded-[2rem] lg:rounded-[3rem] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4)] pointer-events-none z-10"></div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }}
            className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto bg-white/80 backdrop-blur-xl p-3 sm:p-4 lg:p-6 rounded-2xl lg:rounded-3xl flex items-center gap-3 sm:gap-4 border border-white/50 shadow-[0_16px_32px_rgba(0,0,0,0.1)] z-20">
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-secondary/20 rounded-xl sm:rounded-[1rem] lg:rounded-[1.25rem] flex items-center justify-center text-secondary-dark shrink-0">
              <Trophy size={24} className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
            </div>
            <div className="flex flex-col">
              <p className="font-extrabold text-gray-900 text-base sm:text-lg lg:text-xl leading-tight">Akreditasi A</p>
              <p className="text-gray-500 font-medium text-xs sm:text-sm lg:text-base">Institusi Terpercaya</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
