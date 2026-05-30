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
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Program & Layanan</h1>
          <p className="text-[14px] text-gray-500 font-medium mt-1">Kelola program unggulan yang ditawarkan sekolah.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#007aff] text-white text-[14px] font-medium rounded-xl hover:bg-[#0056b3] transition-colors shadow-sm active:scale-95"
        >
          <Plus size={18} /> Tambah Program
        </button>
      </div>

      <InsetGroup>
        {loading ? (
          <div className="p-10 text-center text-gray-500 font-medium">Memuat data...</div>
        ) : data.length === 0 ? (
          <div className="p-10 text-center text-gray-500 font-medium text-[14px]">Belum ada data program. Silakan tambah baru.</div>
        ) : (
          <div className="flex flex-col">
            {data.map((item, index) => (
              <InsetRow key={item.id} isLast={index === data.length - 1}>
                <div className="flex items-center gap-4 w-full">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-white shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.1)]`}>
                    <span className="text-xs font-bold">{item.icon.substring(0, 2)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[15px] text-gray-900 truncate">{item.title}</p>
                    <p className="text-[13px] text-gray-500 line-clamp-1 mt-0.5">{item.description}</p>
                  </div>
                  <div className="flex items-center justify-end gap-2 shrink-0">
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
