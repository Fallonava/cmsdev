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
    <div className="w-full max-w-5xl mx-auto mac-admin">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="mac-title-2 text-gray-900">Ekstrakurikuler</h1>
          <p className="mac-callout text-[#8e8e93] mt-0.5">Kelola data kegiatan ekstrakurikuler siswa.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="mac-btn mac-btn-primary flex items-center gap-1.5"
        >
          <Plus size={15} /> Tambah Ekskul
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
            <div className="w-16 h-16 rounded-[1.25rem] bg-[#f5f5f7] border border-[#e5e5ea] flex items-center justify-center mb-4">
              <Activity size={28} strokeWidth={1.5} className="text-[#c7c7cc]" />
            </div>
            <p className="mac-headline text-[#3c3c43] mb-1">Belum Ada Ekstrakurikuler</p>
            <p className="mac-callout text-[#8e8e93] max-w-[220px] leading-relaxed">
              Tekan "Tambah Ekskul" untuk menambahkan kegiatan pertama.
            </p>
          </div>
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
            name="photoUrl"
            value={formData.photoUrl}
            onChange={(val) => setFormData({ ...formData, photoUrl: val })}
            isLast
          />
        </InsetGroup>
      </AppleModal>
    </div>
  );
}
