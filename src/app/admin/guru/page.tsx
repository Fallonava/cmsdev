"use client";

import React, { useState, useEffect } from "react";
import { getTeachers, addTeacher, updateTeacher, deleteTeacher } from "@/actions/teacher";
import { Plus, Edit2, Trash2 } from "lucide-react";
import Image from "next/image";
import { InsetGroup, InsetRow, AppleInput, AppleModal, MediaUploaderRow } from "@/components/admin/AppleStyle";

type Teacher = {
  id: string;
  name: string;
  position: string;
  subjects: string | null;
  photoUrl: string | null;
  order: number;
};

export default function GuruAdminPage() {
  const [data, setData] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    subjects: "",
    photoUrl: "",
  });

  const fetchData = async () => {
    setLoading(true);
    const res = await getTeachers();
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (item?: Teacher) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        name: item.name,
        position: item.position,
        subjects: item.subjects || "",
        photoUrl: item.photoUrl || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        position: "",
        subjects: "",
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
      await updateTeacher(editingId, formData);
    } else {
      await addTeacher(formData);
    }
    handleCloseModal();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus guru ini?")) {
      await deleteTeacher(id);
      fetchData();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Direktori Guru & Staf</h1>
          <p className="text-[14px] text-gray-500 font-medium mt-1">Kelola data tenaga pendidik dan staf sekolah.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#007aff] text-white text-[14px] font-medium rounded-xl hover:bg-[#0056b3] transition-colors shadow-sm active:scale-95"
        >
          <Plus size={18} /> Tambah Guru
        </button>
      </div>

      <InsetGroup>
        {loading ? (
          <div className="p-10 text-center text-gray-500 font-medium">Memuat data...</div>
        ) : data.length === 0 ? (
          <div className="p-10 text-center text-gray-500 font-medium text-[14px]">Belum ada data guru. Silakan tambah baru.</div>
        ) : (
          <div className="flex flex-col">
            {data.map((item, index) => (
              <InsetRow key={item.id} isLast={index === data.length - 1}>
                <div className="flex items-start sm:items-center gap-4 w-full pt-1 sm:pt-0">
                  <div className="shrink-0">
                    {item.photoUrl ? (
                      <Image src={item.photoUrl} alt={item.name} width={48} height={48} className="rounded-full object-cover w-12 h-12 border border-gray-200 shadow-sm" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold border border-gray-200 shadow-sm text-sm">
                        {item.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[15px] text-gray-900 truncate">{item.name}</p>
                    <p className="text-[13px] text-gray-500 mt-0.5 line-clamp-1">{item.position}</p>
                    {item.subjects && <p className="text-[12px] text-gray-400 mt-0.5 line-clamp-1 italic">{item.subjects}</p>}
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
        title={editingId ? "Edit Guru" : "Guru Baru"}
        onSubmit={handleSubmit}
      >
        <InsetGroup>
          <InsetRow label="Nama Lengkap" vertical>
            <AppleInput required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Bapak Ahmad, S.Pd." className="w-full text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent text-left" />
          </InsetRow>
          <InsetRow label="Jabatan" vertical>
            <AppleInput required type="text" value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })} placeholder="Guru Matematika" className="w-full text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent text-left" />
          </InsetRow>
          <InsetRow label="Mata Pelajaran (Opsional)" vertical>
            <AppleInput type="text" value={formData.subjects} onChange={e => setFormData({ ...formData, subjects: e.target.value })} placeholder="Aljabar, Geometri" className="w-full text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent text-left" />
          </InsetRow>
          <MediaUploaderRow
            label="Foto Guru (Opsional)"
            value={formData.photoUrl}
            onChange={(val) => setFormData({ ...formData, photoUrl: val })}
            isLast
          />
        </InsetGroup>
      </AppleModal>
    </div>
  );
}
