"use client";

import React, { useState, useEffect } from "react";
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from "@/actions/landing";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import Image from "next/image";
import { InsetGroup, InsetRow, AppleInput, AppleModal, MediaUploaderRow } from "@/components/admin/AppleStyle";

type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
  avatarUrl: string | null;
  order: number;
};

export default function TestimoniAdminPage() {
  const [data, setData] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    quote: "",
    author: "",
    role: "",
    avatarUrl: "",
    order: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    const res = await getTestimonials();
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (item?: Testimonial) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        quote: item.quote,
        author: item.author,
        role: item.role,
        avatarUrl: item.avatarUrl || "",
        order: item.order,
      });
    } else {
      setEditingId(null);
      setFormData({
        quote: "",
        author: "",
        role: "",
        avatarUrl: "",
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
      await updateTestimonial(editingId, formData);
    } else {
      await createTestimonial(formData);
    }
    handleCloseModal();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus testimoni ini?")) {
      await deleteTestimonial(id);
      fetchData();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Testimoni</h1>
          <p className="text-[14px] text-gray-500 font-medium mt-1">Kelola daftar testimoni dari orang tua, siswa, atau alumni.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#007aff] text-white text-[14px] font-medium rounded-xl hover:bg-[#0056b3] transition-colors shadow-sm active:scale-95"
        >
          <Plus size={18} /> Tambah Testimoni
        </button>
      </div>

      <InsetGroup>
        {loading ? (
          <div className="p-10 text-center text-gray-500 font-medium">Memuat data...</div>
        ) : data.length === 0 ? (
          <div className="p-10 text-center text-gray-500 font-medium text-[14px]">Belum ada testimoni. Silakan tambah baru.</div>
        ) : (
          <div className="flex flex-col">
            {data.map((item, index) => (
              <InsetRow key={item.id} isLast={index === data.length - 1}>
                <div className="flex items-start sm:items-center gap-4 w-full pt-1 sm:pt-0">
                  <div className="shrink-0">
                    {item.avatarUrl ? (
                      <Image src={item.avatarUrl} alt={item.author} width={36} height={36} className="rounded-full object-cover w-10 h-10 border border-gray-200 shadow-sm" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold border border-gray-200 shadow-sm text-sm">
                        {item.author.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[15px] text-gray-900 truncate">{item.author} <span className="text-gray-400 font-medium text-[13px] ml-1">{item.role}</span></p>
                    <p className="text-[13px] text-gray-500 mt-0.5 line-clamp-2 italic">"{item.quote}"</p>
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
        title={editingId ? "Edit Testimoni" : "Testimoni Baru"}
        onSubmit={handleSubmit}
      >
        <InsetGroup>
          <InsetRow label="Nama Penulis" vertical>
            <AppleInput required type="text" value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} placeholder="Bapak Ahmad" className="w-full text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent text-left" />
          </InsetRow>
          <InsetRow label="Peran / Jabatan" vertical>
            <AppleInput required type="text" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} placeholder="Orang Tua Siswa" className="w-full text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent text-left" />
          </InsetRow>
          <InsetRow label="Isi Testimoni" vertical isLast>
            <AppleInput required rows={3} value={formData.quote} onChange={e => setFormData({ ...formData, quote: e.target.value })} placeholder="Sekolah ini sangat luar biasa..." className="w-full text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent text-left resize-none" />
          </InsetRow>
        </InsetGroup>

        <InsetGroup title="Foto Profil (Opsional)">
          <MediaUploaderRow label="URL Avatar" name="avatarUrl" value={formData.avatarUrl} onChange={(val) => setFormData({ ...formData, avatarUrl: val })} isLast />
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
