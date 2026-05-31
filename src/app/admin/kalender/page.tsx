"use client";

import React, { useState, useEffect } from "react";
import { getEvents, createEvent, updateEvent, deleteEvent } from "@/actions/landing";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";

import { InsetGroup, InsetRow, AppleInput, AppleModal } from "@/components/admin/AppleStyle";

type Event = {
  id: string;
  title: string;
  date: string;
  day: string;
  type: string;
  typeColor: string;
  order: number;
};

export default function KalenderAdminPage() {
  const [data, setData] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    day: "",
    type: "",
    typeColor: "bg-blue-100 text-blue-700",
    order: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    const res = await getEvents();
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (item?: Event) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        title: item.title,
        date: item.date,
        day: item.day,
        type: item.type,
        typeColor: item.typeColor,
        order: item.order,
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        date: "15 Jul",
        day: "Senin",
        type: "Akademik",
        typeColor: "bg-blue-100 text-blue-700",
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
      await updateEvent(editingId, formData);
    } else {
      await createEvent(formData);
    }
    handleCloseModal();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus agenda ini?")) {
      await deleteEvent(id);
      fetchData();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mac-admin">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="mac-title-2 text-gray-900">Kalender Akademik</h1>
          <p className="mac-callout text-[#8e8e93] mt-0.5">Kelola agenda kegiatan akademik sekolah.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="mac-btn mac-btn-primary flex items-center gap-1.5"
        >
          <Plus size={15} /> Tambah Agenda
        </button>
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
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <p className="mac-headline text-[#3c3c43] mb-1">Belum Ada Agenda</p>
            <p className="mac-callout text-[#8e8e93] max-w-[220px] leading-relaxed">
              Tekan "Tambah Agenda" untuk membuat jadwal kegiatan pertama.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {data.map((item, index) => (
              <InsetRow key={item.id} isLast={index === data.length - 1}>
                <div className="flex items-center gap-4 w-full">
                  <div className="w-10 h-10 rounded-lg bg-gray-900 text-white flex flex-col items-center justify-center shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
                    <span className="text-[8px] font-bold text-gray-400 leading-none">{item.day}</span>
                    <span className="text-[13px] font-extrabold leading-tight mt-0.5">{item.date.split(" ")[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[15px] text-[#1c1c1e] truncate">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.typeColor}`}>{item.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-1 shrink-0">
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
        title={editingId ? "Edit Agenda" : "Agenda Baru"}
        onSubmit={handleSubmit}
      >
        <InsetGroup>
          <InsetRow label="Judul Agenda" vertical>
            <AppleInput required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Contoh: Awal Masuk Sekolah" className="w-full text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent text-left" />
          </InsetRow>
        </InsetGroup>

        <InsetGroup>
          <InsetRow label="Tanggal & Bulan">
            <AppleInput required type="text" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} placeholder="Contoh: 15 Jul" />
          </InsetRow>
          <InsetRow label="Hari">
            <AppleInput required type="text" value={formData.day} onChange={e => setFormData({ ...formData, day: e.target.value })} placeholder="Contoh: Senin" />
          </InsetRow>
          <InsetRow label="Tipe / Kategori">
            <AppleInput required type="text" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} placeholder="Contoh: Libur Nasional" />
          </InsetRow>
          <InsetRow label="Kode Warna Background" isLast>
            <AppleInput required type="text" value={formData.typeColor} onChange={e => setFormData({ ...formData, typeColor: e.target.value })} placeholder="bg-red-100 text-red-700" />
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
