"use client";

import React, { useState, useEffect } from "react";
import { getGalleryPhotos, createGalleryPhoto, updateGalleryPhoto, deleteGalleryPhoto } from "@/actions/landing";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import Image from "next/image";
import { InsetGroup, InsetRow, AppleInput, AppleModal, MediaUploaderRow } from "@/components/admin/AppleStyle";

type GalleryPhoto = {
  id: string;
  src: string;
  alt: string;
  tall: boolean;
  order: number;
};

export default function GaleriAdminPage() {
  const [data, setData] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    src: "",
    alt: "",
    tall: false,
    order: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    const res = await getGalleryPhotos();
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (item?: GalleryPhoto) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        src: item.src,
        alt: item.alt,
        tall: item.tall,
        order: item.order,
      });
    } else {
      setEditingId(null);
      setFormData({
        src: "",
        alt: "",
        tall: false,
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
      await updateGalleryPhoto(editingId, formData);
    } else {
      await createGalleryPhoto(formData);
    }
    handleCloseModal();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus foto galeri ini?")) {
      await deleteGalleryPhoto(id);
      fetchData();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mac-admin">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="mac-title-2 text-gray-900">Galeri Foto</h1>
          <p className="mac-callout text-[#8e8e93] mt-0.5">Kelola foto-foto yang tampil di grid galeri Landing Page.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="mac-btn mac-btn-primary flex items-center gap-1.5"
        >
          <Plus size={15} /> Tambah Foto
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
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            </div>
            <p className="mac-headline text-[#3c3c43] mb-1">Belum Ada Foto Galeri</p>
            <p className="mac-callout text-[#8e8e93] max-w-[220px] leading-relaxed">
              Tekan "Tambah Foto" untuk menambahkan gambar pertama.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {data.map((item, index) => (
              <InsetRow key={item.id} isLast={index === data.length - 1}>
                <div className="flex items-center gap-4 w-full">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.1)] shrink-0">
                    <Image src={item.src} alt={item.alt} fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[15px] text-gray-900 truncate">{item.alt}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {item.tall ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">Tinggi (Tall)</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">Normal</span>
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
        title={editingId ? "Edit Foto" : "Foto Baru"}
        onSubmit={handleSubmit}
      >
        <InsetGroup title="Gambar Galeri">
          <MediaUploaderRow label="URL Gambar" name="src" value={formData.src} onChange={(val) => setFormData({ ...formData, src: val })} isLast />
        </InsetGroup>

        <InsetGroup>
          <InsetRow label="Teks Alternatif (Alt)" vertical>
            <AppleInput required type="text" value={formData.alt} onChange={e => setFormData({ ...formData, alt: e.target.value })} placeholder="Deskripsi singkat foto" className="w-full text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent text-left" />
          </InsetRow>
          <InsetRow label="Gaya Foto Tinggi (Tall)" isLast>
            <div className="flex items-center">
              <input type="checkbox" checked={formData.tall} onChange={e => setFormData({ ...formData, tall: e.target.checked })} className="w-5 h-5 text-[#007aff] bg-gray-100 border-gray-300 rounded focus:ring-[#007aff] focus:ring-2" />
            </div>
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
