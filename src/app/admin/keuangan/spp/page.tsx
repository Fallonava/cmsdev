"use client";

import React, { useState } from "react";
import { searchStudentsForPayment, getStudentPayments, recordPayment } from "@/actions/keuangan";
import { Search, User as UserIcon, Calendar, CheckCircle2, AlertCircle, Printer } from "lucide-react";
import { InsetGroup, InsetRow, AppleInput } from "@/components/admin/AppleStyle";

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const DEFAULT_SPP_AMOUNT = 150000;

export default function PencatatanSPP() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  
  const [history, setHistory] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    paymentType: "SPP",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    amount: DEFAULT_SPP_AMOUNT,
    paymentMethod: "TUNAI"
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoadingSearch(true);
    const res = await searchStudentsForPayment(searchQuery);
    if (res.success && res.data) {
      setSearchResults(res.data);
    }
    setLoadingSearch(false);
  };

  const handleSelectStudent = async (student: any) => {
    setSelectedStudent(student);
    setSearchResults([]);
    setSearchQuery("");
    setMessage(null);
    
    setLoadingHistory(true);
    const res = await getStudentPayments(student.id);
    if (res.success && res.data) {
      setHistory(res.data);
    }
    setLoadingHistory(false);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    setProcessing(true);
    setMessage(null);

    const dataToSubmit = {
      studentId: selectedStudent.id,
      paymentType: formData.paymentType,
      amount: formData.amount,
      month: formData.paymentType === "SPP" ? formData.month : undefined,
      year: formData.paymentType === "SPP" ? formData.year : undefined,
      paymentMethod: formData.paymentMethod,
    };

    const res = await recordPayment(dataToSubmit);
    if (res.success) {
      setMessage({ type: 'success', text: 'Pembayaran berhasil dicatat!' });
      // Refresh history
      const histRes = await getStudentPayments(selectedStudent.id);
      if (histRes.success && histRes.data) {
        setHistory(histRes.data);
      }
    } else {
      setMessage({ type: 'error', text: res.error || "Gagal mencatat pembayaran" });
    }
    setProcessing(false);
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
  };

  // Helper to check if a month is paid
  const isMonthPaid = (month: number, year: number) => {
    return history.some(h => h.paymentType === "SPP" && h.month === month && h.year === year && h.status === "LUNAS");
  };

  return (
    <div className="w-full max-w-5xl mx-auto mac-admin pb-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="mac-title-2 text-gray-900">Pembayaran Kasir</h1>
          <p className="mac-callout text-[#8e8e93] mt-0.5">Catat pembayaran SPP atau tagihan lainnya.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Search & Payment Form */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Search Box */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-[15px] font-bold text-gray-900 mb-4">Cari Siswa</h3>
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Masukkan Nama / NISN..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all text-[15px]"
              />
              <Search size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
              <button type="submit" className="hidden">Search</button>
            </form>

            {loadingSearch && (
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <div className="w-4 h-4 border-2 border-[#c7c7cc] border-t-[#007AFF] rounded-full animate-spin" />
                Mencari...
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="mt-4 border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                {searchResults.map((s, idx) => (
                  <button 
                    key={s.id} 
                    onClick={() => handleSelectStudent(s)}
                    className={`w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors ${idx !== searchResults.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{s.fullName}</p>
                      <p className="text-xs text-gray-500">{s.nisn} • {s.classroom?.name || "Tanpa Kelas"}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Payment Form */}
          {selectedStudent && (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#007AFF]"></div>
              
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                  <UserIcon size={24} />
                </div>
                <div>
                  <p className="font-bold text-[17px] text-gray-900">{selectedStudent.fullName}</p>
                  <p className="text-sm text-gray-500">{selectedStudent.nisn} • Kelas {selectedStudent.classroom?.name || "-"}</p>
                </div>
              </div>

              {message && (
                <div className={`p-3 mb-6 rounded-lg text-sm font-medium flex items-start gap-2 ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                  {message.type === 'error' ? <AlertCircle size={16} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={16} className="mt-0.5 shrink-0" />}
                  {message.text}
                </div>
              )}

              <form onSubmit={handlePayment} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Jenis Tagihan</label>
                  <select 
                    value={formData.paymentType}
                    onChange={(e) => setFormData({...formData, paymentType: e.target.value})}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-[15px]"
                  >
                    <option value="SPP">SPP Bulanan</option>
                    <option value="Uang Gedung">Uang Gedung</option>
                    <option value="Seragam">Seragam</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                {formData.paymentType === "SPP" && (
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Bulan</label>
                      <select 
                        value={formData.month}
                        onChange={(e) => setFormData({...formData, month: Number(e.target.value)})}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-[15px]"
                      >
                        {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                      </select>
                    </div>
                    <div className="w-[100px]">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Tahun</label>
                      <input 
                        type="number" 
                        value={formData.year}
                        onChange={(e) => setFormData({...formData, year: Number(e.target.value)})}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-[15px]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Nominal Pembayaran</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-gray-500 font-semibold">Rp</span>
                    <input 
                      type="number" 
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-[15px] font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Metode Bayar</label>
                  <select 
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-[15px]"
                  >
                    <option value="TUNAI">Tunai Kasir</option>
                    <option value="TRANSFER">Transfer Bank</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  disabled={processing}
                  className="mt-2 w-full mac-btn mac-btn-primary py-3 flex items-center justify-center gap-2 text-[15px]"
                >
                  {processing ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Memproses...</>
                  ) : (
                    <><CheckCircle2 size={18} /> Konfirmasi Pembayaran</>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: History & SPP Grid */}
        <div className="lg:col-span-7">
          {!selectedStudent ? (
             <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <div className="w-16 h-16 rounded-[1.25rem] bg-[#f5f5f7] border border-[#e5e5ea] flex items-center justify-center mb-4 text-[#c7c7cc]">
                  <Calendar size={28} />
                </div>
                <p className="mac-headline text-[#3c3c43] mb-1">Riwayat Kosong</p>
                <p className="mac-callout text-[#8e8e93] max-w-[280px]">
                  Cari dan pilih siswa di kolom kiri untuk melihat riwayat pembayaran SPP.
                </p>
             </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
              
              {/* SPP Grid for current year */}
              <div className="p-6 bg-gray-50/50 border-b border-gray-100">
                <h3 className="text-[15px] font-bold text-gray-900 mb-4">Status SPP Tahun {formData.year}</h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {MONTHS.map((m, idx) => {
                    const paid = isMonthPaid(idx + 1, formData.year);
                    return (
                      <div 
                        key={idx} 
                        className={`p-2 rounded-xl border text-center transition-all ${
                          paid 
                            ? 'bg-green-50 border-green-200 text-green-700' 
                            : 'bg-white border-gray-200 text-gray-400'
                        }`}
                        title={paid ? "LUNAS" : "BELUM LUNAS"}
                      >
                        <p className="text-[10px] uppercase tracking-widest font-bold mb-0.5">{m.substring(0,3)}</p>
                        {paid ? <CheckCircle2 size={14} className="mx-auto" /> : <div className="w-3 h-3 rounded-full bg-gray-200 mx-auto mt-0.5"></div>}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* History List */}
              <div className="p-6 flex-1">
                <h3 className="text-[15px] font-bold text-gray-900 mb-4">Riwayat Transaksi</h3>
                {loadingHistory ? (
                  <div className="flex items-center justify-center py-10 gap-3 text-[#8e8e93]">
                    <div className="w-4 h-4 border-2 border-[#c7c7cc] border-t-[#007AFF] rounded-full animate-spin" />
                  </div>
                ) : history.length === 0 ? (
                  <p className="text-sm text-gray-500 italic text-center py-6">Belum ada riwayat pembayaran.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {history.map(h => (
                      <div key={h.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                        <div>
                          <p className="font-semibold text-sm text-gray-900">
                            {h.paymentType} {h.paymentType === "SPP" ? `- ${MONTHS[(h.month || 1) - 1]} ${h.year}` : ''}
                          </p>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            {new Date(h.paymentDate).toLocaleDateString('id-ID')} • {h.receiptNo}
                          </p>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <div>
                            <p className="font-bold text-sm text-green-600">{formatRupiah(h.amount)}</p>
                            <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-green-100 text-green-700 mt-0.5">LUNAS</span>
                          </div>
                          <button className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors" title="Cetak Kuitansi">
                            <Printer size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
