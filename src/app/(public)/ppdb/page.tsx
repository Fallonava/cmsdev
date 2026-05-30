"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, FileText, UserCheck, CreditCard, ArrowRight, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { createApplicant } from "@/actions/ppdb";

export default function PPDBPage() {
  const [activeTab, setActiveTab] = React.useState<"info" | "form">("info");
  const [step, setStep] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  // Form States
  const [formData, setFormData] = React.useState({
    fullName: "", nisn: "", birthPlace: "", birthDate: "", gender: "",
    prevSchool: "", gradYear: "",
    parentName: "", parentPhone: ""
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      await createApplicant(fd);
      setIsSuccess(true);
    } catch (error) {
      alert("Gagal mengirim data. Pastikan NISN belum pernah didaftarkan.");
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <main className="flex flex-col min-h-screen bg-[#fbfbfd]">
      {/* 1. Spatial Hero */}
      <section className="relative w-full pt-40 pb-12 px-4 sm:px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto max-w-4xl text-center relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-600 font-bold text-xs sm:text-sm shadow-sm border border-gray-100 mb-6">
            <ShieldCheck size={16} className="text-secondary" />
            Tahun Ajaran 2026/2027
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold text-gray-900 tracking-tighter mb-6">
            Langkah Awal Menuju <br className="hidden md:block"/>
            Masa Depan Cemerlang.
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Bergabunglah bersama kami. Proses pendaftaran didesain sangat mudah, cepat, dan transparan.
          </p>
        </motion.div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-24 mb-32">
        {/* Toggle UI */}
        <div className="flex justify-center mb-16 relative z-20">
          <div className="bg-gray-200/50 backdrop-blur-xl p-1.5 rounded-full flex gap-1 shadow-inner border border-white/50">
            <button
              onClick={() => setActiveTab("info")}
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                activeTab === "info" ? "bg-white text-gray-900 shadow-[0_4px_12px_rgba(0,0,0,0.05)]" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Informasi & Alur
            </button>
            <button
              onClick={() => setActiveTab("form")}
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                activeTab === "form" ? "bg-gray-900 text-white shadow-[0_4px_12px_rgba(0,0,0,0.1)]" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Formulir Setup
            </button>
          </div>
        </div>

        {activeTab === "info" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto space-y-12">
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-100">
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Gelombang Pertama</h3>
                <p className="text-gray-500 font-medium mb-8">1 Jan - 31 Mar 2026</p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-4 text-gray-700 font-medium">
                    <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center"><CheckCircle2 size={16} /></div>
                    Bebas uang gedung 50%
                  </li>
                  <li className="flex items-center gap-4 text-gray-700 font-medium">
                    <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center"><CheckCircle2 size={16} /></div>
                    Prioritas asrama
                  </li>
                </ul>
              </div>
              <div className="bg-gray-900 rounded-[2.5rem] p-10 shadow-[0_20px_40px_rgba(0,0,0,0.1)] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                <h3 className="text-2xl font-extrabold mb-2 relative z-10">Gelombang Kedua</h3>
                <p className="text-gray-400 font-medium mb-8 relative z-10">1 Apr - 30 Jun 2026</p>
                <ul className="space-y-4 relative z-10">
                  <li className="flex items-center gap-4 text-gray-300 font-medium">
                    <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center"><CheckCircle2 size={16} /></div>
                    Biaya reguler
                  </li>
                  <li className="flex items-center gap-4 text-gray-300 font-medium">
                    <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center"><CheckCircle2 size={16} /></div>
                    Kuota menyesuaikan
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center pt-8">
              <button 
                onClick={() => setActiveTab("form")} 
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-bold text-lg hover:bg-primary-dark hover:scale-105 transition-all shadow-[0_8px_24px_rgba(2,110,64,0.3)]"
              >
                Mulai Pendaftaran <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === "form" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
            <div className="bg-white rounded-[3rem] p-8 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-100 relative overflow-hidden">
              
              {isSuccess ? (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-12">
                  <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Selamat Bergabung!</h3>
                  <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                    Data calon siswa telah tersimpan aman di sistem kami. Tim verifikasi akan segera menghubungi Anda melalui WhatsApp.
                  </p>
                  <button onClick={() => { setIsSuccess(false); setStep(1); setFormData({...formData, fullName: '', nisn: ''})}} className="px-8 py-3 rounded-full bg-gray-100 text-gray-900 font-bold hover:bg-gray-200 transition-colors">
                    Kembali ke Awal
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={submitForm}>
                  
                  {/* Progress Indicator */}
                  <div className="flex items-center justify-between mb-12 relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full -z-10"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full -z-10 transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
                    
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-500 ${step >= i ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-300 border-2 border-gray-100'}`}>
                        {i}
                      </div>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                        <div className="mb-8">
                          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Data Diri</h2>
                          <p className="text-gray-500">Mari mulai dengan identitas calon siswa.</p>
                        </div>
                        <div className="space-y-4">
                          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Nama Lengkap" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400" required />
                          <input type="text" name="nisn" value={formData.nisn} onChange={handleChange} placeholder="NISN (10 Digit)" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400" required />
                          <div className="grid grid-cols-2 gap-4">
                            <input type="text" name="birthPlace" value={formData.birthPlace} onChange={handleChange} placeholder="Tempat Lahir" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-gray-900" required />
                            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-gray-500" required />
                          </div>
                          <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-gray-900" required>
                            <option value="" disabled>Pilih Jenis Kelamin</option>
                            <option value="L">Laki-laki</option>
                            <option value="P">Perempuan</option>
                          </select>
                        </div>
                        <div className="pt-6 flex justify-end">
                          <button type="button" onClick={nextStep} className="px-8 py-4 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition-colors flex items-center gap-2">
                            Selanjutnya <ArrowRight size={18} />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                        <div className="mb-8">
                          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Riwayat Pendidikan</h2>
                          <p className="text-gray-500">Dari mana calon siswa berasal?</p>
                        </div>
                        <div className="space-y-4">
                          <input type="text" name="prevSchool" value={formData.prevSchool} onChange={handleChange} placeholder="Nama SD / MI Asal" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-gray-900" required />
                          <input type="number" name="gradYear" value={formData.gradYear} onChange={handleChange} placeholder="Tahun Lulus (Contoh: 2026)" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-gray-900" required />
                        </div>
                        <div className="pt-6 flex justify-between">
                          <button type="button" onClick={prevStep} className="px-8 py-4 bg-gray-100 text-gray-600 rounded-full font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                            <ArrowLeft size={18} /> Kembali
                          </button>
                          <button type="button" onClick={nextStep} className="px-8 py-4 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition-colors flex items-center gap-2">
                            Selanjutnya <ArrowRight size={18} />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                        <div className="mb-8">
                          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Kontak Wali</h2>
                          <p className="text-gray-500">Nomor yang bisa dihubungi oleh panitia.</p>
                        </div>
                        <div className="space-y-4">
                          <input type="text" name="parentName" value={formData.parentName} onChange={handleChange} placeholder="Nama Ayah / Ibu / Wali" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-gray-900" required />
                          <input type="tel" name="parentPhone" value={formData.parentPhone} onChange={handleChange} placeholder="Nomor WhatsApp (Contoh: 0812...)" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-gray-900" required />
                        </div>
                        <div className="pt-6 flex justify-between">
                          <button type="button" onClick={prevStep} className="px-8 py-4 bg-gray-100 text-gray-600 rounded-full font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                            <ArrowLeft size={18} /> Kembali
                          </button>
                          <button type="submit" disabled={isLoading} className="px-8 py-4 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-colors flex items-center gap-2 shadow-[0_8px_24px_rgba(2,110,64,0.3)] disabled:opacity-70">
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />} 
                            {isLoading ? "Memproses..." : "Selesaikan"}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </form>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
