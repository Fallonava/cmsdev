"use client";

import { FileText, Users, Bell, TrendingUp, ArrowUpRight, Clock, Briefcase, ImageIcon, Quote } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import React, { useState, useEffect } from "react";
import { getDashboardStats } from "@/actions/analytics";

const ppdbData = [
  { name: 'Jan', pendaftar: 15 },
  { name: 'Feb', pendaftar: 28 },
  { name: 'Mar', pendaftar: 45 },
  { name: 'Apr', pendaftar: 62 },
  { name: 'Mei', pendaftar: 85 },
  { name: 'Jun', pendaftar: 120 },
];

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<any>({
    totalStudents: 0,
    totalTeachers: 0,
    totalNews: 0,
    totalGalleries: 0,
    totalTestimonials: 0,
  });

  useEffect(() => {
    setMounted(true);
    async function fetchStats() {
      const res = await getDashboardStats();
      if (res.success && res.stats) {
        setStats(res.stats);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      
      {/* 1. Clean Minimalist Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Ringkasan Sistem</h1>
          <p className="text-[13px] text-gray-500 font-medium mt-1">Pantau aktivitas terbaru dan metrik performa sekolah.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-100 rounded-lg">
           <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span className="text-[11px] font-bold text-green-700 tracking-wide uppercase">Sistem Online</span>
        </div>
      </div>

      {/* 2. Top Metrics (Minimalist Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
        {[
          { title: "Pendaftar PPDB", value: stats.totalStudents, icon: Users, trend: "Calon Siswa", color: "text-indigo-600", bg: "bg-indigo-50" },
          { title: "Guru & Staf", value: stats.totalTeachers, icon: Briefcase, trend: "Direktori Aktif", color: "text-amber-600", bg: "bg-amber-50" },
          { title: "Total Berita", value: stats.totalNews, icon: FileText, trend: "Publikasi", color: "text-teal-600", bg: "bg-teal-50" },
          { title: "Galeri Foto", value: stats.totalGalleries, icon: ImageIcon, trend: "Media Publik", color: "text-pink-600", bg: "bg-pink-50" },
          { title: "Testimoni", value: stats.totalTestimonials, icon: Quote, trend: "Ulasan Positif", color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-[1.25rem] border border-[#e5e5ea] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col gap-4 group hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all">
            <div className="flex justify-between items-start">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} transition-colors shadow-inner`}>
                <stat.icon size={20} strokeWidth={2} />
              </div>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-gray-500 bg-[#f2f2f7] px-2 py-1 rounded-md line-clamp-1">
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1 line-clamp-1">{stat.title}</p>
              <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Bento Grid: Chart & Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Chart Container */}
        <div className="xl:col-span-2 bg-white rounded-[1.25rem] border border-[#e5e5ea] shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 sm:p-7 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-[16px] font-bold text-gray-900 tracking-tight">Pertumbuhan PPDB</h3>
              <p className="text-[13px] text-gray-500 font-medium mt-0.5">Tren pendaftar 6 bulan terakhir.</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#f2f2f7] flex items-center justify-center text-gray-400 shadow-inner">
              <TrendingUp size={18} />
            </div>
          </div>
          
          <div className="w-full flex-1 min-h-[220px]">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ppdbData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#111827" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#111827" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5ea" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 11, fontWeight: 600}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 11, fontWeight: 600}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e5e5ea', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
                    itemStyle={{ fontWeight: 'bold', color: '#111827' }}
                  />
                  <Area type="monotone" dataKey="pendaftar" stroke="#111827" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPv)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-[1.25rem] border border-[#e5e5ea] shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 sm:p-7">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[16px] font-bold text-gray-900 tracking-tight">Aktivitas Terbaru</h3>
            <div className="w-9 h-9 rounded-xl bg-[#f2f2f7] flex items-center justify-center text-gray-400 shadow-inner">
              <Clock size={18} />
            </div>
          </div>
          <div className="flex flex-col gap-5">
            {[
              { text: "Budi Santoso mendaftar PPDB", time: "Baru saja", icon: Users, color: "text-blue-500 bg-blue-50" },
              { text: "Berita 'Prestasi Siswa' diterbitkan", time: "2 jam lalu", icon: FileText, color: "text-green-500 bg-green-50" },
              { text: "Sistem dibackup otomatis", time: "1 hari lalu", icon: Bell, color: "text-gray-500 bg-[#f2f2f7]" },
            ].map((act, i) => (
              <div key={i} className="flex gap-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${act.color} shadow-inner`}>
                  <act.icon size={16} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-gray-900">{act.text}</p>
                  <p className="text-[12px] text-gray-400 font-medium mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-2 rounded-lg bg-gray-50 border border-[#e5e5ea] text-gray-600 font-semibold text-[12px] hover:bg-gray-100 transition-all active:scale-95 shadow-sm">
            Lihat Semua Aktivitas
          </button>
        </div>
      </div>
    </div>
  );
}
