"use client";

import React, { useState, useEffect } from "react";
import { getFaqs, createFaq, updateFaq, deleteFaq } from "@/actions/landing";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";

import { InsetGroup, InsetRow, AppleInput, AppleModal } from "@/components/admin/AppleStyle";

type Faq = {
  id: string;
  question: string;
  answer: string;
  order: number;
};

export default function FaqAdminPage() {
  const [data, setData] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    order: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    const res = await getFaqs();
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (item?: Faq) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        question: item.question,
        answer: item.answer,
        order: item.order,
      });
    } else {
      setEditingId(null);
      setFormData({
        question: "",
        answer: "",
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
      await updateFaq(editingId, formData);
    } else {
      await createFaq(formData);
    }
    handleCloseModal();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus FAQ ini?")) {
      await deleteFaq(id);
      fetchData();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mac-admin">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="mac-title-2 text-gray-900">FAQ</h1>
          <p className="mac-callout text-[#8e8e93] mt-0.5">Kelola daftar pertanyaan yang sering diajukan.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="mac-btn mac-btn-primary flex items-center gap-1.5"
        >
          <Plus size={15} /> Tambah FAQ
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
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <p className="mac-headline text-[#3c3c43] mb-1">Belum Ada FAQ</p>
            <p className="mac-callout text-[#8e8e93] max-w-[220px] leading-relaxed">
              Tekan "Tambah FAQ" untuk memasukkan pertanyaan pertama.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {data.map((item, index) => (
              <InsetRow key={item.id} isLast={index === data.length - 1}>
                <div className="flex items-start sm:items-center gap-4 w-full pt-1 sm:pt-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[15px] text-[#1c1c1e] mb-0.5">{item.question}</p>
                    <p className="text-[13px] text-[#8e8e93] line-clamp-2">{item.answer}</p>
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
        title={editingId ? "Edit FAQ" : "FAQ Baru"}
        onSubmit={handleSubmit}
      >
        <InsetGroup>
          <InsetRow label="Pertanyaan" vertical>
            <AppleInput required type="text" value={formData.question} onChange={e => setFormData({ ...formData, question: e.target.value })} placeholder="Contoh: Berapa biaya pendaftaran?" className="w-full text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent text-left" />
          </InsetRow>
          <InsetRow label="Jawaban" vertical isLast>
            <AppleInput required rows={3} value={formData.answer} onChange={e => setFormData({ ...formData, answer: e.target.value })} placeholder="Biaya pendaftaran adalah..." className="w-full text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent text-left resize-none" />
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
