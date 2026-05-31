"use client";

import React, { useState, useEffect } from "react";
import { getAchievements, createAchievement, updateAchievement, deleteAchievement } from "@/actions/landing";
import { Plus, Edit2, Trash2, Save, X, Download } from "lucide-react";
import * as XLSX from "xlsx";

import { InsetGroup, InsetRow, AppleInput, AppleModal } from "@/components/admin/AppleStyle";

type Achievement = {
  id: string;
  label: string;
  scope: string;
  year: string;
  icon: string;
  color: string;
  order: number;
};

export default function PrestasiAdminPage() {
  const [data, setData] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    label: "",
    scope: "",
    year: "",
    icon: "Trophy",
    color: "from-amber-400 to-orange-500",
    order: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    const res = await getAchievements();
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (item?: Achievement) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        label: item.label,
        scope: item.scope,
        year: item.year,
        icon: item.icon,
        color: item.color,
        order: item.order,
      });
    } else {
      setEditingId(null);
      setFormData({
        label: "",
        scope: "",
        year: new Date().getFullYear().toString(),
        icon: "Trophy",
        color: "from-amber-400 to-orange-500",
        order: data.length,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateAchievement(editingId, formData);
    } else {
      await createAchievement(formData);
    }
    handleCloseModal();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus prestasi ini?")) {
      await deleteAchievement(id);
      fetchData();
    }
  };

  const handleExport = () => {
    const exportData = data.map((item, index) => ({
      No: index + 1,
      Label: item.label,
      Tingkat: item.scope,
      Tahun: item.year,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Prestasi");
    XLSX.writeFile(workbook, "Data_Prestasi.xlsx");
  };

  return (
    <div className="w-full max-w-5xl mx-auto mac-admin">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="mac-title-2 text-gray-900">Prestasi &amp; Penghargaan</h1>
          <p className="mac-callout text-[#8e8e93] mt-0.5">Kelola daftar prestasi yang tampil di Landing Page.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="mac-btn mac-btn-ghost flex items-center gap-1.5"
            disabled={data.length === 0}
          >
            <Download size={15} /> Export Excel
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="mac-btn mac-btn-primary flex items-center gap-1.5"
          >
            <Plus size={15} /> Tambah Prestasi
          </button>
        </div>
      </div>

      <InsetGroup>
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-[#8e8e93]">
            <div className="w-5 h-5 border-2 border-[#c7c7cc] border-t-[#007AFF] rounded-full animate-spin" />
            <span className="mac-callout">Memuat data…</span>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-[1.25rem] bg-[#f5f5f7] border border-[#e5e5ea] flex items-center justify-center mb-4 text-[#c7c7cc]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
            </div>
            <p className="mac-headline text-[#3c3c43] mb-1">Belum Ada Prestasi</p>
            <p className="mac-callout text-[#8e8e93] max-w-[220px] leading-relaxed">
              Tekan "Tambah Prestasi" untuk memasukkan data pertama.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {data.map((item, index) => (
              <InsetRow key={item.id} isLast={index === data.length - 1}>
                <div className="flex items-start sm:items-center gap-4 w-full pt-1 sm:pt-0">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-white shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.1)]`}>
                    <span className="text-[13px] font-bold">{item.icon.substring(0, 2)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[15px] text-[#1c1c1e] truncate">{item.label}</p>
                    <p className="text-[13px] text-[#8e8e93] truncate mt-0.5">{item.scope} &bull; <span className="font-medium text-[#3c3c43]">{item.year}</span></p>
                  </div>
                  <div className="flex items-center justify-end gap-1 shrink-0 mt-2 sm:mt-0">
                    <button onClick={() => handleOpenModal(item)} className="mac-btn mac-btn-ghost mac-btn-sm flex items-center gap-1">
                      <Edit2 size={13} /> Edit
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="mac-btn mac-btn-sm flex items-center gap-1 text-[#FF3B30] hover:bg-[#FF3B30]/10 active:bg-[#FF3B30]/20">
                      <Trash2 size={13} /> Hapus
                    </button>
                  </div>
                </div>
              </InsetRow>
            ))}
          </div>
        )}
      </InsetGroup>

      <AppleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingId ? "Edit Prestasi" : "Prestasi Baru"}
        onSubmit={handleSubmit}
      >
        <InsetGroup>
          <InsetRow label="Nama Penghargaan / Prestasi" vertical>
            <AppleInput required type="text" value={formData.label} onChange={e => setFormData({ ...formData, label: e.target.value })} placeholder="Contoh: Juara 1 MTQ" className="w-full text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent text-left" />
          </InsetRow>
        </InsetGroup>

        <InsetGroup>
          <InsetRow label="Tingkat">
            <AppleInput required type="text" value={formData.scope} onChange={e => setFormData({ ...formData, scope: e.target.value })} placeholder="Contoh: Kabupaten Purbalingga" />
          </InsetRow>
          <InsetRow label="Tahun">
            <AppleInput required type="text" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} placeholder="Contoh: 2026" />
          </InsetRow>
          <InsetRow label="Ikon (Piala/Trophy)">
            <AppleInput required type="text" value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} placeholder="Trophy" />
          </InsetRow>
          <InsetRow label="Warna Background" isLast>
            <AppleInput required type="text" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} placeholder="from-amber-400 to-amber-600" />
          </InsetRow>
        </InsetGroup>

        <InsetGroup>
          <InsetRow label="Urutan Tampil" isLast>
            <AppleInput required type="number" value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} />
          </InsetRow>
        </InsetGroup>
        <p className="text-[13px] text-gray-500 mt-[-20px] mb-4 px-3">Angka yang lebih kecil akan tampil lebih dulu.</p>
      </AppleModal>
    </div>
  );
}
