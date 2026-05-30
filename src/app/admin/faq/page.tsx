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
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">FAQ</h1>
          <p className="text-[14px] text-gray-500 font-medium mt-1">Kelola daftar pertanyaan yang sering diajukan.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#007aff] text-white text-[14px] font-medium rounded-xl hover:bg-[#0056b3] transition-colors shadow-sm active:scale-95"
        >
          <Plus size={18} /> Tambah FAQ
        </button>
      </div>

      <InsetGroup>
        {loading ? (
          <div className="p-10 text-center text-gray-500 font-medium">Memuat data...</div>
        ) : data.length === 0 ? (
          <div className="p-10 text-center text-gray-500 font-medium text-[14px]">Belum ada data FAQ. Silakan tambah baru.</div>
        ) : (
          <div className="flex flex-col">
            {data.map((item, index) => (
              <InsetRow key={item.id} isLast={index === data.length - 1}>
                <div className="flex items-start sm:items-center gap-4 w-full pt-1 sm:pt-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[15px] text-gray-900 mb-0.5">{item.question}</p>
                    <p className="text-[13px] text-gray-500 line-clamp-2">{item.answer}</p>
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
