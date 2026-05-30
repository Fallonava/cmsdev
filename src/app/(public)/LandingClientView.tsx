"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BookOpen, GraduationCap, Users, Trophy, ChevronRight, Play, Star, Quote, Award, Zap, Clock, CheckCircle, MapPin, Medal, BookMarked, Cpu, Music, Shield, ChevronDown, Calendar, Plus, Minus, ImageIcon, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import DynamicIcon from "@/components/DynamicIcon";
import { getPublishedBerita } from "@/actions/berita";
import dynamic from 'next/dynamic';

const HeroBento = dynamic(() => import('@/components/public/hero/HeroBento'));
const HeroSplit = dynamic(() => import('@/components/public/hero/HeroSplit'));
const HeroFloating = dynamic(() => import('@/components/public/hero/HeroFloating'));
const HeroTypographic = dynamic(() => import('@/components/public/hero/HeroTypographic'));
const HeroCascading = dynamic(() => import('@/components/public/hero/HeroCascading'));
const HeroImmersive = dynamic(() => import('@/components/public/hero/HeroImmersive'));
const HeroFilmstrip = dynamic(() => import('@/components/public/hero/HeroFilmstrip'));

// ─── FAQ ITEM ────────────────────────────────────────────────────────────
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className={`bg-white rounded-[1.5rem] border transition-all duration-300 overflow-hidden ${
        open ? "border-primary/30 shadow-[0_8px_30px_rgba(2,110,64,0.08)]" : "border-gray-100 shadow-sm hover:border-gray-200"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-6 text-left"
      >
        <span className="font-bold text-gray-900 text-base leading-snug">{q}</span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
          open ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
        }`}>
          {open ? <Minus size={16} /> : <Plus size={16} />}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6">
              <div className="pt-4 border-t border-gray-100">
                <p className="text-gray-600 leading-relaxed font-medium">{a}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── COUNTDOWN HOOK ────────────────────────────────────────────────────
function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function calc() {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  return timeLeft;
}

// TESTIMONIALS & ACHIEVEMENTS REMOVED (Moved to dynamic fallback inside Home)

// ─── COMPONENTS ─────────────────────────────────────────────────────────
function CountdownBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-white/10 backdrop-blur-md rounded-[1.5rem] border border-white/20 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
          <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tabular-nums">
            {String(value).padStart(2, "0")}
          </span>
        </div>
      </div>
      <span className="text-xs sm:text-sm font-bold text-white/60 uppercase tracking-widest">{label}</span>
    </div>
  );
}

function TestimonialCard({ t }: { t: any }) {
  const rating = t.rating || 5;
  const quote = t.quote || t.text;
  const author = t.author || t.name;
  const role = t.role;
  const avatar = t.avatarUrl ? <Image src={t.avatarUrl} alt={author} width={48} height={48} className="rounded-full object-cover w-full h-full" /> : (t.avatar || author.charAt(0));

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-200 flex flex-col gap-6 h-full hover:shadow-md hover:border-gray-300 hover:-translate-y-1 transition-all duration-500">
      <div className="flex gap-1">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
        ))}
      </div>
      <Quote size={28} className="text-primary/20 -mb-2" />
      <p className="text-gray-700 text-base leading-relaxed font-medium flex-1">"{quote}"</p>
      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-green-400 flex items-center justify-center text-white font-extrabold text-base shrink-0 overflow-hidden">
          {avatar}
        </div>
        <div>
          <p className="font-extrabold text-gray-900 text-sm">{author}</p>
          <p className="text-gray-500 text-xs font-medium">{role}</p>
        </div>
      </div>
    </div>
  );
}

function RecentBeritaList() {
  const [posts, setPosts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getPublishedBerita(3).then(data => { setPosts(data); setLoading(false); });
  }, []);

  if (loading) return <div className="text-center py-24 text-gray-400 font-bold text-lg animate-pulse">Memuat berita...</div>;
  if (posts.length === 0) return (
    <div className="bg-white rounded-[3rem] p-16 text-center shadow-sm border border-gray-100">
      <p className="text-xl font-bold text-gray-400">Belum ada berita yang dipublikasikan.</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {posts.map((post) => (
        <Link href={`/berita/${post.slug}`} key={post.id} className="group outline-none">
          <div className="bg-white/80 backdrop-blur-2xl rounded-[2rem] shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 h-full flex flex-col overflow-hidden">
            <div className="h-52 bg-gray-50 w-full overflow-hidden relative">
              {post.imageUrl ? (
                <Image src={post.imageUrl} alt={post.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                  <BookOpen size={40} className="text-gray-300" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className="flex gap-2 mb-3">
                <span className="px-3 py-1 bg-gray-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest">Berita</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-bold">
                  {new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </span>
              </div>
              <h3 className="font-extrabold text-xl text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-tight tracking-tight">{post.title}</h3>
              <p className="text-gray-500 font-medium text-sm line-clamp-2 mb-5 flex-1">{post.content.replace(/[#*>`\-]/g, '').substring(0, 120)}...</p>
              <div className="flex items-center gap-1 text-gray-900 font-bold text-sm mt-auto group-hover:gap-2 transition-all">
                Baca Selengkapnya <ChevronRight size={16} />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────
export default function LandingClientView({ dynamicData, settings, media }: any) {

  const activePrograms = dynamicData?.programs?.length ? dynamicData.programs : [];
  const activeAchievements = dynamicData?.achievements?.length ? dynamicData.achievements : [];
  const activeEvents = dynamicData?.events?.length ? dynamicData.events : [];
  const activeFaqs = dynamicData?.faqs?.length ? dynamicData.faqs : [];
  const activeTestimonials = dynamicData?.testimonials?.length ? dynamicData.testimonials : [];
  
  const fallbackGallery = [
    { src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80", alt: "Kelas Interaktif", tall: true },
    { src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80", alt: "Kegiatan Belajar", tall: false },
    { src: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&q=80", alt: "Olimpiade Sains", tall: false },
    { src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80", alt: "Upacara Bendera", tall: true },
    { src: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&q=80", alt: "Ekskul Seni", tall: false },
    { src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80", alt: "Wisuda Tahfidz", tall: false },
  ];
  const activeGallery = dynamicData?.galleryPhotos?.length ? dynamicData.galleryPhotos : fallbackGallery;

  const fallbackPartners = [
    { name: "Kemendikbud RI", abbr: "KE", color: "from-blue-500 to-blue-700" },
    { name: "Muhammadiyah", abbr: "MU", color: "from-primary to-green-600" },
    { name: "Kemenag RI", abbr: "KA", color: "from-emerald-500 to-teal-600" },
    { name: "BAN S/M", abbr: "BS", color: "from-purple-500 to-indigo-600" },
    { name: "Dinas Pendidikan", abbr: "DP", color: "from-orange-500 to-amber-600" },
    { name: "BPSDM Jateng", abbr: "BP", color: "from-cyan-500 to-blue-500" },
    { name: "Universitas Ahmad Dahlan", abbr: "UA", color: "from-rose-500 to-pink-600" },
    { name: "LPTK Muhammadiyah", abbr: "LP", color: "from-amber-500 to-orange-500" },
    { name: "Dikdasmen PWM", abbr: "DK", color: "from-teal-500 to-green-600" },
    { name: "Yayasan Muhammadiyah", abbr: "YM", color: "from-indigo-500 to-purple-600" },
  ];
  const activePartners = dynamicData?.partners?.length ? dynamicData.partners : fallbackPartners;
  const partnerRow1 = activePartners.slice(0, Math.ceil(activePartners.length / 2));
  const partnerRow2 = activePartners.slice(Math.ceil(activePartners.length / 2));

  const badge   = settings?.hero?.badge     || "Tahun Ajaran 2026/2027";
  const title   = settings?.hero?.title     || "Pendidikan Islami, \nStandar Global.";
  const subtitle = settings?.hero?.subtitle || "MTs Muhammadiyah 07 Purbalingga merancang ekosistem pembelajaran modern yang memadukan keunggulan teknologi digital dengan penanaman akhlak mulia.";
  const cta1    = settings?.hero?.cta1_text || "Mulai Pendaftaran";
  const cta2    = settings?.hero?.cta2_text || "Profil Sekolah";
  const statsTitle    = settings?.stats?.title    || "Lebih dari sekadar sekolah.";
  const statsSubtitle = settings?.stats?.subtitle || "Kami merancang ekosistem pembelajaran yang menginspirasi.";
  const stat1Value    = settings?.stats?.stat1_value || "500+";
  const stat1Label    = settings?.stats?.stat1_label || "Siswa Aktif";
  const stat2Value    = settings?.stats?.stat2_value || "45+";
  const stat2Label    = settings?.stats?.stat2_label || "Guru Profesional";
  const stat3Value    = settings?.stats?.stat3_value || "A";
  const stat3Label    = settings?.stats?.stat3_label || "Terakreditasi";
  const ppdbTitle     = settings?.stats?.ppdb_title || "Daftar PPDB\n2026/2027";
  const ppdbDesc      = settings?.stats?.ppdb_desc || "Kuota terbatas. Segera daftarkan putra-putri Anda.";
  const prestasiTitle = settings?.stats?.prestasi_title || "Prestasi Nasional";
  const prestasiDesc  = settings?.stats?.prestasi_desc || "Ratusan penghargaan tingkat kabupaten hingga nasional.";
  const prestasiBadges = dynamicData?.achievements?.slice(0, 3) || [];
  const featImgTitle  = settings?.features?.image_title || "Fasilitas Modern";
  const featImgDesc   = settings?.features?.image_desc  || "Lingkungan asri yang mendukung proses KBM berbasis teknologi digital.";
  const featExtTitle  = settings?.features?.extra_title || "Program Tahfidz Unggulan";
  const featExtDesc   = settings?.features?.extra_desc  || "Mencetak generasi penghafal Al-Qur'an dengan metode pembelajaran modern.";
  const headName = settings?.headmaster?.name    || "Bapak Fulan, S.Pd., M.Pd.";
  const headRole = settings?.headmaster?.role    || "Kepala Sekolah";
  const headMsg  = settings?.headmaster?.message || "\"Kami terus berinovasi mengintegrasikan nilai-nilai Islam dengan ilmu pengetahuan modern.\"";
  const heroUrl      = media?.heroUrl      || "/images/hero_cinematic.png";
  const facilityUrl  = media?.facilityUrl  || "/images/school_building.png";
  const principalUrl = media?.principalUrl || "/images/principal_portrait.png";
  const isVideo = (url: string) => url?.match(/\.(mp4|webm)$/i);

  // PPDB countdown target — adjust as needed
  const countdown = useCountdown("2026-07-01T00:00:00");

  const heroStyle = settings?.hero?.heroStyle || "bento";
  const heroProps = { badge, title, subtitle, cta1, cta2, heroUrl, facilityUrl, principalUrl, isVideo, galleryPhotos: activeGallery };

  return (
    <main className="flex flex-col bg-[#fbfbfd] overflow-hidden">

      {/* ── 1. HERO (DYNAMIC STYLE) */}
      {heroStyle === "bento" && <HeroBento {...heroProps} />}
      {heroStyle === "split" && <HeroSplit {...heroProps} />}
      {heroStyle === "floating" && <HeroFloating {...heroProps} />}
      {heroStyle === "typographic" && <HeroTypographic {...heroProps} />}
      {heroStyle === "cascading" && <HeroCascading {...heroProps} />}
      {heroStyle === "immersive" && <HeroImmersive {...heroProps} />}
      {heroStyle === "filmstrip" && <HeroFilmstrip {...heroProps} />}

      <div className="bg-[#fbfbfd] relative z-20 overflow-hidden pt-10">

        {/* ── 2. STATISTIK & BENTO GRID */}
        <section className="py-24 px-4 sm:px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16 flex flex-col items-center gap-4">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">{statsTitle}</h2>
              <p className="text-xl text-gray-500 font-medium max-w-2xl">{statsSubtitle}</p>
            </div>
            {/* ── Apple Modern 2026 Bento Grid ── */}
            <style dangerouslySetInnerHTML={{ __html: `
              @media (min-width: 768px) {
                .bento-grid-26 {
                  grid-template-columns: repeat(12, 1fr) !important;
                  grid-template-rows: minmax(340px, auto) minmax(280px, auto) minmax(320px, auto) !important;
                }
                .bento-grid-26 > *:nth-child(1) { grid-column: 1 / 9; grid-row: 1 / 2; }
                .bento-grid-26 > *:nth-child(2) { grid-column: 9 / 13; grid-row: 1 / 2; }
                .bento-grid-26 > *:nth-child(3) { grid-column: 1 / 4; grid-row: 2 / 3; }
                .bento-grid-26 > *:nth-child(4) { grid-column: 4 / 7; grid-row: 2 / 3; }
                .bento-grid-26 > *:nth-child(5) { grid-column: 7 / 13; grid-row: 2 / 3; }
                .bento-grid-26 > *:nth-child(6) { grid-column: 1 / 9; grid-row: 3 / 4; }
                .bento-grid-26 > *:nth-child(7) { grid-column: 9 / 13; grid-row: 3 / 4; }
              }
            ` }} />
            <div className="bento-grid-26 grid grid-cols-1 gap-5">

              {/* ── Row 1 ── */}

              {/* A: Fasilitas (hero — 8 cols, 1 row) */}
              <motion.div whileHover={{ scale: 1.015 }} transition={{ type: "spring", stiffness: 250, damping: 22 }}
                className="relative overflow-hidden group rounded-[2.5rem] shadow-[0_24px_48px_rgba(0,0,0,0.1)] bg-gray-100">
                <div className="absolute inset-0 transform group-hover:scale-105 transition-transform duration-[2s] ease-out">
                  {isVideo(facilityUrl) ? (
                    <video src={facilityUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                  ) : (
                    <Image src={facilityUrl} alt="Facility" fill sizes="(max-width: 768px) 100vw, 66vw" className="object-cover" />
                  )}
                </div>
                {/* Deep vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10"></div>
                <div className="absolute inset-0 rounded-[2.5rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] pointer-events-none z-10"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10 z-20">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-md rounded-full border border-white/20 text-white/90 text-xs font-bold tracking-widest uppercase mb-4">
                    Facility
                  </div>
                  <h3 className="text-4xl lg:text-5xl font-black text-white mb-3 tracking-tighter drop-shadow-lg">{featImgTitle}</h3>
                  <p className="text-white/75 text-base lg:text-lg font-medium max-w-md leading-relaxed line-clamp-2">{featImgDesc}</p>
                </div>
              </motion.div>

              {/* B: Siswa Aktif (4 cols, 1 row) */}
              <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 350, damping: 24 }}
                className="relative rounded-[2.5rem] p-8 flex flex-col justify-between overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.08)] bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/20 rounded-full blur-3xl mix-blend-overlay"></div>
                <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-yellow-300/25 rounded-full blur-2xl mix-blend-overlay"></div>
                <div className="absolute inset-0 rounded-[2.5rem] shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] pointer-events-none z-10"></div>

                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30 z-10">
                  <Users size={26} strokeWidth={2.5} />
                </div>
                <div className="z-10 mt-6">
                  <p className="text-6xl lg:text-7xl font-black text-white tracking-tighter leading-none drop-shadow-lg">{stat1Value}</p>
                  <p className="text-white/85 font-semibold text-lg mt-2">{stat1Label}</p>
                </div>
              </motion.div>

              {/* ── Row 2 ── */}

              {/* C: Akreditasi A (3 cols) */}
              <motion.div whileHover={{ scale: 1.04 }} transition={{ type: "spring", stiffness: 400, damping: 26 }}
                className="relative rounded-[2.5rem] p-8 flex flex-col justify-between overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.07)] bg-gradient-to-br from-amber-400 via-orange-500 to-red-500">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl mix-blend-overlay"></div>
                <div className="absolute bottom-0 right-0 w-28 h-28 bg-yellow-200/30 rounded-full blur-2xl mix-blend-overlay"></div>
                <div className="absolute inset-0 rounded-[2.5rem] shadow-[inset_0_1px_2px_rgba(255,255,255,0.65)] pointer-events-none z-10"></div>

                <div className="w-12 h-12 bg-white/25 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/40 z-10">
                  <Award size={24} strokeWidth={2.5} />
                </div>
                <div className="z-10 mt-6">
                  <p className="text-6xl lg:text-7xl font-black text-white tracking-tighter leading-none drop-shadow-lg">{stat3Value}</p>
                  <p className="text-white/85 font-semibold text-lg mt-2">{stat3Label}</p>
                </div>
              </motion.div>

              {/* D: Guru Profesional (3 cols) */}
              <motion.div whileHover={{ scale: 1.04 }} transition={{ type: "spring", stiffness: 400, damping: 26 }}
                className="relative bg-white rounded-[2.5rem] p-8 flex flex-col justify-between shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-gray-100/80 overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute inset-0 rounded-[2.5rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] pointer-events-none z-10"></div>

                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-md z-10">
                  <GraduationCap size={24} strokeWidth={2.5} />
                </div>
                <div className="z-10 mt-6">
                  <p className="text-6xl lg:text-7xl font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-500">{stat2Value}</p>
                  <p className="text-gray-500 font-semibold text-lg mt-2">{stat2Label}</p>
                </div>
              </motion.div>

              {/* E: Daftar PPDB (6 cols) */}
              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="relative rounded-[2.5rem] p-8 flex flex-col justify-between overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.1)] bg-gradient-to-br from-blue-600 via-indigo-700 to-violet-800">
                <div className="absolute -top-12 -right-12 w-52 h-52 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
                <div className="absolute bottom-0 left-0 w-36 h-36 bg-cyan-400/15 rounded-full blur-2xl mix-blend-overlay"></div>
                <div className="absolute inset-0 rounded-[2.5rem] shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)] pointer-events-none z-10"></div>

                <div className="z-10 flex items-start justify-between">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30">
                    <BookOpen size={24} strokeWidth={2.5} />
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-white/90 text-xs font-bold">
                    <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60"></span><span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span></span>
                    Pendaftaran Dibuka
                  </div>
                </div>
                <div className="z-10 mt-6 flex flex-col md:flex-row lg:flex-col xl:flex-row md:items-end lg:items-start xl:items-end justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-3xl lg:text-4xl font-black text-white tracking-tighter leading-tight whitespace-pre-line">{ppdbTitle}</p>
                    <p className="text-white/60 font-medium mt-1 text-sm lg:text-base line-clamp-2">{ppdbDesc}</p>
                  </div>
                  <Link href="/ppdb" className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-indigo-700 font-bold rounded-2xl text-sm hover:bg-indigo-50 hover:scale-105 transition-all shadow-lg whitespace-nowrap">
                    Mulai Sekarang <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>

              {/* ── Row 3 ── */}

              {/* F: Program Tahfidz (8 cols) */}
              <motion.div whileHover={{ scale: 1.015 }} transition={{ type: "spring", stiffness: 250, damping: 22 }}
                className="relative bg-[#07090c] rounded-[2.5rem] p-8 lg:p-10 flex flex-col md:flex-row items-center gap-8 shadow-[0_32px_64px_rgba(0,0,0,0.2)] overflow-hidden group">
                <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-primary/15 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="absolute inset-0 rounded-[2.5rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] pointer-events-none z-10"></div>

                <div className="relative z-10 flex flex-col gap-4 flex-1">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                    <Star size={22} strokeWidth={2} className="fill-primary-light text-primary-light" />
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-black text-white tracking-tighter leading-tight">{featExtTitle}</h3>
                  <p className="text-gray-400 text-sm lg:text-base font-medium max-w-lg leading-relaxed line-clamp-2">{featExtDesc}</p>
                </div>
                <Link href="/akademik" className="relative z-10 shrink-0 w-full md:w-auto px-8 py-4 rounded-full font-bold bg-white text-black hover:bg-gray-100 hover:scale-105 transition-all shadow-[0_12px_24px_rgba(255,255,255,0.08)] flex items-center justify-center gap-2 group-hover:shadow-[0_16px_32px_rgba(255,255,255,0.15)] text-sm">
                  Selengkapnya <ChevronRight size={20} />
                </Link>
              </motion.div>

              {/* G: Prestasi (4 cols) */}
              <motion.div whileHover={{ scale: 1.025 }} transition={{ type: "spring", stiffness: 350, damping: 24 }}
                className="relative bg-gradient-to-br from-gray-50 to-white rounded-[2.5rem] p-8 flex flex-col justify-between shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden group">
                <div className="absolute -top-8 -right-8 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute inset-0 rounded-[2.5rem] shadow-[inset_0_1px_1px_rgba(255,255,255,1)] pointer-events-none z-10"></div>

                <div className="z-10 flex flex-col gap-2 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-md mb-2">
                    <Trophy size={22} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">{prestasiTitle}</h3>
                  <p className="text-gray-400 text-xs font-medium leading-relaxed">{prestasiDesc}</p>
                </div>

                <div className="z-10 flex flex-wrap gap-2">
                  {prestasiBadges.length > 0 ? (
                    prestasiBadges.map((b: any, i: number) => (
                      <div key={i} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold border ${b.color || 'bg-blue-50 text-blue-800 border-blue-200'} shadow-sm whitespace-nowrap`}>
                        {b.icon && <span>{b.icon}</span>} {b.label}
                      </div>
                    ))
                  ) : (
                    // Fallback just in case there are no achievements in db yet
                    <>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold border bg-amber-50 text-amber-800 border-amber-200 shadow-sm whitespace-nowrap">
                        <span>🏆</span> OSN Kabupaten
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold border bg-green-50 text-green-800 border-green-200 shadow-sm whitespace-nowrap">
                        <span>🥇</span> Pencak Silat Provinsi
                      </div>
                    </>
                  )}
                </div>
              </motion.div>

            </div>
          </div>
        </section>




        {/* ── 3. PROGRAM UNGGULAN */}
        <section className="py-24 px-4 sm:px-6 bg-gray-50/50">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16 flex flex-col items-center gap-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-bold text-sm border border-blue-200">
                <BookMarked size={16} /> Kurikulum & Program
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">Program Unggulan Kami</h2>
              <p className="text-xl text-gray-500 font-medium max-w-2xl">Rancangan kurikulum holistik yang memadukan ilmu pengetahuan, teknologi, dan nilai Islami.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activePrograms.map((p: any, i: number) => {
                const IconComp = typeof p.icon === "string" ? (props: any) => <DynamicIcon name={p.icon} {...props} /> : p.icon;
                return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="group bg-white rounded-[2rem] p-8 border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 hover:-translate-y-1 transition-all duration-500">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white mb-6 shadow-md group-hover:scale-110 transition-transform`}>
                    <IconComp size={26} />
                  </div>
                  <h3 className="font-extrabold text-xl text-gray-900 mb-3 tracking-tight">{p.title}</h3>
                  <p className="text-gray-500 font-medium leading-relaxed">{p.desc || p.description}</p>
                </motion.div>
                );
              })}
            </div>
            <div className="mt-12 flex justify-center">
              <Link href="/akademik" className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base bg-gray-900 text-white hover:bg-black hover:scale-105 transition-all shadow-md">
                Selengkapnya tentang Program <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── 4. PRESTASI & PENGHARGAAN */}
        <section className="py-24 px-4 sm:px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16 flex flex-col items-center gap-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 font-bold text-sm border border-amber-200">
                <Trophy size={16} /> Rekam Jejak Kami
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">Prestasi & Penghargaan</h2>
              <p className="text-xl text-gray-500 font-medium max-w-2xl">Bukti nyata komitmen kami terhadap kualitas pendidikan yang tak pernah berhenti berinovasi.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeAchievements.map((a: any, i: number) => {
                const IconComp = typeof a.icon === "string" ? (props: any) => <DynamicIcon name={a.icon} {...props} /> : a.icon;
                return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="group bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${a.color} flex items-center justify-center text-white shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                    <IconComp size={28} />
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-900 text-base leading-tight mb-1">{a.label}</p>
                    <p className="text-gray-500 text-sm font-medium">{a.scope}</p>
                    <p className="text-xs font-bold text-gray-300 mt-1">{a.year}</p>
                  </div>
                </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 5. SAMBUTAN KEPALA SEKOLAH */}
        <section className="py-24 px-4 sm:px-6 bg-gray-50/50">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-center gap-12 sm:gap-20 relative">
              <div className="flex-1 w-full relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] max-w-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-[3rem] -rotate-3 scale-105 blur-xl"></div>
                <div className="relative h-full w-full rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                  {isVideo(principalUrl) ? (
                    <video src={principalUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                  ) : (
                    <Image src={principalUrl} alt="Kepala Sekolah" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                  )}
                </div>
              </div>
              <div className="w-full md:w-3/5 flex flex-col gap-6 sm:gap-8 relative z-10">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100 mb-2">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-900" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-[1.1] tracking-tighter">
                  {headMsg.substring(0, 50)}...
                </h2>
                <p className="text-xl sm:text-2xl text-gray-500 leading-relaxed font-medium">{headMsg}</p>
                <div className="mt-4 flex items-center gap-6">
                  <div className="h-px flex-1 max-w-[3rem] sm:max-w-[4rem] bg-gray-300"></div>
                  <div>
                    <p className="font-extrabold text-gray-900 text-lg sm:text-xl">{headName}</p>
                    <p className="text-gray-500 font-medium text-sm sm:text-base">{headRole}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. TESTIMONI */}
        <section className="py-24 px-4 sm:px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16 flex flex-col items-center gap-4">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => <Star key={i} size={24} className="fill-amber-400 text-amber-400" />)}
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">Kata Mereka Tentang Kami</h2>
              <p className="text-xl text-gray-500 font-medium max-w-2xl">Kepercayaan orang tua dan kebanggaan alumni adalah penghargaan terbesar kami.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {activeTestimonials.map((t: any, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <TestimonialCard t={t} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. GALERI FOTO */}
        <section className="py-24 px-4 sm:px-6 bg-gray-50/50">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col sm:flex-row justify-between items-end mb-14 gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 text-rose-700 font-bold text-sm border border-rose-200 mb-4">
                  <ImageIcon size={16} /> Galeri Kegiatan
                </div>
                <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">Momen Bersama Kami</h2>
                <p className="text-gray-500 font-medium mt-2 text-lg">Sekilas kehidupan belajar dan kegiatan siswa MTs Muhammadiyah 07.</p>
              </div>
              <Link href="/galeri" className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-full text-base font-bold bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors">
                Lihat Semua Foto <ChevronRight size={18} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {activeGallery.map((photo: any, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  className="group relative overflow-hidden rounded-[1.5rem] bg-gray-100 shadow-sm aspect-[4/3] border border-gray-100">
                  <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                    <span className="text-white font-bold text-sm">{photo.alt}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. BERITA TERBARU */}
        <section className="py-24 px-4 sm:px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col sm:flex-row justify-between items-end mb-16 gap-6">
              <div className="flex flex-col gap-3">
                <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">Kabar Terbaru</h2>
                <p className="text-xl text-gray-500 font-medium">Informasi, prestasi, dan kegiatan seputar sekolah.</p>
              </div>
              <Link href="/berita" className="shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-full text-base font-bold bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors">
                Lihat Semua Berita <ChevronRight size={18} />
              </Link>
            </div>
            <RecentBeritaList />
          </div>
        </section>

        {/* ── 9. KALENDER KEGIATAN */}
        <section className="py-24 px-4 sm:px-6 bg-gray-50/50">
          <div className="container mx-auto max-w-5xl">
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 font-bold text-sm border border-purple-200 mb-4">
                <Calendar size={16} /> Agenda Sekolah
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">Kalender Kegiatan</h2>
              <p className="text-gray-500 font-medium mt-2 text-lg">Jadwal penting yang perlu Anda ketahui.</p>
            </div>
            <div className="flex flex-col gap-4">
              {activeEvents.map((ev: any, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-[2rem] p-5 sm:p-6 shadow-sm border border-gray-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:scale-[1.02] transition-all duration-300 flex items-center gap-5 cursor-pointer">
                  <div className="w-16 h-16 rounded-2xl bg-gray-900 text-white flex flex-col items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-gray-400 leading-none">{ev.day}</span>
                    <span className="text-xl font-extrabold leading-tight">{ev.date.split(" ")[0]}</span>
                    <span className="text-[10px] font-bold text-gray-400 leading-none">{ev.date.split(" ")[1] || ""}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-gray-900 text-base truncate">{ev.title}</p>
                  </div>
                  <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold ${ev.typeColor}`}>{ev.type}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 10. MITRA & PARTNER */}
        <section className="py-20 px-4 sm:px-6 overflow-hidden">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Didukung & Bermitra dengan</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Mitra & Institusi Terpercaya</h2>
            </div>
            <div className="flex flex-col gap-4">
              {[partnerRow1, partnerRow2].map((row, rowIdx) => (
                <div key={rowIdx} className="relative flex overflow-x-hidden">
                  <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-[#fbfbfd] to-transparent z-10 pointer-events-none" />
                  <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#fbfbfd] to-transparent z-10 pointer-events-none" />
                  <div className="flex gap-4 whitespace-nowrap"
                    style={{ animation: `${rowIdx === 0 ? "marquee" : "marqueeReverse"} ${rowIdx === 0 ? "30s" : "25s"} linear infinite` }}>
                    {[...row, ...row].map((partner: any, i: number) => (
                      <div key={i} className="shrink-0 flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${partner.color} flex items-center justify-center text-white font-extrabold text-xs shrink-0`}>
                          {partner.abbr}
                        </div>
                        <span className="font-bold text-gray-700 text-sm whitespace-nowrap">{partner.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
              @keyframes marqueeReverse { from { transform: translateX(-50%); } to { transform: translateX(0); } }
            ` }} />
          </div>
        </section>

        {/* ── 11. COUNTDOWN PPDB (CTA Utama — dekat akhir untuk konversi) */}
        <section className="py-24 px-4 sm:px-6 bg-gray-50/50">
          <div className="container mx-auto max-w-5xl">
            <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-primary via-primary to-green-700 p-10 sm:p-16 shadow-[0_32px_80px_rgba(2,110,64,0.3)]">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center gap-10 text-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 font-bold text-sm mb-6 backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                    </span>
                    PPDB 2026 / 2027 Masih Buka!
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                    Segera Daftarkan Putra-Putri<br className="hidden sm:block" /> Anda Sekarang!
                  </h2>
                  <p className="text-white/70 text-lg font-medium mt-4 max-w-xl mx-auto">
                    Pendaftaran ditutup 1 Juli 2026. Jangan lewatkan kesempatan bergabung bersama kami.
                  </p>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                  <CountdownBlock value={countdown.days} label="Hari" />
                  <span className="text-white/40 text-4xl font-light mt-[-20px]">:</span>
                  <CountdownBlock value={countdown.hours} label="Jam" />
                  <span className="text-white/40 text-4xl font-light mt-[-20px]">:</span>
                  <CountdownBlock value={countdown.minutes} label="Menit" />
                  <span className="text-white/40 text-4xl font-light mt-[-20px]">:</span>
                  <CountdownBlock value={countdown.seconds} label="Detik" />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                  <Link href="/ppdb" className="flex items-center justify-center gap-2 px-10 py-4 rounded-full font-extrabold text-lg bg-white text-primary hover:bg-gray-50 hover:scale-105 transition-all shadow-lg">
                    Daftar Sekarang <ArrowRight size={20} />
                  </Link>
                  <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-10 py-4 rounded-full font-bold text-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm">
                    Hubungi via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 12. PETA LOKASI */}
        <section className="py-24 px-4 sm:px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col gap-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 font-bold text-sm border border-green-200 mb-6">
                    <MapPin size={16} /> Temukan Kami
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">Kunjungi Sekolah Kami</h2>
                  <p className="text-gray-500 font-medium mt-4 text-lg leading-relaxed">Kami berlokasi di pusat kota Purbalingga, mudah dijangkau dari berbagai penjuru kabupaten.</p>
                </div>
                <div className="flex flex-col gap-4">
                  {[
                    { icon: MapPin, label: "Alamat", val: "Jl. Raya Kejobong No. 123, Purbalingga, Jawa Tengah 53392" },
                    { icon: Clock, label: "Jam Operasional", val: "Senin – Sabtu: 06.30 – 15.00 WIB" },
                    { icon: CheckCircle, label: "Transportasi", val: "Tersedia angkot jalur Kejobong dan area parkir luas" },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                        <item.icon size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                        <p className="font-semibold text-gray-900">{item.val}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <a href="https://maps.google.com/?q=MTs+Muhammadiyah+07+Purbalingga" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 w-fit px-8 py-4 rounded-full font-bold bg-gray-900 text-white hover:bg-black hover:scale-105 transition-all shadow-md">
                  <MapPin size={18} /> Buka di Google Maps
                </a>
              </div>
              <div className="relative h-[400px] lg:h-[500px] rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-gray-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.7!2d109.3649!3d-7.4006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e655b0000000001%3A0x1!2sMTs+Muhammadiyah+Purbalingga!5e0!3m2!1sid!2sid!4v1234567890"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                  className="grayscale hover:grayscale-0 transition-all duration-700"
                  title="Lokasi MTs Muhammadiyah 07 Purbalingga"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-gray-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-900 text-sm">MTs Muh 07 Purbalingga</p>
                    <p className="text-gray-500 text-xs font-medium">Jl. Raya Kejobong</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 13. FAQ — Penutup sebelum Footer */}
        <section className="py-24 px-4 sm:px-6 bg-gray-50/50">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16 flex flex-col items-center gap-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-700 font-bold text-sm border border-orange-200">
                <CheckCircle size={16} /> Pertanyaan Umum
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">FAQ — Sering Ditanyakan</h2>
              <p className="text-xl text-gray-500 font-medium max-w-2xl">Temukan jawaban atas pertanyaan yang paling sering diajukan orang tua dan calon siswa.</p>
            </div>
            <div className="flex flex-col gap-4">
              {activeFaqs.map((faq: any, i: number) => <FaqItem key={i} q={faq.question || faq.q} a={faq.answer || faq.a} index={i} />)}
            </div>
            <div className="mt-12 text-center">
              <p className="text-gray-500 font-medium mb-4">Masih punya pertanyaan lain?</p>
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold bg-primary text-white hover:bg-primary-dark hover:scale-105 transition-all shadow-[0_4px_20px_rgba(2,110,64,0.3)]">
                Hubungi Kami via WhatsApp <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
