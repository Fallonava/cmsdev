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
    <div className="w-full max-w-5xl mx-auto mac-admin">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="mac-title-2 text-gray-900">Testimoni</h1>
          <p className="mac-callout text-[#8e8e93] mt-0.5">Kelola daftar testimoni dari orang tua, siswa, atau alumni.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="mac-btn mac-btn-primary flex items-center gap-1.5"
        >
          <Plus size={15} /> Tambah Testimoni
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
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <p className="mac-headline text-[#3c3c43] mb-1">Belum Ada Testimoni</p>
            <p className="mac-callout text-[#8e8e93] max-w-[220px] leading-relaxed">
              Tekan "Tambah Testimoni" untuk menambahkan ulasan pertama.
            </p>
          </div>
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
