"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HeroCascading({ badge, title, subtitle, cta1, cta2, heroUrl, facilityUrl, principalUrl, isVideo }: any) {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center py-24 px-4 sm:px-8 bg-[#f8f9fa] overflow-hidden">
      <div className="container mx-auto w-full max-w-7xl flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
        
        {/* Left Text */}
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
          className="flex-1 w-full flex flex-col gap-8 z-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm text-gray-900 font-bold text-sm w-fit border border-gray-100">
            {badge}
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 leading-[1.05] tracking-tight">
            {title}
          </h1>
          <p className="text-xl text-gray-500 font-medium max-w-lg leading-relaxed">{subtitle}</p>
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Link href="/ppdb" className="flex items-center justify-center gap-2 px-8 py-4 rounded-full text-lg font-bold bg-primary text-white hover:bg-primary-dark transition-all shadow-lg shadow-primary/30">
              {cta1} <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>
        
        {/* Right Cascading Cards */}
        <div className="flex-1 w-full relative h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center z-10 group">
          <motion.div initial={{ opacity: 0, y: 50, rotate: -15 }} animate={{ opacity: 1, y: 0, rotate: -10 }} transition={{ duration: 1, delay: 0.2 }}
            className="absolute w-[60%] aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gray-100 -left-4 md:left-4 z-10 group-hover:-translate-x-8 transition-transform duration-500">
            <Image src={facilityUrl} alt="Card 1" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 50, rotate: 0 }} animate={{ opacity: 1, y: 0, rotate: 5 }} transition={{ duration: 1, delay: 0.4 }}
            className="absolute w-[65%] aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gray-200 z-20 group-hover:-translate-y-8 transition-transform duration-500">
            {isVideo(heroUrl) ? (
              <video src={heroUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
            ) : (
              <Image src={heroUrl} alt="Card 2" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" priority />
            )}
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 50, rotate: 15 }} animate={{ opacity: 1, y: 0, rotate: 15 }} transition={{ duration: 1, delay: 0.6 }}
            className="absolute w-[50%] aspect-square rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-gray-300 right-0 md:right-10 bottom-0 z-30 group-hover:translate-x-8 transition-transform duration-500">
            <Image src={principalUrl} alt="Card 3" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
          </motion.div>
        </div>
        
      </div>
    </section>
  );
}
