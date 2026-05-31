"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Users, Target, Book, Shield, Award, Heart, ChevronDown, MapPin, Phone, Mail } from "lucide-react";
import Image from "next/image";
import * as React from "react";

type Teacher = {
  id: string;
  name: string;
  position: string;
  subjects: string | null;
  photoUrl: string | null;
  order: number;
};

type Extracurricular = {
  id: string;
  name: string;
  description: string;
  schedule: string | null;
  coach: string | null;
  photoUrl: string | null;
  order: number;
};

import { ProfilSettings } from "@/actions/profilSettings";

export default function ProfilClientView({ teachers, ekskuls, settings }: { teachers: Teacher[], ekskuls: Extracurricular[], settings: ProfilSettings }) {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  
  return (
    <main className="flex flex-col min-h-screen bg-[#fbfbfd] overflow-hidden">
      {/* 1. Spatial Hero Section */}
      <section className="relative w-full min-h-[80vh] flex flex-col items-center justify-center pt-32 pb-16 px-4 sm:px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#fbfbfd] to-[#fbfbfd] z-0"></div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="container mx-auto max-w-5xl relative z-10 text-center flex flex-col items-center gap-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-600 font-bold text-xs sm:text-sm shadow-sm border border-gray-100">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            Profil Institusi
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-[5rem] lg:text-[6rem] font-extrabold text-gray-900 leading-[1.05] tracking-tighter whitespace-pre-line">
            {settings.profil_hero_title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-3xl mt-4 leading-relaxed">
            {settings.profil_hero_desc}
          </p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400"
        >
          <span className="text-xs font-bold tracking-widest uppercase">Eksplorasi</span>
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown size={24} />
          </motion.div>
        </motion.div>
      </section>

      {/* 2. Visi & Misi (Glassmorphism + Spatial Grid) */}
      <section className="py-24 px-4 sm:px-6 relative">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            
            {/* Visi */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-white rounded-[3rem] p-10 sm:p-14 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover:bg-primary/10 transition-colors duration-700"></div>
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8">
                <Target size={32} />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">Visi Kami</h2>
              <p className="text-2xl sm:text-3xl text-gray-800 font-bold leading-tight whitespace-pre-line">
                {settings.profil_visi}
              </p>
              <p className="text-gray-500 text-lg mt-6 font-medium leading-relaxed whitespace-pre-line">
                {settings.profil_visi_desc}
              </p>
            </motion.div>

            {/* Misi */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-gray-900 rounded-[3rem] p-10 sm:p-14 shadow-[0_20px_40px_rgba(0,0,0,0.1)] relative overflow-hidden text-white"
            >
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3"></div>
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-secondary mb-8 border border-white/10">
                <Shield size={32} />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-8 tracking-tight">Misi Utama</h2>
              <ul className="space-y-6 relative z-10">
                {(() => {
                  let misiList: string[] = [];
                  try {
                    misiList = JSON.parse(settings.profil_misi);
                  } catch (e) {
                    misiList = [];
                  }
                  return misiList.map((misi, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <span className="shrink-0 w-8 h-8 rounded-full bg-white/10 text-white font-bold flex items-center justify-center text-sm mt-1 backdrop-blur-sm">
                      {i + 1}
                    </span>
                    <span className="text-lg text-gray-300 font-medium leading-relaxed">{misi}</span>
                  </li>
                ))
                })()}
              </ul>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. Core Values (iOS Grid) */}
      <section className="py-24 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">DNA Kami</h2>
            <p className="text-xl text-gray-500 font-medium">Empat pilar nilai inti pembentukan karakter siswa.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Book, title: "Religius", desc: "Taat beribadah dan mengamalkan ajaran Islam.", color: "text-blue-600", bg: "bg-blue-50" },
              { icon: Shield, title: "Integritas", desc: "Jujur, disiplin, dan senantiasa dapat dipercaya.", color: "text-green-600", bg: "bg-green-50" },
              { icon: Award, title: "Berprestasi", desc: "Semangat pantang menyerah meraih hasil terbaik.", color: "text-orange-600", bg: "bg-orange-50" },
              { icon: Heart, title: "Peduli", desc: "Empati dan peduli terhadap lingkungan sosial.", color: "text-rose-600", bg: "bg-rose-50" }
            ].map((val, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col items-center text-center gap-4 hover:scale-[1.03] transition-transform duration-300"
              >
                <div className={`w-20 h-20 rounded-[1.5rem] ${val.bg} ${val.color} flex items-center justify-center mb-2`}>
                  <val.icon size={36} strokeWidth={2.5} />
                </div>
                <h3 className="font-extrabold text-2xl text-gray-900 tracking-tight">{val.title}</h3>
                <p className="text-gray-500 font-medium text-base leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Timeline Sejarah */}
      <section className="py-24 px-4 sm:px-6 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Garis Waktu</h2>
            <p className="text-xl text-gray-500 font-medium">Perjalanan dedikasi kami sejak 1980.</p>
          </div>

          <div className="relative space-y-16">
            {/* The Vertical Line */}
            <div className="absolute top-0 bottom-0 left-4 md:left-1/2 w-1 bg-gray-100 md:-translate-x-1/2"></div>
            
            {[
              { year: "1980", title: "Langkah Pertama", desc: "Didirikan oleh tokoh PCM Kejobong untuk memenuhi dahaga masyarakat akan pendidikan berbasis Islam." },
              { year: "2005", title: "Ekspansi Fasilitas", desc: "Pembangunan gedung utama tiga lantai dan masjid sekolah untuk memfasilitasi lonjakan siswa." },
              { year: "2018", title: "Digitalisasi", desc: "Integrasi sistem pembelajaran interaktif dan laboratorium komputer standar industri." },
              { year: "Sekarang", title: "Madrasah Modern", desc: "Menjadi rujukan pendidikan unggul di Purbalingga, menyeimbangkan teknologi masa depan dengan keluhuran akhlak." }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`relative w-full flex flex-col md:flex-row items-start md:items-center ${idx % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}
              >
                {/* Timeline Node */}
                <div className="absolute left-4 md:left-1/2 w-6 h-6 rounded-full bg-white border-4 border-primary shadow-sm z-10 -translate-x-1/2 mt-1 md:mt-0"></div>
                
                <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${idx % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 text-left'}`}>
                  <span className="inline-block px-4 py-1.5 rounded-full bg-gray-100 text-gray-900 font-extrabold text-sm mb-4">
                    {item.year}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-500 font-medium text-lg leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* 5. Struktur Organisasi */}
      <section className="py-24 px-4 sm:px-6 bg-[#fbfbfd]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Tim Penggerak</h2>
            <p className="text-xl text-gray-500 font-medium">Dedikasi sepenuh hati untuk generasi islami.</p>
          </div>

          <div className="flex flex-col items-center gap-8">
            {/* Top Level (Kepala Sekolah) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col items-center text-center w-full max-w-sm"
            >
              <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden border-4 border-gray-50">
                 {/* Placeholder for Principal Photo */}
                 <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Nama Kepala Sekolah, S.Pd., M.Pd.</h3>
              <p className="text-primary font-bold text-sm mt-1">Kepala Sekolah</p>
            </motion.div>

            {/* Second Level (Wakasek & Teachers) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-4">
              {teachers.map((person, i) => (
                <motion.div 
                  key={person.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform"
                >
                  <div className="w-16 h-16 rounded-full bg-gray-100 mb-4 flex items-center justify-center text-gray-400 overflow-hidden">
                    {person.photoUrl ? (
                      <Image src={person.photoUrl} alt={person.name} width={64} height={64} className="object-cover w-full h-full" />
                    ) : (
                      <Users size={24} />
                    )}
                  </div>
                  <h3 className="text-base font-bold text-gray-900">{person.name}</h3>
                  <p className="text-gray-500 font-medium text-xs mt-1 uppercase tracking-wider">{person.position}</p>
                  {person.subjects && <p className="text-gray-400 text-xs mt-1 italic">{person.subjects}</p>}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Ekstrakurikuler */}
      {ekskuls && ekskuls.length > 0 && (
        <section className="py-24 px-4 sm:px-6 bg-white relative">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Ekstrakurikuler</h2>
              <p className="text-xl text-gray-500 font-medium">Wadah pengembangan bakat dan minat siswa.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ekskuls.map((item, i) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#fbfbfd] rounded-[2rem] p-6 border border-gray-100 hover:shadow-lg transition-shadow group flex flex-col h-full"
                >
                  {item.photoUrl && (
                    <div className="w-full h-48 rounded-[1.5rem] bg-gray-200 mb-6 overflow-hidden relative">
                      <Image src={item.photoUrl} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed mb-6 flex-1">{item.description}</p>
                  
                  <div className="space-y-2 mt-auto">
                    {item.schedule && (
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-600 bg-white px-3 py-2 rounded-xl border border-gray-100">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Jadwal: {item.schedule}
                      </div>
                    )}
                    {item.coach && (
                      <div className="flex items-center gap-2 text-xs font-medium text-blue-600 bg-blue-50 px-3 py-2 rounded-xl border border-blue-100">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        Pembina: {item.coach}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Peta Lokasi */}
      <section className="py-24 px-4 sm:px-6 relative">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Lokasi Kami</h2>
            <p className="text-xl text-gray-500 font-medium">Temukan dan kunjungi kampus hijau kami.</p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full h-[500px] md:h-[600px] rounded-[3rem] overflow-hidden relative shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-gray-200"
          >
            {/* Google Maps Iframe */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15827.697042079144!2d109.43105741695286!3d-7.362369796859343!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6556e480c5dfbd%3A0xc6c4f3f4c6e91f1a!2sKejobong%2C%20Kabupaten%20Purbalingga%2C%20Jawa%20Tengah!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-700"
            ></iframe>

            {/* Floating Contact Card */}
            <div className="absolute bottom-6 left-6 right-6 md:left-10 md:right-auto md:w-[400px] bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl border border-white/50">
              <h3 className="font-extrabold text-2xl text-gray-900 mb-6">Informasi Kontak</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-primary"><MapPin size={20} /></div>
                  <p className="text-gray-700 font-medium">Jl. Raya Kejobong No. 123, Kejobong, Purbalingga, Jawa Tengah 53392</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-primary"><Phone size={20} /></div>
                  <p className="text-gray-700 font-medium">(0281) 123456</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-primary"><Mail size={20} /></div>
                  <p className="text-gray-700 font-medium">info@mtsmuh07.sch.id</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
