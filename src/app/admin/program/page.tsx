"use client";

import React, { useState, useEffect } from "react";
import { getPrograms, createProgram, updateProgram, deleteProgram } from "@/actions/landing";
import { Plus, Edit2, Trash2, Save, X, Search } from "lucide-react";

import { InsetGroup, InsetRow, AppleInput, AppleModal } from "@/components/admin/AppleStyle";

type Program = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
};

export default function ProgramAdminPage() {
  const [data, setData] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "BookOpen",
    color: "from-blue-500 to-blue-600",
    order: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    const res = await getPrograms();
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (program?: Program) => {
    if (program) {
      setEditingId(program.id);
      setFormData({
        title: program.title,
        description: program.description,
        icon: program.icon,
        color: program.color,
        order: program.order,
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        description: "",
        icon: "BookOpen",
        color: "from-blue-500 to-blue-600",
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
      await updateProgram(editingId, formData);
    } else {
      await createProgram(formData);
    }
    handleCloseModal();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus program ini?")) {
      await deleteProgram(id);
      fetchData();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mac-admin">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="mac-title-2 text-gray-900">Program &amp; Layanan</h1>
          <p className="mac-callout text-[#8e8e93] mt-0.5">Kelola program unggulan yang ditawarkan sekolah.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="mac-btn mac-btn-primary flex items-center gap-1.5"
        >
          <Plus size={15} /> Tambah Program
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
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <p className="mac-headline text-[#3c3c43] mb-1">Belum Ada Program</p>
            <p className="mac-callout text-[#8e8e93] max-w-[220px] leading-relaxed">
              Tekan "Tambah Program" untuk memasukkan data pertama.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {data.map((item, index) => (
              <InsetRow key={item.id} isLast={index === data.length - 1}>
                <div className="flex items-center gap-4 w-full">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-white shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.1)]`}>
                    <span className="text-xs font-bold">{item.icon.substring(0, 2)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[15px] text-[#1c1c1e] truncate">{item.title}</p>
                    <p className="text-[13px] text-[#8e8e93] line-clamp-1 mt-0.5">{item.description}</p>
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
        title={editingId ? "Edit Program" : "Program Baru"}
        onSubmit={handleSubmit}
      >
        <InsetGroup>
          <InsetRow label="Judul Program" vertical>
            <AppleInput required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Contoh: Kelas Tahfidz" className="w-full text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent text-left" />
          </InsetRow>
          <InsetRow label="Deskripsi" vertical>
            <AppleInput required rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Deskripsi singkat tentang program..." className="w-full text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent text-left resize-none" />
          </InsetRow>
        </InsetGroup>

        <InsetGroup>
          <InsetRow label="Nama Icon">
            <AppleInput required type="text" value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} placeholder="BookOpen" />
          </InsetRow>
          <InsetRow label="Warna Gradien" isLast>
            <AppleInput required type="text" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} placeholder="from-emerald-500 to-teal-600" />
          </InsetRow>
        </InsetGroup>

        <InsetGroup>
          <InsetRow label="Urutan Tampil" isLast>
            <AppleInput required type="number" value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} />
          </InsetRow>
        </InsetGroup>
      </AppleModal>
    </div>
  );
}
