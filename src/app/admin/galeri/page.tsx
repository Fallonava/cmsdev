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
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Galeri Foto</h1>
          <p className="text-[14px] text-gray-500 font-medium mt-1">Kelola foto-foto yang tampil di grid galeri Landing Page.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#007aff] text-white text-[14px] font-medium rounded-xl hover:bg-[#0056b3] transition-colors shadow-sm active:scale-95"
        >
          <Plus size={18} /> Tambah Foto
        </button>
      </div>

      <InsetGroup>
        {loading ? (
          <div className="p-10 text-center text-gray-500 font-medium">Memuat data...</div>
        ) : data.length === 0 ? (
          <div className="p-10 text-center text-gray-500 font-medium text-[14px]">Belum ada foto galeri. Silakan tambah baru.</div>
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
