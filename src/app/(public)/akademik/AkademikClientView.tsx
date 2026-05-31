"use client";

import { motion } from "framer-motion";
import { BookOpen, Laptop, Microscope, Star } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { AkademikSettings } from "@/actions/akademikSettings";
import DynamicIcon from "@/components/DynamicIcon";

type Extracurricular = {
  id: string;
  name: string;
  description: string;
  schedule: string | null;
  coach: string | null;
  photoUrl: string | null;
  order: number;
};

export default function AkademikClientView({ settings, ekskuls }: { settings: AkademikSettings, ekskuls: Extracurricular[] }) {
  return (
    <main className="flex flex-col min-h-screen bg-[#fbfbfd] overflow-hidden">
      
      {/* 1. Hero Akademik */}
      <section className="relative w-full pt-40 pb-20 px-4 sm:px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-[#fbfbfd] to-[#fbfbfd] z-0 pointer-events-none"></div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="container mx-auto max-w-5xl relative z-10 text-center flex flex-col items-center gap-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-600 font-bold text-xs sm:text-sm shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Sistem Akademik Terpadu
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-[5rem] font-extrabold text-gray-900 leading-[1.05] tracking-tighter whitespace-pre-line">
            {settings.akademik_hero_title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-3xl mt-4 leading-relaxed whitespace-pre-line">
            {settings.akademik_hero_desc}
          </p>
        </motion.div>
      </section>

      {/* 2. Program Tahfidz Unggulan (Oversized Hero Card) */}
      <section className="py-12 px-4 sm:px-6 relative z-10">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="w-full bg-gray-900 rounded-[3rem] sm:rounded-[4rem] p-10 sm:p-20 overflow-hidden relative shadow-[0_32px_64px_rgba(0,0,0,0.2)] flex flex-col md:flex-row items-center gap-16 group border border-gray-800"
          >
            {/* Dark texture background */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] pointer-events-none"></div>
            
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-secondary/20 transition-colors duration-1000"></div>

            <div className="w-full md:w-1/2 flex flex-col gap-6 relative z-10">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-secondary border border-white/20 mb-2">
                <Star size={32} />
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight whitespace-pre-line">
                {settings.akademik_tahfidz_title}
              </h2>
              <p className="text-xl text-gray-400 leading-relaxed font-medium whitespace-pre-line">
                {settings.akademik_tahfidz_desc}
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <span className="px-4 py-2 rounded-full bg-white/10 text-white font-bold text-sm backdrop-blur-md border border-white/10">Target 5 Juz</span>
                <span className="px-4 py-2 rounded-full bg-white/10 text-white font-bold text-sm backdrop-blur-md border border-white/10">Camp Tahfidz</span>
                <span className="px-4 py-2 rounded-full bg-white/10 text-white font-bold text-sm backdrop-blur-md border border-white/10">Sertifikasi</span>
              </div>
            </div>

            <div className="w-full md:w-1/2 relative aspect-square md:aspect-[4/5] rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 group-hover:scale-105 transition-transform duration-700">
               {/* Decorative Placeholder for Quran/Tahfidz Photo */}
               <div className="absolute inset-0 bg-gradient-to-tr from-gray-800 to-gray-700"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <BookOpen size={100} className="text-white/10" />
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Kurikulum & Pembelajaran (Bento Grid) */}
      <section className="py-24 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Struktur Pembelajaran</h2>
            <p className="text-xl text-gray-500 font-medium">Dirancang adaptif dengan tuntutan zaman.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
            {/* Card 1 */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="md:col-span-2 bg-white rounded-[3rem] p-10 sm:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute right-0 bottom-0 w-64 h-64 bg-blue-50 rounded-full blur-[80px] group-hover:bg-blue-100 transition-colors"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Laptop size={28} />
                </div>
                <h3 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">KBM Berbasis Digital</h3>
                <p className="text-gray-500 text-lg font-medium max-w-md leading-relaxed whitespace-pre-line">
                  {settings.akademik_kbm_desc}
                </p>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-primary rounded-[3rem] p-10 sm:p-12 shadow-[0_16px_32px_rgba(2,110,64,0.15)] flex flex-col justify-between text-white relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                  <BookOpen size={28} />
                </div>
                <h3 className="text-2xl font-extrabold mb-3 tracking-tight">Ismuba</h3>
                <p className="text-primary-light font-medium leading-relaxed whitespace-pre-line">
                  {settings.akademik_ismuba_desc}
                </p>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-[3rem] p-10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col items-center justify-center text-center gap-4 group"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-900 group-hover:bg-gray-900 group-hover:text-white transition-colors duration-500">
                <Microscope size={36} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">Sains Terapan</h3>
            </motion.div>

            {/* Card 4 */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="md:col-span-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-[3rem] p-10 sm:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-gray-200 flex flex-col justify-center relative overflow-hidden"
            >
              <div className="relative z-10">
                <h3 className="text-3xl font-extrabold text-gray-900 mb-6 tracking-tight">Ekstrakurikuler Pilihan</h3>
                <div className="flex flex-wrap gap-4">
                  {ekskuls.length > 0 ? ekskuls.map((eks, i) => (
                    <div key={i} className="flex items-center gap-2 px-5 py-3 rounded-full bg-white text-gray-800 font-bold shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform cursor-default">
                      {eks.photoUrl ? (
                        <DynamicIcon name={eks.photoUrl} size={18} className="text-primary" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      )}
                      {eks.name}
                    </div>
                  )) : (
                    <p className="text-gray-500 font-medium">Belum ada ekstrakurikuler yang ditambahkan.</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </main>
  );
}
