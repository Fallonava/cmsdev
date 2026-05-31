"use client";

import React, { useState, useEffect } from "react";
import { getAnnouncements, addAnnouncement, updateAnnouncement, deleteAnnouncement } from "@/actions/announcement";
import { Plus, Edit2, Trash2, Megaphone } from "lucide-react";
import { InsetGroup, InsetRow, AppleModal, MacBadge } from "@/components/admin/AppleStyle";

type Announcement = {
  id: string;
  content: string;
  isActive: boolean;
  isPopup: boolean;
  createdAt: Date;
};

export default function PengumumanAdminPage() {
  const [data, setData] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    content: "",
    isActive: true,
    isPopup: false,
  });

  const fetchData = async () => {
    setLoading(true);
    const res = await getAnnouncements();
    setData(res as any);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (item?: Announcement) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        content: item.content,
        isActive: item.isActive,
        isPopup: item.isPopup,
      });
    } else {
      setEditingId(null);
      setFormData({
        content: "",
        isActive: true,
        isPopup: false,
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
      await updateAnnouncement(editingId, formData);
    } else {
      await addAnnouncement(formData);
    }
    handleCloseModal();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus pengumuman ini?")) {
      await deleteAnnouncement(id);
      fetchData();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mac-admin">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="mac-title-2 text-gray-900">Mading Digital / Pengumuman</h1>
          <p className="mac-callout text-[#8e8e93] mt-0.5">Kelola pengumuman berjalan (Ticker) atau Popup di halaman depan.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="mac-btn mac-btn-primary flex items-center gap-1.5"
        >
          <Plus size={15} /> Tambah Pengumuman
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
              <Megaphone size={28} strokeWidth={1.5} />
            </div>
            <p className="mac-headline text-[#3c3c43] mb-1">Belum Ada Pengumuman</p>
            <p className="mac-callout text-[#8e8e93] max-w-[220px] leading-relaxed">
              Tekan "Tambah Pengumuman" untuk membuat pesan baru.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {data.map((item, index) => (
              <InsetRow key={item.id} isLast={index === data.length - 1}>
                <div className="flex items-start sm:items-center gap-4 w-full pt-1 sm:pt-0">
                  <div className="shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold border border-gray-200 shadow-sm ${item.isActive ? 'bg-green-500' : 'bg-gray-400'}`}>
                      <Megaphone size={20} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[15px] text-[#1c1c1e] line-clamp-2">{item.content}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <MacBadge 
                        label={item.isActive ? "Aktif" : "Tidak Aktif"} 
                        color={item.isActive ? "green" : "gray"} 
                      />
                      <MacBadge 
                        label={item.isPopup ? "Popup Modal" : "Ticker"} 
                        color={item.isPopup ? "purple" : "blue"} 
                      />
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
        title={editingId ? "Edit Pengumuman" : "Pengumuman Baru"}
        onSubmit={handleSubmit}
      >
        <InsetGroup>
          <InsetRow label="Isi Pengumuman" vertical>
            <textarea 
              required 
              rows={3}
              value={formData.content} 
              onChange={e => setFormData({ ...formData, content: e.target.value })} 
              placeholder="Tuliskan isi pengumuman di sini..." 
              className="w-full text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent text-left resize-none" 
            />
          </InsetRow>
          
          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200 bg-white">
            <span className="text-[15px] text-gray-900 font-medium">Status Aktif</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#34C759]"></div>
            </label>
          </div>

          <div className="px-4 py-3 flex items-center justify-between bg-white rounded-b-xl">
            <div className="flex flex-col">
              <span className="text-[15px] text-gray-900 font-medium">Tampilkan sebagai Popup</span>
              <span className="text-[12px] text-gray-500">Jika mati, akan tampil sebagai teks berjalan.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={formData.isPopup} onChange={(e) => setFormData({ ...formData, isPopup: e.target.checked })} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#34C759]"></div>
            </label>
          </div>
        </InsetGroup>
      </AppleModal>
    </div>
  );
}
