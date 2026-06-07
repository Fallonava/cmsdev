"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Users, Trophy, ChevronRight, CheckCircle2, MonitorPlay, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: <MonitorPlay size={28} />,
      title: "Digitalisasi Penuh",
      description: "Dari absen hingga e-rapor, semua terekam rapi di *cloud*. Orang tua bisa memantau perkembangan anak kapan saja.",
      color: "from-blue-400 to-blue-600",
      bg: "bg-blue-50"
    },
    {
      icon: <Users size={28} />,
      title: "Tenaga Pendidik Unggul",
      description: "Guru tersertifikasi yang fokus pada pengembangan karakter serta bakat alami tiap peserta didik.",
      color: "from-orange-400 to-orange-600",
      bg: "bg-orange-50"
    },
    {
      icon: <Trophy size={28} />,
      title: "Fasilitas Berstandar",
      description: "Laboratorium sains, perpustakaan digital, dan lapangan olahraga yang nyaman untuk memaksimalkan potensi.",
      color: "from-emerald-400 to-emerald-600",
      bg: "bg-emerald-50"
    }
  ];

  return (
    <main className="flex flex-col min-h-screen bg-[#fbfbfd] overflow-hidden selection:bg-blue-200">
      
      {/* 1. HERO SECTION (Apple Style) */}
      <section className="relative w-full pt-32 lg:pt-48 pb-20 px-4 sm:px-6 z-10 flex flex-col items-center text-center">
        {/* Abstract Glow Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-300/30 via-purple-300/30 to-rose-300/30 blur-[120px] rounded-full -z-10 animate-pulse-slow"></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md text-gray-700 font-bold text-xs sm:text-sm shadow-sm border border-gray-200/50 mb-8 mx-auto hover:bg-white transition-colors cursor-pointer">
            <Sparkles size={16} className="text-blue-500" />
            <span className="tracking-wide">Penerimaan Siswa Baru 2026 Dibuka</span>
            <ChevronRight size={14} className="text-gray-400" />
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-extrabold text-gray-900 tracking-[-0.04em] leading-[1.05] mb-8">
            Masa depan <br className="hidden sm:block" />
            dimulai di sini.
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed mb-12">
            SMP Negeri 1 Fallonava mengintegrasikan teknologi modern dengan pendidikan karakter untuk melahirkan generasi emas masa depan.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/ppdb" className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-[17px] hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 shadow-[0_8px_24px_rgba(0,0,0,0.15)] flex items-center justify-center gap-2">
              Daftar Sekarang <ArrowRight size={18} />
            </Link>
            <Link href="#program" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-[17px] hover:bg-gray-50 transition-all border border-gray-200/60 shadow-sm flex items-center justify-center">
              Lihat Program Kami
            </Link>
          </div>
        </motion.div>
      </section>


      {/* 2. STATISTIK (Minimalist) */}
      <section className="py-16 px-4 bg-white/50 backdrop-blur-xl border-y border-gray-100 relative z-20">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="px-4">
            <h4 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">A</h4>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Akreditasi</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="px-4">
            <h4 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">30+</h4>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Guru Ahli</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="px-4">
            <h4 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">12</h4>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Ekskul</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="px-4">
            <h4 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">100%</h4>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Lulusan Sukses</p>
          </motion.div>
        </div>
      </section>

      {/* 3. FITUR / PROGRAM (Glassmorphism Cards) */}
      <section id="program" className="py-32 px-4 sm:px-6 max-w-6xl mx-auto w-full relative z-20">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-[-0.03em] mb-4">Pendidikan yang berpusat<br/>pada siswa.</h2>
          <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">Sistem yang dirancang tidak hanya untuk sekadar belajar, tetapi untuk bertumbuh.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {features.map((f, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              onMouseEnter={() => setHoveredFeature(idx)}
              onMouseLeave={() => setHoveredFeature(null)}
              className="group relative bg-white/60 backdrop-blur-2xl rounded-[2rem] p-8 border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1"
            >
              {/* Subtle background glow on hover */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500 rounded-full`}></div>
              
              <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110`}>
                <div className={`bg-gradient-to-br ${f.color} bg-clip-text text-transparent`}>
                  {f.icon}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">{f.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">{f.description}</p>
              
              <div className="mt-8 flex items-center gap-2 text-[15px] font-bold text-gray-900 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                Pelajari lebih lanjut <ChevronRight size={16} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. CTA BANNER */}
      <section className="py-24 px-4 sm:px-6 w-full relative">
        <div className="max-w-5xl mx-auto bg-gray-900 rounded-[3rem] p-12 sm:p-20 text-center relative overflow-hidden shadow-2xl">
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/20 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3"></div>
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative z-10">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-[-0.03em] mb-6">Siap menjadi bagian dari kami?</h2>
            <p className="text-xl text-gray-400 font-medium max-w-xl mx-auto mb-10">Pendaftaran gelombang pertama masih dibuka dengan kuota terbatas. Jangan lewatkan kesempatan emas ini.</p>
            
            <Link href="/ppdb" className="inline-flex items-center gap-2 px-10 py-5 bg-white text-gray-900 rounded-full font-bold text-[17px] hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
              Mulai Pendaftaran <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
