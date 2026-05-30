"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HeroFilmstrip({ badge, title, subtitle, cta1, cta2, galleryPhotos }: any) {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-16 overflow-hidden bg-white">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        className="container mx-auto w-full max-w-4xl text-center px-4 flex flex-col items-center gap-6 z-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 text-white font-bold text-sm">
          {badge}
        </div>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 leading-[1.05] tracking-tight">
          {title}
        </h1>
        <p className="text-xl text-gray-500 font-medium max-w-2xl mb-4">{subtitle}</p>
        <Link href="/ppdb" className="flex items-center justify-center gap-2 px-10 py-4 rounded-full text-lg font-bold bg-primary text-white hover:bg-primary-dark transition-all shadow-md">
          {cta1} <ArrowRight size={20} />
        </Link>
      </motion.div>
      
      {/* Infinite Filmstrip */}
      <div className="relative w-full mt-16 flex overflow-hidden group">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
        
        <motion.div animate={{ x: [0, -1000] }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex gap-4 px-4 whitespace-nowrap will-change-transform">
          {[...galleryPhotos, ...galleryPhotos, ...galleryPhotos].map((photo: any, i: number) => (
            <div key={i} className="relative w-64 h-48 md:w-80 md:h-60 rounded-3xl overflow-hidden shadow-md shrink-0 border border-gray-100">
              <Image src={photo.src || photo.url || ""} alt="Gallery" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
