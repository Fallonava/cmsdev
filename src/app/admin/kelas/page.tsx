"use client";

import React, { useState, useEffect } from "react";
import { getClassrooms, createClassroom, updateClassroom, deleteClassroom, getTeachersForDropdown } from "@/actions/akademik";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { InsetGroup, InsetRow, AppleInput, AppleModal } from "@/components/admin/AppleStyle";

type Classroom = {
  id: string;
  name: string;
  grade: number;
  homeroomTeacherId: string | null;
  homeroomTeacher?: { name: string } | null;
  _count?: { students: number };
};

type Teacher = {
  id: string;
  name: string;
};

export default function KelasAdminPage() {
  const [data, setData] = useState<Classroom[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    grade: "7",
    homeroomTeacherId: "",
  });

  const fetchData = async () => {
    setLoading(true);
    const [res, teacherRes] = await Promise.all([
      getClassrooms(),
      getTeachersForDropdown()
    ]);
    setData(res as unknown as Classroom[]);
    setTeachers(teacherRes);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (item?: Classroom) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        name: item.name,
        grade: String(item.grade),
        homeroomTeacherId: item.homeroomTeacherId || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        grade: "7",
        homeroomTeacherId: "",
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
      await updateClassroom(editingId, { ...formData, grade: Number(formData.grade) });
    } else {
      await createClassroom({ ...formData, grade: Number(formData.grade) });
    }
    handleCloseModal();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus kelas ini?")) {
      await deleteClassroom(id);
      fetchData();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mac-admin">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="mac-title-2 text-gray-900">Direktori Kelas</h1>
          <p className="mac-callout text-[#8e8e93] mt-0.5">Kelola data kelas dan penetapan wali kelas.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenModal()}
            className="mac-btn mac-btn-primary flex items-center gap-1.5"
          >
            <Plus size={15} /> Tambah Kelas
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
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            </div>
            <p className="mac-headline text-[#3c3c43] mb-1">Belum Ada Data Kelas</p>
            <p className="mac-callout text-[#8e8e93] max-w-[220px] leading-relaxed">
              Tekan "Tambah Kelas" untuk menambahkan data ruang kelas.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {data.map((item, index) => (
              <InsetRow key={item.id} isLast={index === data.length - 1}>
                <div className="flex items-start sm:items-center justify-between w-full pt-1 sm:pt-0 gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[15px] text-gray-900 truncate">
                      Kelas {item.name} <span className="text-gray-400 font-normal text-[13px] ml-1">(Tingkat {item.grade})</span>
                    </p>
                    <p className="text-[13px] text-gray-500 mt-0.5 line-clamp-1">Wali Kelas: {item.homeroomTeacher?.name || "Belum Ditentukan"} • {item._count?.students || 0} Siswa</p>
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
        title={editingId ? "Edit Kelas" : "Kelas Baru"}
        onSubmit={handleSubmit}
      >
        <InsetGroup>
          <InsetRow label="Tingkat Kelas">
            <select value={formData.grade} onChange={e => setFormData({ ...formData, grade: e.target.value })} className="bg-transparent text-[15px] text-gray-900 focus:outline-none text-right">
              <option value="7">Kelas 7</option>
              <option value="8">Kelas 8</option>
              <option value="9">Kelas 9</option>
            </select>
          </InsetRow>
          <InsetRow label="Nama Kelas" vertical>
            <AppleInput required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="7A / VII-A" className="w-full text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent text-left" />
          </InsetRow>
          <InsetRow label="Wali Kelas (Opsional)" isLast>
            <select value={formData.homeroomTeacherId} onChange={e => setFormData({ ...formData, homeroomTeacherId: e.target.value })} className="bg-transparent text-[15px] text-gray-900 focus:outline-none text-right max-w-[200px] truncate">
              <option value="">Belum Ditentukan</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </InsetRow>
        </InsetGroup>
      </AppleModal>
    </div>
  );
}
