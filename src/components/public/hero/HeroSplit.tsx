"use client";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HeroSplit({ badge, title, subtitle, cta1, cta2, heroUrl, isVideo }: any) {
  return (
    <section className="relative w-full min-h-[100vh] lg:min-h-screen flex flex-col lg:flex-row overflow-hidden bg-white">
      {/* Left Content */}
      <div className="flex-1 w-full lg:w-1/2 flex items-center justify-center pt-32 pb-16 px-6 lg:px-16 2xl:px-24 z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-8 w-full max-w-xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 text-gray-500 font-bold text-sm w-fit border border-gray-100">
            {badge}
          </div>
          <div className="flex flex-col gap-5">
            <h1 className="text-5xl sm:text-6xl lg:text-[5rem] font-extrabold text-gray-900 leading-[1.05] tracking-tighter">
              {title}
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 leading-relaxed font-medium mt-2">{subtitle}</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
            <Link href="/ppdb" className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full text-lg font-bold bg-gray-900 text-white hover:bg-black transition-all duration-300">
              {cta1}
            </Link>
            <Link href="/profil" className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full text-lg font-bold bg-transparent text-gray-900 hover:bg-gray-50 transition-all duration-300">
              {cta2} <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>
      </div>
      
      {/* Right Media */}
      <div className="flex-1 w-full lg:w-1/2 relative min-h-[50vh] lg:min-h-screen">
        <motion.div initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: "easeOut" }} className="absolute inset-0 w-full h-full">
          {isVideo(heroUrl) ? (
            <video src={heroUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
          ) : (
            <Image src={heroUrl} alt="Hero" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" priority />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent lg:w-1/3"></div>
        </motion.div>
        
        {/* Floating element overlapping edge */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8, duration: 0.8 }}
          className="absolute bottom-10 -left-10 lg:-left-20 bg-white/70 backdrop-blur-2xl p-5 rounded-3xl border border-white shadow-2xl hidden md:flex items-center gap-4 z-20">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <Star size={24} className="fill-primary" />
          </div>
          <div>
            <p className="font-extrabold text-gray-900 text-lg">Pilihan Utama</p>
            <p className="text-gray-600 font-medium text-sm">Orang Tua & Siswa</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
