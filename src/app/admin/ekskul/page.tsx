"use client";

import React, { useState, useEffect } from "react";
import { getExtracurriculars, addExtracurricular, updateExtracurricular, deleteExtracurricular } from "@/actions/extracurricular";
import { Plus, Edit2, Trash2, Activity } from "lucide-react";
import Image from "next/image";
import { InsetGroup, InsetRow, AppleInput, AppleModal, MediaUploaderRow } from "@/components/admin/AppleStyle";

type Extracurricular = {
  id: string;
  name: string;
  description: string;
  schedule: string | null;
  coach: string | null;
  photoUrl: string | null;
  order: number;
};

export default function EkskulAdminPage() {
  const [data, setData] = useState<Extracurricular[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    schedule: "",
    coach: "",
    photoUrl: "",
  });

  const fetchData = async () => {
    setLoading(true);
    const res = await getExtracurriculars();
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (item?: Extracurricular) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        name: item.name,
        description: item.description,
        schedule: item.schedule || "",
        coach: item.coach || "",
        photoUrl: item.photoUrl || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        description: "",
        schedule: "",
        coach: "",
        photoUrl: "",
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
      await updateExtracurricular(editingId, formData);
    } else {
      await addExtracurricular(formData);
    }
    handleCloseModal();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus ekstrakurikuler ini?")) {
      await deleteExtracurricular(id);
      fetchData();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Ekstrakurikuler</h1>
          <p className="text-[14px] text-gray-500 font-medium mt-1">Kelola data kegiatan ekstrakurikuler siswa.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#007aff] text-white text-[14px] font-medium rounded-xl hover:bg-[#0056b3] transition-colors shadow-sm active:scale-95"
        >
          <Plus size={18} /> Tambah Ekskul
        </button>
      </div>

      <InsetGroup>
        {loading ? (
          <div className="p-10 text-center text-gray-500 font-medium">Memuat data...</div>
        ) : data.length === 0 ? (
          <div className="p-10 text-center text-gray-500 font-medium text-[14px]">Belum ada kegiatan. Silakan tambah baru.</div>
        ) : (
          <div className="flex flex-col">
            {data.map((item, index) => (
              <InsetRow key={item.id} isLast={index === data.length - 1}>
                <div className="flex items-start sm:items-center gap-4 w-full pt-1 sm:pt-0">
                  <div className="shrink-0">
                    {item.photoUrl ? (
                      <Image src={item.photoUrl} alt={item.name} width={56} height={56} className="rounded-xl object-cover w-14 h-14 border border-gray-200 shadow-sm" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100 shadow-sm text-sm">
                        <Activity size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[15px] text-gray-900 truncate">{item.name}</p>
                    <p className="text-[13px] text-gray-500 mt-0.5 line-clamp-1">{item.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.schedule && (
                        <span className="text-[11px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Jadwal: {item.schedule}</span>
                      )}
                      {item.coach && (
                        <span className="text-[11px] font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">Pembina: {item.coach}</span>
                      )}
                    </div>
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
        title={editingId ? "Edit Ekstrakurikuler" : "Ekstrakurikuler Baru"}
        onSubmit={handleSubmit}
      >
        <InsetGroup>
          <InsetRow label="Nama Ekstrakurikuler" vertical>
            <AppleInput required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Pramuka" className="w-full text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent text-left" />
          </InsetRow>
          <InsetRow label="Deskripsi Singkat" vertical>
            <textarea 
              required 
              rows={2}
              value={formData.description} 
              onChange={e => setFormData({ ...formData, description: e.target.value })} 
              placeholder="Kegiatan kepanduan wajib bagi siswa." 
              className="w-full text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent text-left resize-none mt-1" 
            />
          </InsetRow>
          <InsetRow label="Jadwal (Opsional)" vertical>
            <AppleInput type="text" value={formData.schedule} onChange={e => setFormData({ ...formData, schedule: e.target.value })} placeholder="Setiap Jumat, 14:00 - 16:00" className="w-full text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent text-left" />
          </InsetRow>
          <InsetRow label="Nama Pembina (Opsional)" vertical>
            <AppleInput type="text" value={formData.coach} onChange={e => setFormData({ ...formData, coach: e.target.value })} placeholder="Bapak Budi, S.Pd." className="w-full text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent text-left" />
          </InsetRow>
          <MediaUploaderRow
            label="Foto Kegiatan (Opsional)"
            value={formData.photoUrl}
            onChange={(val) => setFormData({ ...formData, photoUrl: val })}
            isLast
          />
        </InsetGroup>
      </AppleModal>
    </div>
  );
}
