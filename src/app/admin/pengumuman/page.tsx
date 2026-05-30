"use client";

import React, { useState, useEffect } from "react";
import { getAnnouncements, addAnnouncement, updateAnnouncement, deleteAnnouncement } from "@/actions/announcement";
import { Plus, Edit2, Trash2, Megaphone } from "lucide-react";
import { InsetGroup, InsetRow, AppleInput, AppleModal } from "@/components/admin/AppleStyle";

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
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Mading Digital / Pengumuman</h1>
          <p className="text-[14px] text-gray-500 font-medium mt-1">Kelola pengumuman berjalan (Ticker) atau Popup di halaman depan.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#007aff] text-white text-[14px] font-medium rounded-xl hover:bg-[#0056b3] transition-colors shadow-sm active:scale-95"
        >
          <Plus size={18} /> Tambah Pengumuman
        </button>
      </div>

      <InsetGroup>
        {loading ? (
          <div className="p-10 text-center text-gray-500 font-medium">Memuat data...</div>
        ) : data.length === 0 ? (
          <div className="p-10 text-center text-gray-500 font-medium text-[14px]">Belum ada data pengumuman. Silakan tambah baru.</div>
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
                    <p className="font-semibold text-[15px] text-gray-900 line-clamp-2">{item.content}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {item.isActive ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${item.isPopup ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {item.isPopup ? 'Popup Modal' : 'Ticker / Teks Berjalan'}
                      </span>
                    </div>
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
