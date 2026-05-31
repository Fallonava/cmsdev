"use client";

import React, { useState, useEffect } from "react";
import { getPartners, createPartner, updatePartner, deletePartner } from "@/actions/landing";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";

import { InsetGroup, InsetRow, AppleInput, AppleModal } from "@/components/admin/AppleStyle";

type Partner = {
  id: string;
  name: string;
  abbr: string;
  color: string;
  order: number;
};

export default function MitraAdminPage() {
  const [data, setData] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    abbr: "",
    color: "from-blue-500 to-blue-700",
    order: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    const res = await getPartners();
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (item?: Partner) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        name: item.name,
        abbr: item.abbr,
        color: item.color,
        order: item.order,
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        abbr: "",
        color: "from-blue-500 to-blue-700",
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
      await updatePartner(editingId, formData);
    } else {
      await createPartner(formData);
    }
    handleCloseModal();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus mitra ini?")) {
      await deletePartner(id);
      fetchData();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mac-admin">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="mac-title-2 text-gray-900">Mitra</h1>
          <p className="mac-callout text-[#8e8e93] mt-0.5">Kelola logo mitra yang berjalan di Landing Page.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="mac-btn mac-btn-primary flex items-center gap-1.5"
        >
          <Plus size={15} /> Tambah Mitra
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
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <p className="mac-headline text-[#3c3c43] mb-1">Belum Ada Mitra</p>
            <p className="mac-callout text-[#8e8e93] max-w-[220px] leading-relaxed">
              Tekan "Tambah Mitra" untuk menambahkan institusi pertama.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {data.map((item, index) => (
              <InsetRow key={item.id} isLast={index === data.length - 1}>
                <div className="flex items-center gap-4 w-full">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-[13px] shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.1)]`}>
                    {item.abbr}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[15px] text-[#1c1c1e] truncate">{item.name}</p>
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
        title={editingId ? "Edit Mitra" : "Mitra Baru"}
        onSubmit={handleSubmit}
      >
        <InsetGroup>
          <InsetRow label="Nama Institusi" vertical>
            <AppleInput required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Contoh: Kemendikbud RI" className="w-full text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent text-left" />
          </InsetRow>
          <InsetRow label="Singkatan">
            <AppleInput required type="text" maxLength={2} value={formData.abbr} onChange={e => setFormData({ ...formData, abbr: e.target.value })} placeholder="KE" />
          </InsetRow>
          <InsetRow label="Warna Gradien" isLast>
            <AppleInput required type="text" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} placeholder="from-blue-500 to-blue-700" />
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
