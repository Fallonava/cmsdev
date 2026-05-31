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
    <div className="w-full max-w-5xl mx-auto mac-admin">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="mac-title-2 text-gray-900">Pusat Unduhan</h1>
          <p className="mac-callout text-[#8e8e93] mt-0.5">Kelola file atau dokumen yang bisa diunduh oleh publik.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="mac-btn mac-btn-primary flex items-center gap-1.5"
        >
          <Plus size={15} /> Tambah Dokumen
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
              <FileText size={28} strokeWidth={1.5} />
            </div>
            <p className="mac-headline text-[#3c3c43] mb-1">Belum Ada Dokumen</p>
            <p className="mac-callout text-[#8e8e93] max-w-[220px] leading-relaxed">
              Tekan "Tambah Dokumen" untuk mengunggah file pertama.
            </p>
          </div>
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
            name="fileUrl"
            value={formData.fileUrl}
            onChange={(val) => setFormData({ ...formData, fileUrl: val })}
            isLast
          />
        </InsetGroup>
      </AppleModal>
    </div>
  );
}
