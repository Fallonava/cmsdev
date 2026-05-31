"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Save, Loader2, Check, ChevronRight, Eye, EyeOff, 
  Monitor, Tablet, Smartphone, RefreshCw, X
} from "lucide-react";
import {
  getLandingSettings, updateLandingSettings,
  getIdentitySettings, updateIdentitySettings,
  getMediaSettings, updateMediaSettings,
} from "@/actions/settings";
import { getProfilSettings, updateProfilSettings, ProfilSettings } from "@/actions/profilSettings";
import { getAkademikSettings, updateAkademikSettings, AkademikSettings } from "@/actions/akademikSettings";
import { motion, AnimatePresence } from "framer-motion";
import { InsetGroup, InsetRow, AppleInput, MediaUploaderRow } from "@/components/admin/AppleStyle";
import { cn } from "@/lib/utils";

// ─── TYPES ───────────────────────────────────────────────────────────────────
type DeviceMode = "mobile" | "tablet" | "desktop";

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function buildSettingsFromForm(formData: FormData, heroStyle: string) {
  return {
    hero: {
      heroStyle,
      badge:     formData.get("badge")      as string,
      title:     formData.get("title")      as string,
      subtitle:  formData.get("subtitle")   as string,
      cta1_text: formData.get("cta1_text")  as string,
      cta2_text: formData.get("cta2_text")  as string,
    },
    stats: {
      title:          formData.get("stats_title")    as string,
      subtitle:       formData.get("stats_subtitle") as string,
      stat1_value:    formData.get("stat1_value")    as string,
      stat1_label:    formData.get("stat1_label")    as string,
      stat2_value:    formData.get("stat2_value")    as string,
      stat2_label:    formData.get("stat2_label")    as string,
      stat3_value:    formData.get("stat3Value")     as string,
      stat3_label:    formData.get("stat3Label")     as string,
      ppdb_title:     formData.get("ppdbTitle")      as string,
      ppdb_desc:      formData.get("ppdbDesc")       as string,
      prestasi_title: formData.get("prestasiTitle")  as string,
      prestasi_desc:  formData.get("prestasiDesc")   as string,
    },
    features: {
      image_title: formData.get("image_title") as string,
      image_desc:  formData.get("image_desc")  as string,
      extra_title: formData.get("extra_title") as string,
      extra_desc:  formData.get("extra_desc")  as string,
    },
    headmaster: {
      name:    formData.get("head_name")    as string,
      role:    formData.get("head_role")    as string,
      message: formData.get("head_message") as string,
    },
  };
}

function buildMediaFromForm(formData: FormData) {
  return {
    heroUrl:      formData.get("heroUrl")      as string,
    facilityUrl:  formData.get("facilityUrl")  as string,
    principalUrl: formData.get("principalUrl") as string,
  };
}

// ─── DEVICE FRAME WIDTHS ──────────────────────────────────────────────────────
const DEVICE_WIDTHS: Record<DeviceMode, string> = {
  mobile:  "390px",
  tablet:  "768px",
  desktop: "100%",
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function PengaturanCMS() {
  const [activeTab, setActiveTab]               = useState("identitas");
  const [isPending, setIsPending]               = useState(false);
  const [successMsg, setSuccessMsg]             = useState("");
  const [identityData, setIdentityData]         = useState<any>(null);
  const [landingData, setLandingData]           = useState<any>(null);
  const [mediaData, setMediaData]               = useState<any>(null);
  const [profilData, setProfilData]             = useState<any>(null);
  const [akademikData, setAkademikData]         = useState<any>(null);
  const [selectedHeroStyle, setSelectedHeroStyle] = useState("bento");

  // ── Live Preview state ────────────────────────────────────────────
  const [isPreviewOpen, setIsPreviewOpen]   = useState(false);
  const [deviceMode, setDeviceMode]         = useState<DeviceMode>("desktop");
  const [isSyncing, setIsSyncing]           = useState(false);
  const [previewKey, setPreviewKey]         = useState(0);

  const formRef         = useRef<HTMLFormElement>(null);
  const debounceRef     = useRef<NodeJS.Timeout | null>(null);
  const iframeRef       = useRef<HTMLIFrameElement>(null);
  const dividerRef      = useRef<HTMLDivElement>(null);
  const containerRef    = useRef<HTMLDivElement>(null);
  const [splitPct, setSplitPct] = useState(55); // left panel width %

  // ─── Load data ──────────────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchAll() {
      const [iden, land, med, prof, akad] = await Promise.all([
        getIdentitySettings(),
        getLandingSettings(),
        getMediaSettings(),
        getProfilSettings(),
        getAkademikSettings(),
      ]);
      setIdentityData(iden);
      setLandingData(land);
      setMediaData(med);
      setProfilData(prof);
      setAkademikData(akad);
      setSelectedHeroStyle(land.hero?.heroStyle || "bento");
    }
    fetchAll();
  }, []);

  // ─── Enable/Disable Draft Mode when preview toggles ─────────────────────────
  useEffect(() => {
    fetch(`/api/preview?enable=${isPreviewOpen}`);
    if (!isPreviewOpen) {
      fetch("/api/draft", { method: "DELETE" });
    }
  }, [isPreviewOpen]);

  // ─── Debounced draft sync ───────────────────────────────────────────────────
  const syncDraft = useCallback(async () => {
    if (!formRef.current || !isPreviewOpen) return;
    setIsSyncing(true);

    const fd = new FormData(formRef.current);
    const payload: any = {};

    if (activeTab === "teks" || activeTab === "media") {
      payload.settings = buildSettingsFromForm(fd, selectedHeroStyle);
      payload.media    = buildMediaFromForm(fd);
    }

    await fetch("/api/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Force iframe to reload the draft
    setPreviewKey(k => k + 1);
    setIsSyncing(false);
  }, [isPreviewOpen, activeTab, selectedHeroStyle]);

  const handleFormInput = useCallback(() => {
    if (!isPreviewOpen) return;
    setIsSyncing(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(syncDraft, 600);
  }, [isPreviewOpen, syncDraft]);

  // Sync when hero style selection changes
  useEffect(() => {
    if (isPreviewOpen) handleFormInput();
  }, [selectedHeroStyle, isPreviewOpen]); // eslint-disable-line

  // ─── Draggable divider ──────────────────────────────────────────────────────
  const startDrag = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;

    const onMove = (ev: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const pct = ((ev.clientX - rect.left) / rect.width) * 100;
      setSplitPct(Math.max(35, Math.min(70, pct)));
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, []);

  // ─── Submit ─────────────────────────────────────────────────────────────────
  async function onSubmit(formData: FormData) {
    setIsPending(true);
    setSuccessMsg("");

    if (activeTab === "teks") formData.set("heroStyle", selectedHeroStyle);

    let result;
    if (activeTab === "identitas") result = await updateIdentitySettings(formData);
    else if (activeTab === "teks")  result = await updateLandingSettings(formData);
    else if (activeTab === "media") result = await updateMediaSettings(formData);
    else if (activeTab === "profil") {
      const data = {
        profil_hero_title: formData.get("profil_hero_title") as string,
        profil_hero_desc: formData.get("profil_hero_desc") as string,
        profil_visi: formData.get("profil_visi") as string,
        profil_visi_desc: formData.get("profil_visi_desc") as string,
      };
      const misiText = formData.get("profil_misi") as string;
      const misiArray = misiText.split('\n').map(s => s.trim()).filter(Boolean);
      (data as any).profil_misi = JSON.stringify(misiArray);
      result = await updateProfilSettings(data);
    }
    else if (activeTab === "akademik") {
      const data = {
        akademik_hero_title: formData.get("akademik_hero_title") as string,
        akademik_hero_desc: formData.get("akademik_hero_desc") as string,
        akademik_tahfidz_title: formData.get("akademik_tahfidz_title") as string,
        akademik_tahfidz_desc: formData.get("akademik_tahfidz_desc") as string,
        akademik_kbm_desc: formData.get("akademik_kbm_desc") as string,
        akademik_ismuba_desc: formData.get("akademik_ismuba_desc") as string,
      };
      result = await updateAkademikSettings(data);
    }

    setIsPending(false);
    if (result?.success) {
      setSuccessMsg("Tersimpan");
      setTimeout(() => setSuccessMsg(""), 3000);
    } else {
      alert((result as any)?.error || "Gagal menyimpan");
    }
  }

  if (!identityData || !landingData || !mediaData || !profilData || !akademikData) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  const MENUS = [
    { id: "identitas", label: "Identitas Global" },
    { id: "teks",      label: "Teks Beranda" },
    { id: "media",     label: "Media Visual" },
    { id: "profil",    label: "Halaman Profil" },
    { id: "akademik",  label: "Halaman Akademik" },
  ];

  const HERO_TEMPLATES = [
    { id: "bento",      label: "Bento Grid",      desc: "Dinamis & Informatif" },
    { id: "split",      label: "Split Screen",    desc: "Elegan & Sinematik" },
    { id: "floating",   label: "Floating Island", desc: "Futuristik & Fokus" },
    { id: "typographic",label: "Typographic",     desc: "Tipografi Ekstrem" },
    { id: "cascading",  label: "Cascading Cards", desc: "Foto Bertumpuk" },
    { id: "immersive",  label: "Immersive",       desc: "Layar Penuh" },
    { id: "filmstrip",  label: "Filmstrip",       desc: "Korsel Berjalan" },
  ];

  const canPreview = activeTab === "teks" || activeTab === "media";

  return (
    <>
      {/* ── LIVE PREVIEW OVERLAY (macOS Full-Screen Split View) ─────────────── */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] bg-[#e8e8ed] flex flex-col"
          >
            {/* ── TITLEBAR ──────────────────────────────────────────────── */}
            <div className="h-12 shrink-0 flex items-center justify-between px-4 bg-[#ebebef]/80 backdrop-blur-xl border-b border-black/10">
              
              {/* Left: Close */}
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="flex items-center gap-2 text-[13px] font-semibold text-gray-600 hover:text-gray-900 transition-colors group"
              >
                <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] group-hover:opacity-80 transition-opacity" />
                <span className="hidden sm:inline">Tutup Preview</span>
              </button>

              {/* Center: Device switcher */}
              <div className="flex items-center gap-1 bg-black/5 rounded-lg p-1">
                {([
                  { key: "mobile",  icon: Smartphone, label: "iPhone" },
                  { key: "tablet",  icon: Tablet,     label: "iPad" },
                  { key: "desktop", icon: Monitor,    label: "Desktop" },
                ] as const).map(d => (
                  <button
                    key={d.key}
                    onClick={() => setDeviceMode(d.key)}
                    title={d.label}
                    className={cn(
                      "w-8 h-7 flex items-center justify-center rounded-md transition-all",
                      deviceMode === d.key
                        ? "bg-white shadow-sm text-gray-900"
                        : "text-gray-400 hover:text-gray-700"
                    )}
                  >
                    <d.icon size={15} strokeWidth={2} />
                  </button>
                ))}
              </div>

              {/* Right: Sync indicator + Save */}
              <div className="flex items-center gap-3">
                <AnimatePresence mode="wait">
                  {isSyncing ? (
                    <motion.div
                      key="syncing"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-400"
                    >
                      <RefreshCw size={12} className="animate-spin" />
                      <span className="hidden sm:inline">Menyinkron…</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="synced"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1.5 text-[12px] font-semibold text-green-500"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="hidden sm:inline">Live</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  form="settingsForm"
                  disabled={isPending}
                  className="flex items-center gap-1.5 bg-[#007aff] text-white px-4 py-1.5 rounded-full text-[13px] font-bold shadow hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isPending ? <Loader2 size={13} className="animate-spin" /> : successMsg ? <Check size={13} /> : <Save size={13} />}
                  {successMsg || "Simpan"}
                </button>
              </div>
            </div>

            {/* ── SPLIT PANELS ──────────────────────────────────────────── */}
            <div ref={containerRef} className="flex-1 flex min-h-0 overflow-hidden">

              {/* LEFT: Form Panel */}
              <div
                className="flex flex-col min-h-0 bg-[#f5f5f7] overflow-hidden"
                style={{ width: `${splitPct}%` }}
              >
                {/* Tab bar inside preview */}
                <div className="flex items-center gap-0.5 px-3 pt-3 pb-2 border-b border-black/5">
                  {MENUS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => { setActiveTab(m.id); setSuccessMsg(""); }}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-[13px] font-semibold transition-all",
                        activeTab === m.id
                          ? "bg-[#007aff] text-white shadow-sm"
                          : "text-gray-500 hover:bg-black/5"
                      )}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.15 }}
                    >
                      <form
                        id="settingsForm"
                        ref={formRef}
                        action={onSubmit}
                        onInput={handleFormInput}
                        className="flex flex-col p-4 gap-0"
                      >
                        <FormContent
                          activeTab={activeTab}
                          identityData={identityData}
                          landingData={landingData}
                          mediaData={mediaData}
                          profilData={profilData}
                          akademikData={akademikData}
                          selectedHeroStyle={selectedHeroStyle}
                          setSelectedHeroStyle={setSelectedHeroStyle}
                          HERO_TEMPLATES={HERO_TEMPLATES}
                        />
                      </form>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* DIVIDER (draggable) */}
              <div
                ref={dividerRef}
                onMouseDown={startDrag}
                className="w-1 shrink-0 bg-black/[0.06] hover:bg-[#007aff]/40 cursor-col-resize transition-colors relative flex items-center justify-center group"
              >
                <div className="w-4 h-8 rounded-full bg-black/10 group-hover:bg-[#007aff]/30 transition-colors absolute flex items-center justify-center">
                  <div className="flex flex-col gap-0.5">
                    <span className="w-0.5 h-3 rounded-full bg-gray-400 group-hover:bg-[#007aff]/70" />
                  </div>
                </div>
              </div>

              {/* RIGHT: Preview Iframe Panel */}
              <div className="flex-1 min-w-0 bg-[#d8d8de] flex flex-col items-center overflow-hidden">
                <motion.div
                  layout
                  style={{ width: DEVICE_WIDTHS[deviceMode] }}
                  className="h-full flex flex-col bg-white shadow-2xl overflow-hidden transition-all duration-300"
                >
                  {/* Browser chrome */}
                  <div className="h-9 bg-[#f0f0f0] border-b border-black/10 flex items-center px-3 gap-2 shrink-0">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                    </div>
                    <div className="flex-1 bg-white border border-black/10 rounded-md h-5 flex items-center px-2 mx-2">
                      <span className="text-[10px] text-gray-400 font-medium truncate">localhost:3000</span>
                    </div>
                    <button
                      onClick={() => setPreviewKey(k => k + 1)}
                      className="text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      <RefreshCw size={12} />
                    </button>
                  </div>

                  {/* iframe */}
                  <iframe
                    ref={iframeRef}
                    key={previewKey}
                    src="/"
                    className="flex-1 w-full border-0"
                    title="Live Preview"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── NORMAL SETTINGS LAYOUT ──────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row min-h-[80vh] bg-[#f5f5f7] -mx-4 sm:-mx-8 -my-8 p-4 sm:p-8">

        {/* Sidebar */}
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

          {/* ── Live Preview Toggle ── */}
          <div className="mt-6 pt-6 border-t border-black/10">
            <button
              onClick={() => {
                if (!canPreview) { setActiveTab("teks"); }
                setIsPreviewOpen(true);
              }}
              className={cn(
                "flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-[15px] font-semibold transition-all",
                "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              )}
            >
              <Eye size={16} />
              Live Preview
              <span className="ml-auto text-[10px] font-bold bg-white/20 px-1.5 py-0.5 rounded-full tracking-wider">NEW</span>
            </button>
            <p className="text-[11px] text-gray-400 mt-2 px-1 leading-relaxed">
              Edit & lihat perubahan secara langsung dalam split-screen.
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 max-w-3xl mx-auto pb-24 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <form id="settingsForm" ref={formRef} action={onSubmit} className="flex flex-col">
                <FormContent
                  activeTab={activeTab}
                  identityData={identityData}
                  landingData={landingData}
                  mediaData={mediaData}
                  profilData={profilData}
                  akademikData={akademikData}
                  selectedHeroStyle={selectedHeroStyle}
                  setSelectedHeroStyle={setSelectedHeroStyle}
                  HERO_TEMPLATES={HERO_TEMPLATES}
                />
              </form>
            </motion.div>
          </AnimatePresence>

          {/* Floating Action Bar */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-10 z-50 flex items-center gap-2">
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
    </>
  );
}

// ─── FORM CONTENT COMPONENT ───────────────────────────────────────────────────
function FormContent({
  activeTab, identityData, landingData, mediaData, profilData, akademikData,
  selectedHeroStyle, setSelectedHeroStyle, HERO_TEMPLATES,
}: {
  activeTab: string;
  identityData: any;
  landingData: any;
  mediaData: any;
  profilData: any;
  akademikData: any;
  selectedHeroStyle: string;
  setSelectedHeroStyle: (s: string) => void;
  HERO_TEMPLATES: { id: string; label: string; desc: string }[];
}) {
  return (
    <>
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
                      ? "border-[#007aff] bg-[#007aff]/5 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div>
                    <p className="font-bold text-gray-900 text-[13px] leading-tight mb-1">{style.label}</p>
                    <p className="text-[10px] text-gray-500 font-medium leading-tight">{style.desc}</p>
                  </div>
                  <div className="flex justify-end mt-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                      selectedHeroStyle === style.id ? "bg-[#007aff] text-white" : "border border-gray-300"
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

      {/* ── HALAMAN PROFIL ── */}
      {activeTab === "profil" && (
        <>
          <InsetGroup title="Konten Hero Profil">
            <InsetRow label="Judul Utama" vertical>
              <AppleInput name="profil_hero_title" defaultValue={profilData.profil_hero_title} rows={2} />
            </InsetRow>
            <InsetRow label="Sub-Judul Deskripsi" vertical isLast>
              <AppleInput name="profil_hero_desc" defaultValue={profilData.profil_hero_desc} rows={3} />
            </InsetRow>
          </InsetGroup>

          <InsetGroup title="Visi Madrasah">
            <InsetRow label="Visi" vertical>
              <AppleInput name="profil_visi" defaultValue={profilData.profil_visi} rows={2} />
            </InsetRow>
            <InsetRow label="Deskripsi Visi" vertical isLast>
              <AppleInput name="profil_visi_desc" defaultValue={profilData.profil_visi_desc} rows={3} />
            </InsetRow>
          </InsetGroup>

          <InsetGroup title="Misi Madrasah">
            <InsetRow label="Daftar Misi (Pisahkan per baris)" vertical isLast>
              <AppleInput name="profil_misi" defaultValue={JSON.parse(profilData.profil_misi).join("\n")} rows={6} />
            </InsetRow>
          </InsetGroup>
        </>
      )}

      {/* ── HALAMAN AKADEMIK ── */}
      {activeTab === "akademik" && (
        <>
          <InsetGroup title="Konten Hero Akademik">
            <InsetRow label="Judul Utama" vertical>
              <AppleInput name="akademik_hero_title" defaultValue={akademikData.akademik_hero_title} rows={2} />
            </InsetRow>
            <InsetRow label="Sub-Judul Deskripsi" vertical isLast>
              <AppleInput name="akademik_hero_desc" defaultValue={akademikData.akademik_hero_desc} rows={3} />
            </InsetRow>
          </InsetGroup>

          <InsetGroup title="Program Tahfidz Unggulan">
            <InsetRow label="Judul Tahfidz" vertical>
              <AppleInput name="akademik_tahfidz_title" defaultValue={akademikData.akademik_tahfidz_title} rows={2} />
            </InsetRow>
            <InsetRow label="Deskripsi Tahfidz" vertical isLast>
              <AppleInput name="akademik_tahfidz_desc" defaultValue={akademikData.akademik_tahfidz_desc} rows={3} />
            </InsetRow>
          </InsetGroup>

          <InsetGroup title="Struktur Pembelajaran">
            <InsetRow label="Deskripsi KBM Digital" vertical>
              <AppleInput name="akademik_kbm_desc" defaultValue={akademikData.akademik_kbm_desc} rows={3} />
            </InsetRow>
            <InsetRow label="Deskripsi Ismuba" vertical isLast>
              <AppleInput name="akademik_ismuba_desc" defaultValue={akademikData.akademik_ismuba_desc} rows={2} />
            </InsetRow>
          </InsetGroup>
        </>
      )}
    </>
  );
}
