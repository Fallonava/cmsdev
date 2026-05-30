"use client";

import React, { useState, useEffect } from "react";
import { getAchievements, createAchievement, updateAchievement, deleteAchievement } from "@/actions/landing";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";

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

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Prestasi & Penghargaan</h1>
          <p className="text-[14px] text-gray-500 font-medium mt-1">Kelola daftar prestasi yang tampil di Landing Page.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#007aff] text-white text-[14px] font-medium rounded-xl hover:bg-[#0056b3] transition-colors shadow-sm active:scale-95"
        >
          <Plus size={18} /> Tambah Prestasi
        </button>
      </div>

      <InsetGroup>
        {loading ? (
          <div className="p-10 text-center text-gray-500 font-medium">Memuat data...</div>
        ) : data.length === 0 ? (
          <div className="p-10 text-center text-gray-500 font-medium text-[14px]">Belum ada data prestasi. Silakan tambah baru.</div>
        ) : (
          <div className="flex flex-col">
            {data.map((item, index) => (
              <InsetRow key={item.id} isLast={index === data.length - 1}>
                <div className="flex items-start sm:items-center gap-4 w-full pt-1 sm:pt-0">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-white shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.1)]`}>
                    <span className="text-[13px] font-bold">{item.icon.substring(0, 2)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[15px] text-gray-900 truncate">{item.label}</p>
                    <p className="text-[13px] text-gray-500 truncate mt-0.5">{item.scope} &bull; <span className="font-medium">{item.year}</span></p>
                  </div>
                  <div className="flex items-center justify-end gap-2 shrink-0 mt-2 sm:mt-0">
                    <button onClick={() => handleOpenModal(item)} className="p-2 text-[#007aff] hover:bg-blue-50 rounded-lg transition-colors active:scale-95">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors active:scale-95">
                      <Trash2 size={18} />
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
