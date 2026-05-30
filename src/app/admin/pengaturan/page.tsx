"use client";

import React, { useState, useEffect, useRef } from "react";
import { Save, Loader2, Link as LinkIcon, UploadCloud, ChevronRight, Check } from "lucide-react";
import { getLandingSettings, updateLandingSettings, getIdentitySettings, updateIdentitySettings, getMediaSettings, updateMediaSettings } from "@/actions/settings";
import { uploadFile } from "@/actions/upload";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import { InsetGroup, InsetRow, AppleInput, MediaUploaderRow } from "@/components/admin/AppleStyle";

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────

export default function PengaturanCMS() {
  const [activeTab, setActiveTab] = useState("identitas");
  const [isPending, setIsPending] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  
  const [identityData, setIdentityData] = useState<any>(null);
  const [landingData, setLandingData] = useState<any>(null);
  const [mediaData, setMediaData] = useState<any>(null);
  
  const [selectedHeroStyle, setSelectedHeroStyle] = useState("bento");

  useEffect(() => {
    async function fetchAll() {
      const iden = await getIdentitySettings();
      const land = await getLandingSettings();
      const med = await getMediaSettings();
      setIdentityData(iden);
      setLandingData(land);
      setMediaData(med);
      setSelectedHeroStyle(land.hero?.heroStyle || "bento");
    }
    fetchAll();
  }, []);

  async function onSubmit(formData: FormData) {
    setIsPending(true);
    setSuccessMsg("");
    
    // Add heroStyle manually to formData if saving Teks Beranda
    if (activeTab === "teks") {
      formData.set("heroStyle", selectedHeroStyle);
    }
    
    let result;
    if (activeTab === "identitas") result = await updateIdentitySettings(formData);
    else if (activeTab === "teks") result = await updateLandingSettings(formData);
    else if (activeTab === "media") result = await updateMediaSettings(formData);
    
    setIsPending(false);
    if (result?.success) {
      setSuccessMsg("Tersimpan");
      setTimeout(() => setSuccessMsg(""), 3000);
    } else {
      alert(result?.error || "Gagal");
    }
  }

  if (!identityData || !landingData || !mediaData) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  const MENUS = [
    { id: "identitas", label: "Identitas Global" },
    { id: "teks", label: "Teks Beranda" },
    { id: "media", label: "Media Visual" },
  ];

  const HERO_TEMPLATES = [
    { id: "bento", label: "Bento Grid", desc: "Dinamis & Informatif" },
    { id: "split", label: "Split Screen", desc: "Elegan & Sinematik" },
    { id: "floating", label: "Floating Island", desc: "Futuristik & Fokus" },
    { id: "typographic", label: "Typographic", desc: "Tipografi Ekstrem" },
    { id: "cascading", label: "Cascading Cards", desc: "Foto Bertumpuk" },
    { id: "immersive", label: "Immersive", desc: "Layar Penuh" },
    { id: "filmstrip", label: "Filmstrip", desc: "Korsel Berjalan" }
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[80vh] bg-[#f5f5f7] -mx-4 sm:-mx-8 -my-8 p-4 sm:p-8">
      
      {/* ─── SIDEBAR NAV (macOS Style) ─── */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-1 pr-0 md:pr-8 mb-8 md:mb-0">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 px-2">Settings</h1>
        {MENUS.map(menu => (
          <button 
            key={menu.id}
            onClick={() => { setActiveTab(menu.id); setSuccessMsg(""); }}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-[15px] font-medium transition-all ${
              activeTab === menu.id 
                ? "bg-[#007aff] text-white shadow-sm" 
                : "text-gray-700 hover:bg-[#e5e5ea]"
            }`}
          >
            {menu.label}
            {activeTab !== menu.id && <ChevronRight size={16} className="text-gray-400" />}
          </button>
        ))}
      </div>

      {/* ─── CONTENT AREA ─── */}
      <div className="flex-1 max-w-3xl mx-auto pb-24 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <form id="settingsForm" action={onSubmit} className="flex flex-col">
              
              {/* ── IDENTITAS GLOBAL ── */}
              {activeTab === "identitas" && (
                <>
                  <InsetGroup title="Informasi Organisasi">
                    <MediaUploaderRow label="URL Logo Sekolah" name="logoUrl" defaultValue={identityData.logoUrl} />
                    <InsetRow label="Nama Sekolah">
                      <AppleInput name="schoolName" defaultValue={identityData.schoolName} required />
                    </InsetRow>
                    <InsetRow label="Nama Singkat" isLast>
                      <AppleInput name="shortName" defaultValue={identityData.shortName} required />
                    </InsetRow>
                  </InsetGroup>
                  
                  <InsetGroup title="Kontak Publik">
                    <InsetRow label="Email">
                      <AppleInput name="email" type="email" defaultValue={identityData.email} required />
                    </InsetRow>
                    <InsetRow label="Telepon">
                      <AppleInput name="phone" defaultValue={identityData.phone} required />
                    </InsetRow>
                    <InsetRow label="Alamat" vertical>
                      <AppleInput name="address" defaultValue={identityData.address} rows={3} required />
                    </InsetRow>
                  </InsetGroup>
                  
                  <InsetGroup title="WhatsApp Helpdesk (Widget)">
                    <InsetRow label="Aktifkan Widget">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" name="waActive" value="true" defaultChecked={identityData.waActive} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#34C759]"></div>
                      </label>
                    </InsetRow>
                    <InsetRow label="Nomor WhatsApp">
                      <AppleInput name="waNumber" defaultValue={identityData.waNumber} placeholder="6281234567890" />
                    </InsetRow>
                    <InsetRow label="Pesan Template" vertical isLast>
                      <AppleInput name="waMessage" defaultValue={identityData.waMessage} rows={2} placeholder="Halo Admin..." />
                    </InsetRow>
                  </InsetGroup>
                </>
              )}

              {/* ── TEKS BERANDA ── */}
              {activeTab === "teks" && (
                <>
                  <InsetGroup title="Template Desain Hero">
                    <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {HERO_TEMPLATES.map(style => (
                        <div 
                          key={style.id}
                          onClick={() => setSelectedHeroStyle(style.id)}
                          className={`relative cursor-pointer rounded-xl border p-3 flex flex-col justify-between aspect-square transition-all ${
                            selectedHeroStyle === style.id 
                              ? 'border-[#007aff] bg-[#007aff]/5 shadow-sm' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div>
                            <p className="font-bold text-gray-900 text-[14px] leading-tight mb-1">{style.label}</p>
                            <p className="text-[11px] text-gray-500 font-medium leading-tight">{style.desc}</p>
                          </div>
                          <div className="flex justify-end mt-2">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                              selectedHeroStyle === style.id ? 'bg-[#007aff] text-white' : 'border border-gray-300'
                            }`}>
                              {selectedHeroStyle === style.id && <Check size={12} strokeWidth={3} />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </InsetGroup>

                  <InsetGroup title="Konten Hero">
                    <InsetRow label="Teks Kapsul Atas">
                      <AppleInput name="badge" defaultValue={landingData.hero?.badge} />
                    </InsetRow>
                    <InsetRow label="Judul Utama (Headline)" vertical>
                      <AppleInput name="title" defaultValue={landingData.hero?.title} rows={2} />
                    </InsetRow>
                    <InsetRow label="Sub-Judul Deskripsi" vertical>
                      <AppleInput name="subtitle" defaultValue={landingData.hero?.subtitle} rows={3} />
                    </InsetRow>
                    <InsetRow label="Tombol CTA 1">
                      <AppleInput name="cta1_text" defaultValue={landingData.hero?.cta1_text} />
                    </InsetRow>
                    <InsetRow label="Tombol CTA 2" isLast>
                      <AppleInput name="cta2_text" defaultValue={landingData.hero?.cta2_text} />
                    </InsetRow>
                  </InsetGroup>

                  <InsetGroup title="Bento Grid & Statistik">
                    <InsetRow label="Judul Bagian">
                      <AppleInput name="stats_title" defaultValue={landingData.stats?.title} />
                    </InsetRow>
                    <InsetRow label="Deskripsi Bagian">
                      <AppleInput name="stats_subtitle" defaultValue={landingData.stats?.subtitle} />
                    </InsetRow>
                    <InsetRow label="Statistik 1 (Nilai)">
                      <AppleInput name="stat1_value" defaultValue={landingData.stats?.stat1_value} />
                    </InsetRow>
                    <InsetRow label="Statistik 1 (Label)">
                      <AppleInput name="stat1_label" defaultValue={landingData.stats?.stat1_label} />
                    </InsetRow>
                    <InsetRow label="Statistik 2 (Nilai)">
                      <AppleInput name="stat2_value" defaultValue={landingData.stats?.stat2_value} />
                    </InsetRow>
                    <InsetRow label="Statistik 2 (Label)">
                      <AppleInput name="stat2_label" defaultValue={landingData.stats?.stat2_label} />
                    </InsetRow>
                    <InsetRow label="Statistik 3 (Nilai)">
                      <AppleInput name="stat3Value" defaultValue={landingData.stats?.stat3_value} />
                    </InsetRow>
                    <InsetRow label="Statistik 3 (Label)">
                      <AppleInput name="stat3Label" defaultValue={landingData.stats?.stat3_label} />
                    </InsetRow>
                    <InsetRow label="Judul Kartu PPDB" vertical>
                      <AppleInput name="ppdbTitle" defaultValue={landingData.stats?.ppdb_title} rows={2} />
                    </InsetRow>
                    <InsetRow label="Deskripsi PPDB" vertical>
                      <AppleInput name="ppdbDesc" defaultValue={landingData.stats?.ppdb_desc} rows={2} />
                    </InsetRow>
                    <InsetRow label="Judul Prestasi">
                      <AppleInput name="prestasiTitle" defaultValue={landingData.stats?.prestasi_title} />
                    </InsetRow>
                    <InsetRow label="Deskripsi Prestasi" isLast>
                      <AppleInput name="prestasiDesc" defaultValue={landingData.stats?.prestasi_desc} />
                    </InsetRow>
                  </InsetGroup>

                  <InsetGroup title="Kartu Fitur Gambar">
                    <InsetRow label="Judul Fitur">
                      <AppleInput name="image_title" defaultValue={landingData.features?.image_title} />
                    </InsetRow>
                    <InsetRow label="Deskripsi Fitur" isLast>
                      <AppleInput name="image_desc" defaultValue={landingData.features?.image_desc} />
                    </InsetRow>
                  </InsetGroup>

                  <InsetGroup title="Kartu Fitur Gelap">
                    <InsetRow label="Judul Fitur">
                      <AppleInput name="extra_title" defaultValue={landingData.features?.extra_title} />
                    </InsetRow>
                    <InsetRow label="Deskripsi Fitur" isLast>
                      <AppleInput name="extra_desc" defaultValue={landingData.features?.extra_desc} />
                    </InsetRow>
                  </InsetGroup>
                  
                  <InsetGroup title="Sambutan Kepala Sekolah">
                    <InsetRow label="Nama Lengkap">
                      <AppleInput name="head_name" defaultValue={landingData.headmaster?.name} />
                    </InsetRow>
                    <InsetRow label="Jabatan">
                      <AppleInput name="head_role" defaultValue={landingData.headmaster?.role} />
                    </InsetRow>
                    <InsetRow label="Pesan Sambutan" vertical isLast>
                      <AppleInput name="head_message" defaultValue={landingData.headmaster?.message} rows={3} />
                    </InsetRow>
                  </InsetGroup>
                </>
              )}

              {/* ── MEDIA VISUAL ── */}
              {activeTab === "media" && (
                <>
                  <InsetGroup title="Media Landing Page">
                    <MediaUploaderRow label="Media Cinematic Hero (Gambar/Video Latar Belakang)" name="heroUrl" defaultValue={mediaData.heroUrl} />
                    <MediaUploaderRow label="Gambar Kartu Fasilitas (Gedung)" name="facilityUrl" defaultValue={mediaData.facilityUrl} />
                    <MediaUploaderRow label="Foto Kepala Sekolah (Portrait 4:5)" name="principalUrl" defaultValue={mediaData.principalUrl} isLast />
                  </InsetGroup>
                </>
              )}

            </form>
          </motion.div>
        </AnimatePresence>

        {/* ── FLOATING ACTION BAR ── */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-10 z-50">
          <button 
            type="submit" 
            form="settingsForm"
            disabled={isPending}
            className="flex items-center gap-2 bg-[#007aff]/90 backdrop-blur-md text-white px-8 py-3.5 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : successMsg ? (
              <Check size={18} />
            ) : (
              <Save size={18} />
            )}
            {successMsg || "Simpan Perubahan"}
          </button>
        </div>
      </div>

    </div>
  );
}
