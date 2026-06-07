"use client";

import React, { useState, useEffect } from "react";
import { getStudents, createStudent, updateStudent, deleteStudent, getClassrooms } from "@/actions/akademik";
import { Plus, Edit2, Trash2, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { InsetGroup, InsetRow, AppleInput, AppleModal } from "@/components/admin/AppleStyle";

type Student = {
  id: string;
  nisn: string;
  fullName: string;
  gender: string;
  birthPlace: string;
  birthDate: Date;
  classroomId: string | null;
  classroom?: { name: string } | null;
};

type Classroom = {
  id: string;
  name: string;
};

export default function SiswaAdminPage() {
  const [data, setData] = useState<Student[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nisn: "",
    fullName: "",
    gender: "L",
    birthPlace: "",
    birthDate: "",
    classroomId: "",
  });

  const fetchData = async () => {
    setLoading(true);
    const [res, classRes] = await Promise.all([
      getStudents(),
      getClassrooms()
    ]);
    setData(res);
    setClassrooms(classRes as unknown as Classroom[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (item?: Student) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        nisn: item.nisn,
        fullName: item.fullName,
        gender: item.gender,
        birthPlace: item.birthPlace,
        birthDate: new Date(item.birthDate).toISOString().split('T')[0],
        classroomId: item.classroomId || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        nisn: "",
        fullName: "",
        gender: "L",
        birthPlace: "",
        birthDate: "",
        classroomId: "",
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
      await updateStudent(editingId, formData);
    } else {
      await createStudent(formData);
    }
    handleCloseModal();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus data siswa ini?")) {
      await deleteStudent(id);
      fetchData();
    }
  };

  const handleExport = () => {
    const exportData = data.map((item, index) => ({
      No: index + 1,
      NISN: item.nisn,
      "Nama Lengkap": item.fullName,
      "L/P": item.gender,
      TTL: `${item.birthPlace}, ${new Date(item.birthDate).toLocaleDateString('id-ID')}`,
      Kelas: item.classroom?.name || "-",
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Siswa");
    XLSX.writeFile(workbook, "Data_Siswa.xlsx");
  };

  return (
    <div className="w-full max-w-5xl mx-auto mac-admin">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="mac-title-2 text-gray-900">Direktori Siswa</h1>
          <p className="mac-callout text-[#8e8e93] mt-0.5">Kelola data peserta didik secara menyeluruh.</p>
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
            <Plus size={15} /> Tambah Siswa
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
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <p className="mac-headline text-[#3c3c43] mb-1">Belum Ada Data Siswa</p>
            <p className="mac-callout text-[#8e8e93] max-w-[220px] leading-relaxed">
              Tekan "Tambah Siswa" untuk menambahkan data siswa.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {data.map((item, index) => (
              <InsetRow key={item.id} isLast={index === data.length - 1}>
                <div className="flex items-start sm:items-center justify-between w-full pt-1 sm:pt-0 gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[15px] text-gray-900 truncate">{item.fullName} <span className="text-gray-400 font-normal text-[13px]">({item.gender})</span></p>
                    <p className="text-[13px] text-gray-500 mt-0.5 line-clamp-1">NISN: {item.nisn} • {item.classroom?.name || "Belum ada kelas"}</p>
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
        title={editingId ? "Edit Siswa" : "Siswa Baru"}
        onSubmit={handleSubmit}
      >
        <InsetGroup>
          <InsetRow label="NISN" vertical>
            <AppleInput required type="text" value={formData.nisn} onChange={e => setFormData({ ...formData, nisn: e.target.value })} placeholder="10 digit NISN" className="w-full text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent text-left" />
          </InsetRow>
          <InsetRow label="Nama Lengkap" vertical>
            <AppleInput required type="text" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} placeholder="Budi Santoso" className="w-full text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent text-left" />
          </InsetRow>
          <InsetRow label="Jenis Kelamin">
            <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} className="bg-transparent text-[15px] text-gray-900 focus:outline-none text-right">
              <option value="L">Laki-laki (L)</option>
              <option value="P">Perempuan (P)</option>
            </select>
          </InsetRow>
          <InsetRow label="Tempat Lahir" vertical>
            <AppleInput required type="text" value={formData.birthPlace} onChange={e => setFormData({ ...formData, birthPlace: e.target.value })} placeholder="Purbalingga" className="w-full text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent text-left" />
          </InsetRow>
          <InsetRow label="Tanggal Lahir" vertical>
            <AppleInput required type="date" value={formData.birthDate} onChange={e => setFormData({ ...formData, birthDate: e.target.value })} className="w-full text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent text-left" />
          </InsetRow>
          <InsetRow label="Kelas (Opsional)" isLast>
            <select value={formData.classroomId} onChange={e => setFormData({ ...formData, classroomId: e.target.value })} className="bg-transparent text-[15px] text-gray-900 focus:outline-none text-right max-w-[200px] truncate">
              <option value="">Belum ada kelas</option>
              {classrooms.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </InsetRow>
        </InsetGroup>
      </AppleModal>
    </div>
  );
}
