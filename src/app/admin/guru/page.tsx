"use client";

import React, { useState, useEffect } from "react";
import { getTeachers, addTeacher, updateTeacher, deleteTeacher } from "@/actions/teacher";
import { Plus, Edit2, Trash2, Download } from "lucide-react";
import Image from "next/image";
import * as XLSX from "xlsx";
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

  const handleExport = () => {
    const exportData = data.map((item, index) => ({
      No: index + 1,
      Nama: item.name,
      Jabatan: item.position,
      "Mata Pelajaran": item.subjects || "-",
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Guru");
    XLSX.writeFile(workbook, "Data_Guru.xlsx");
  };

  return (
    <div className="w-full max-w-5xl mx-auto mac-admin">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="mac-title-2 text-gray-900">Direktori Guru &amp; Staf</h1>
          <p className="mac-callout text-[#8e8e93] mt-0.5">Kelola data tenaga pendidik dan staf sekolah.</p>
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
            <Plus size={15} /> Tambah Guru
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
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <p className="mac-headline text-[#3c3c43] mb-1">Belum Ada Data Guru</p>
            <p className="mac-callout text-[#8e8e93] max-w-[220px] leading-relaxed">
              Tekan "Tambah Guru" untuk menambahkan data pertama.
            </p>
          </div>
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
