"use client";

import React, { useState, useEffect } from "react";
import { getApplicants, updateApplicantStatus, deleteApplicant } from "@/actions/ppdb";
import { Search, MoreVertical, Trash2, CheckCircle2, XCircle, Clock, UserCheck, Calendar, Phone } from "lucide-react";
import { AppleModal } from "@/components/admin/AppleStyle";

const COLUMNS = [
  { id: "PENDING", title: "Baru Mendaftar", color: "border-blue-200 bg-blue-50/50", headerColor: "bg-blue-100 text-blue-800", icon: <Clock size={16} /> },
  { id: "INTERVIEW", title: "Proses Tes / Wawancara", color: "border-orange-200 bg-orange-50/50", headerColor: "bg-orange-100 text-orange-800", icon: <UserCheck size={16} /> },
  { id: "APPROVED", title: "Diterima / Lulus", color: "border-green-200 bg-green-50/50", headerColor: "bg-green-100 text-green-800", icon: <CheckCircle2 size={16} /> },
  { id: "REJECTED", title: "Ditolak", color: "border-red-200 bg-red-50/50", headerColor: "bg-red-100 text-red-800", icon: <XCircle size={16} /> },
];

export default function PPDBKanban() {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [draggedId, setDraggedId] = useState<string | null>(null);

  // For Detail Modal
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await getApplicants();
    if (res.success && res.data) {
      setApplicants(res.data);
    }
    setLoading(false);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // allow drop
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (!draggedId) return;

    // Optimistic UI Update
    setApplicants(prev => 
      prev.map(app => app.id === draggedId ? { ...app, status: newStatus } : app)
    );

    const res = await updateApplicantStatus(draggedId, newStatus);
    if (!res.success) {
      // Revert if failed
      loadData();
    }
    setDraggedId(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus pendaftar ini permanen?")) {
      await deleteApplicant(id);
      loadData();
      setIsModalOpen(false);
    }
  };

  const filteredApplicants = applicants.filter(a => 
    a.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.nisn.includes(searchQuery) ||
    a.prevSchool.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto mac-admin pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mac-title-2 text-gray-900">PPDB Board</h1>
          <p className="mac-callout text-[#8e8e93] mt-0.5">Kelola pendaftar baru dengan mudah menggunakan Kanban Board.</p>
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Cari Siswa / NISN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#007AFF]/20 text-sm shadow-sm w-[280px]"
          />
          <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32 gap-3 text-[#8e8e93]">
          <div className="w-6 h-6 border-2 border-[#c7c7cc] border-t-[#007AFF] rounded-full animate-spin" />
          <span className="mac-callout">Memuat Board...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {COLUMNS.map(col => {
            const columnApps = filteredApplicants.filter(a => a.status === col.id);
            return (
              <div 
                key={col.id} 
                className={`rounded-3xl border ${col.color} overflow-hidden min-h-[500px] flex flex-col`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                {/* Column Header */}
                <div className={`${col.headerColor} p-4 border-b border-white/20 flex items-center justify-between`}>
                  <div className="flex items-center gap-2 font-bold text-sm tracking-wide">
                    {col.icon} {col.title}
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white/40 text-xs font-bold">
                    {columnApps.length}
                  </span>
                </div>

                {/* Column Body */}
                <div className="p-3 flex-1 flex flex-col gap-3">
                  {columnApps.map(app => (
                    <div 
                      key={app.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, app.id)}
                      onClick={() => { setSelectedApp(app); setIsModalOpen(true); }}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-grab hover:shadow-md transition-all group relative active:cursor-grabbing"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-bold text-[14px] text-gray-900 leading-tight pr-5">{app.fullName}</p>
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium mb-3">{app.nisn}</p>
                      
                      <div className="flex items-center justify-between text-[11px] text-gray-500">
                        <span className="bg-gray-50 px-2 py-1 rounded-md border border-gray-100 truncate max-w-[120px]">
                          {app.prevSchool}
                        </span>
                        <span>{new Date(app.createdAt).toLocaleDateString("id-ID", { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  ))}

                  {columnApps.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 text-center opacity-50 border-2 border-dashed border-gray-200/50 rounded-2xl mx-2">
                      <p className="text-[11px] font-semibold text-gray-500">Kosong</p>
                      <p className="text-[10px] text-gray-400 mt-1 px-4">Tarik kartu ke sini</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Detail Modal */}
      <AppleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Detail Pendaftaran"
        onSubmit={(e) => e.preventDefault()}
      >
        {selectedApp && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 shrink-0 text-xl font-bold uppercase">
                {selectedApp.fullName.substring(0, 2)}
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-900">{selectedApp.fullName}</h3>
                <p className="text-sm text-gray-500">{selectedApp.nisn} • {selectedApp.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1"><Calendar size={12} className="inline mr-1" />TTL</p>
                <p className="font-semibold text-sm text-gray-900">{selectedApp.birthPlace}, {new Date(selectedApp.birthDate).toLocaleDateString('id-ID')}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Asal Sekolah</p>
                <p className="font-semibold text-sm text-gray-900">{selectedApp.prevSchool} ({selectedApp.gradYear})</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Nama Wali</p>
                <p className="font-semibold text-sm text-gray-900">{selectedApp.parentName}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1"><Phone size={12} className="inline mr-1" />No. Telp Wali</p>
                <p className="font-semibold text-sm text-gray-900">{selectedApp.parentPhone}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                selectedApp.status === 'PENDING' ? 'bg-blue-100 text-blue-700' : 
                selectedApp.status === 'INTERVIEW' ? 'bg-orange-100 text-orange-700' : 
                selectedApp.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                STATUS SAAT INI: {selectedApp.status}
              </span>
              
              <button 
                onClick={(e) => { e.preventDefault(); handleDelete(selectedApp.id); }}
                className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5"
              >
                <Trash2 size={16} /> Hapus Data
              </button>
            </div>
          </div>
        )}
      </AppleModal>
    </div>
  );
}
