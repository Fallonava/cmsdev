"use client";

import React, { useState, useEffect } from "react";
import { getDocuments, addDocument, updateDocument, deleteDocument } from "@/actions/document";
import { Plus, Edit2, Trash2, FileText, Download } from "lucide-react";
import { InsetGroup, InsetRow, AppleInput, AppleModal, MediaUploaderRow } from "@/components/admin/AppleStyle";

type DocumentItem = {
  id: string;
  title: string;
  fileUrl: string;
  category: string;
  order: number;
};

export default function DokumenAdminPage() {
  const [data, setData] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    fileUrl: "",
    category: "Umum",
  });

  const fetchData = async () => {
    setLoading(true);
    const res = await getDocuments();
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (item?: DocumentItem) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        title: item.title,
        fileUrl: item.fileUrl,
        category: item.category,
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        fileUrl: "",
        category: "Umum",
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
      await updateDocument(editingId, formData);
    } else {
      await addDocument(formData);
    }
    handleCloseModal();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus dokumen ini?")) {
      await deleteDocument(id);
      fetchData();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Pusat Unduhan</h1>
          <p className="text-[14px] text-gray-500 font-medium mt-1">Kelola file atau dokumen yang bisa diunduh oleh publik.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#007aff] text-white text-[14px] font-medium rounded-xl hover:bg-[#0056b3] transition-colors shadow-sm active:scale-95"
        >
          <Plus size={18} /> Tambah Dokumen
        </button>
      </div>

      <InsetGroup>
        {loading ? (
          <div className="p-10 text-center text-gray-500 font-medium">Memuat data...</div>
        ) : data.length === 0 ? (
          <div className="p-10 text-center text-gray-500 font-medium text-[14px]">Belum ada dokumen. Silakan tambah baru.</div>
        ) : (
          <div className="flex flex-col">
            {data.map((item, index) => (
              <InsetRow key={item.id} isLast={index === data.length - 1}>
                <div className="flex items-start sm:items-center gap-4 w-full pt-1 sm:pt-0">
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100 shadow-sm">
                      <FileText size={24} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[15px] text-gray-900 truncate">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[11px] font-bold">
                        {item.category}
                      </span>
                      <a href={item.fileUrl} target="_blank" rel="noreferrer" className="text-[12px] text-blue-500 hover:underline flex items-center gap-1">
                        <Download size={12} /> Lihat File
                      </a>
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
        title={editingId ? "Edit Dokumen" : "Dokumen Baru"}
        onSubmit={handleSubmit}
      >
        <InsetGroup>
          <InsetRow label="Judul Dokumen" vertical>
            <AppleInput required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Brosur PPDB 2026" className="w-full text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent text-left" />
          </InsetRow>
          <InsetRow label="Kategori" vertical>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full text-[15px] text-gray-900 bg-transparent focus:outline-none py-1"
            >
              <option value="PPDB">PPDB</option>
              <option value="Akademik">Akademik</option>
              <option value="Umum">Umum</option>
            </select>
          </InsetRow>
          <MediaUploaderRow
            label="File Dokumen (PDF/DOC/Image)"
            value={formData.fileUrl}
            onChange={(val) => setFormData({ ...formData, fileUrl: val })}
            isLast
          />
        </InsetGroup>
      </AppleModal>
    </div>
  );
}
