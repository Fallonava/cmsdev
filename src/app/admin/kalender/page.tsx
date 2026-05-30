"use client";

import React, { useState, useEffect } from "react";
import { getEvents, createEvent, updateEvent, deleteEvent } from "@/actions/landing";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";

import { InsetGroup, InsetRow, AppleInput, AppleModal } from "@/components/admin/AppleStyle";

type Event = {
  id: string;
  title: string;
  date: string;
  day: string;
  type: string;
  typeColor: string;
  order: number;
};

export default function KalenderAdminPage() {
  const [data, setData] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    day: "",
    type: "",
    typeColor: "bg-blue-100 text-blue-700",
    order: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    const res = await getEvents();
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (item?: Event) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        title: item.title,
        date: item.date,
        day: item.day,
        type: item.type,
        typeColor: item.typeColor,
        order: item.order,
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        date: "15 Jul",
        day: "Senin",
        type: "Akademik",
        typeColor: "bg-blue-100 text-blue-700",
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
      await updateEvent(editingId, formData);
    } else {
      await createEvent(formData);
    }
    handleCloseModal();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus agenda ini?")) {
      await deleteEvent(id);
      fetchData();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Kalender Akademik</h1>
          <p className="text-[14px] text-gray-500 font-medium mt-1">Kelola agenda kegiatan akademik sekolah.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#007aff] text-white text-[14px] font-medium rounded-xl hover:bg-[#0056b3] transition-colors shadow-sm active:scale-95"
        >
          <Plus size={18} /> Tambah Agenda
        </button>
      </div>

      <InsetGroup>
        {loading ? (
          <div className="p-10 text-center text-gray-500 font-medium">Memuat data...</div>
        ) : data.length === 0 ? (
          <div className="p-10 text-center text-gray-500 font-medium text-[14px]">Belum ada agenda. Silakan tambah baru.</div>
        ) : (
          <div className="flex flex-col">
            {data.map((item, index) => (
              <InsetRow key={item.id} isLast={index === data.length - 1}>
                <div className="flex items-center gap-4 w-full">
                  <div className="w-10 h-10 rounded-lg bg-gray-900 text-white flex flex-col items-center justify-center shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
                    <span className="text-[8px] font-bold text-gray-400 leading-none">{item.day}</span>
                    <span className="text-[13px] font-extrabold leading-tight mt-0.5">{item.date.split(" ")[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[15px] text-gray-900 truncate">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.typeColor}`}>{item.type}</span>
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
        title={editingId ? "Edit Agenda" : "Agenda Baru"}
        onSubmit={handleSubmit}
      >
        <InsetGroup>
          <InsetRow label="Judul Agenda" vertical>
            <AppleInput required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Contoh: Awal Masuk Sekolah" className="w-full text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent text-left" />
          </InsetRow>
        </InsetGroup>

        <InsetGroup>
          <InsetRow label="Tanggal & Bulan">
            <AppleInput required type="text" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} placeholder="Contoh: 15 Jul" />
          </InsetRow>
          <InsetRow label="Hari">
            <AppleInput required type="text" value={formData.day} onChange={e => setFormData({ ...formData, day: e.target.value })} placeholder="Contoh: Senin" />
          </InsetRow>
          <InsetRow label="Tipe / Kategori">
            <AppleInput required type="text" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} placeholder="Contoh: Libur Nasional" />
          </InsetRow>
          <InsetRow label="Kode Warna Background" isLast>
            <AppleInput required type="text" value={formData.typeColor} onChange={e => setFormData({ ...formData, typeColor: e.target.value })} placeholder="bg-red-100 text-red-700" />
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
