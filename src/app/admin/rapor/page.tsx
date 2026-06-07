"use client";

import React, { useState } from "react";
import { searchStudentsForPayment } from "@/actions/keuangan"; // Reuse search action
import { getStudentReportCard } from "@/actions/penilaian";
import { Search, Printer, FileText, User as UserIcon } from "lucide-react";
import { InsetGroup, InsetRow } from "@/components/admin/AppleStyle";

export default function CetakRaporPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  
  const [semester, setSemester] = useState(1);
  const [academicYear, setAcademicYear] = useState("2026/2027");

  const [reportData, setReportData] = useState<any>(null);
  
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);

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
    fetchReport(student.id, semester, academicYear);
  };

  const fetchReport = async (studentId: string, sem: number, year: string) => {
    setLoadingReport(true);
    const res = await getStudentReportCard(studentId, sem, year);
    if (res.success && res.data) {
      setReportData(res.data);
    } else {
      setReportData(null);
    }
    setLoadingReport(false);
  };

  const handleFilterChange = () => {
    if (selectedStudent) {
      fetchReport(selectedStudent.id, semester, academicYear);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Convert number to letter grade (A/B/C/D)
  const getPredikat = (score: number) => {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    return "D";
  };

  return (
    <div className="w-full max-w-5xl mx-auto mac-admin pb-20 print:p-0 print:max-w-none">
      
      {/* --- NO PRINT SECTION --- */}
      <div className="print:hidden">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="mac-title-2 text-gray-900">Cetak e-Rapor</h1>
            <p className="mac-callout text-[#8e8e93] mt-0.5">Cari siswa dan cetak Laporan Hasil Belajar (Rapor).</p>
          </div>
          {reportData && (
            <button onClick={handlePrint} className="mac-btn mac-btn-primary flex items-center gap-2">
              <Printer size={16} /> Cetak PDF Rapor
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Search Box */}
          <div className="md:col-span-1 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative">
            <h3 className="text-[13px] font-bold text-gray-900 mb-3">Cari Siswa</h3>
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nama / NISN..."
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-[13px]"
              />
              <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
              <button type="submit" className="hidden">Search</button>
            </form>

            {searchResults.length > 0 && (
              <div className="absolute z-10 w-[calc(100%-40px)] mt-2 bg-white border border-gray-100 rounded-lg shadow-xl overflow-hidden">
                {searchResults.map((s, idx) => (
                  <button 
                    key={s.id} 
                    onClick={() => handleSelectStudent(s)}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 border-b border-gray-50"
                  >
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{s.fullName}</p>
                      <p className="text-[11px] text-gray-500">{s.nisn}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter */}
          <div className="md:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Tahun Ajaran</label>
              <select 
                value={academicYear}
                onChange={e => { setAcademicYear(e.target.value); setTimeout(handleFilterChange, 100); }}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-[14px]"
              >
                <option value="2025/2026">2025/2026</option>
                <option value="2026/2027">2026/2027</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Semester</label>
              <select 
                value={semester}
                onChange={e => { setSemester(Number(e.target.value)); setTimeout(handleFilterChange, 100); }}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-[14px]"
              >
                <option value={1}>Ganjil (1)</option>
                <option value={2}>Genap (2)</option>
              </select>
            </div>
            <button onClick={handleFilterChange} className="mac-btn mac-btn-ghost px-6 py-2 h-[38px]">Update</button>
          </div>
        </div>
      </div>
      {/* --- END NO PRINT --- */}


      {/* --- PRINTABLE RAPOR AREA --- */}
      {!reportData ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-gray-100 shadow-sm print:hidden">
          <div className="w-16 h-16 rounded-[1.25rem] bg-[#f5f5f7] border border-[#e5e5ea] flex items-center justify-center mb-4 text-[#c7c7cc]">
            <FileText size={24} />
          </div>
          <p className="mac-headline text-[#3c3c43] mb-1">Pilih Siswa</p>
          <p className="mac-callout text-[#8e8e93] max-w-[280px]">
            Silakan cari dan pilih siswa terlebih dahulu untuk menampilkan e-Rapor.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm print:shadow-none print:border-none print:p-0 w-full font-serif text-gray-900">
          
          {/* Header Surat Rapor */}
          <div className="border-b-[3px] border-double border-gray-900 pb-4 mb-6 flex items-center justify-between">
             <div className="text-left">
               <h2 className="text-2xl font-bold uppercase tracking-wider">Laporan Hasil Belajar</h2>
               <p className="text-sm font-semibold mt-1">SMP NEGERI 1 FALLONAVA</p>
               <p className="text-xs text-gray-600 mt-0.5">Jl. Pendidikan No. 123, Kota Cerdas</p>
             </div>
             <div className="text-right text-sm">
               <table className="text-left">
                 <tbody>
                   <tr><td className="py-0.5 pr-4 text-gray-500">Nama Siswa</td><td className="font-bold uppercase">:&nbsp;{reportData.student.fullName}</td></tr>
                   <tr><td className="py-0.5 pr-4 text-gray-500">NISN</td><td className="font-semibold">:&nbsp;{reportData.student.nisn}</td></tr>
                   <tr><td className="py-0.5 pr-4 text-gray-500">Kelas / Semester</td><td className="font-semibold">:&nbsp;{reportData.student.classroom?.name || "-"} / {semester === 1 ? '1 (Ganjil)' : '2 (Genap)'}</td></tr>
                   <tr><td className="py-0.5 pr-4 text-gray-500">Tahun Ajaran</td><td className="font-semibold">:&nbsp;{academicYear}</td></tr>
                 </tbody>
               </table>
             </div>
          </div>

          {/* Tabel Nilai */}
          <div className="mb-8">
            <h3 className="font-bold text-md mb-3">A. Sikap & Pengetahuan Akademik</h3>
            <table className="w-full border-collapse border border-gray-900 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-900 py-2 px-3 text-center w-[5%]">No</th>
                  <th className="border border-gray-900 py-2 px-3 text-center w-[30%]">Mata Pelajaran</th>
                  <th className="border border-gray-900 py-2 px-3 text-center w-[10%]">KKM</th>
                  <th className="border border-gray-900 py-2 px-3 text-center w-[10%]">Nilai</th>
                  <th className="border border-gray-900 py-2 px-3 text-center w-[10%]">Predikat</th>
                  <th className="border border-gray-900 py-2 px-3 text-center w-[35%]">Deskripsi Kemajuan</th>
                </tr>
              </thead>
              <tbody>
                {reportData.grades.length === 0 ? (
                  <tr><td colSpan={6} className="border border-gray-900 py-4 px-3 text-center italic text-gray-500">Belum ada data nilai semester ini.</td></tr>
                ) : (
                  reportData.grades.map((g: any, idx: number) => (
                    <tr key={g.id}>
                      <td className="border border-gray-900 py-2 px-3 text-center">{idx + 1}</td>
                      <td className="border border-gray-900 py-2 px-3 font-semibold">{g.subject.name}</td>
                      <td className="border border-gray-900 py-2 px-3 text-center">75</td>
                      <td className="border border-gray-900 py-2 px-3 text-center font-bold">{g.knowledgeScore || "-"}</td>
                      <td className="border border-gray-900 py-2 px-3 text-center font-bold">{g.knowledgeScore ? getPredikat(g.knowledgeScore) : "-"}</td>
                      <td className="border border-gray-900 py-2 px-3 text-xs leading-relaxed">{g.notes || "Tercapai dengan baik."}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Tabel Kehadiran */}
          <div className="mb-12 w-1/2">
            <h3 className="font-bold text-md mb-3">B. Ketidakhadiran</h3>
            <table className="w-full border-collapse border border-gray-900 text-sm">
              <tbody>
                <tr>
                  <td className="border border-gray-900 py-2 px-4 w-[60%]">Sakit</td>
                  <td className="border border-gray-900 py-2 px-4 text-center w-[40%]">{reportData.attendanceSummary.SAKIT} hari</td>
                </tr>
                <tr>
                  <td className="border border-gray-900 py-2 px-4">Izin</td>
                  <td className="border border-gray-900 py-2 px-4 text-center">{reportData.attendanceSummary.IZIN} hari</td>
                </tr>
                <tr>
                  <td className="border border-gray-900 py-2 px-4">Tanpa Keterangan</td>
                  <td className="border border-gray-900 py-2 px-4 text-center">{reportData.attendanceSummary.ALPA} hari</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tanda Tangan */}
          <div className="flex justify-between items-end mt-16 pt-8">
            <div className="text-center w-64">
              <p className="mb-20">Mengetahui,<br/>Orang Tua / Wali</p>
              <p className="font-bold border-b border-gray-900 pb-0.5 px-4 inline-block min-w-[200px]"></p>
            </div>
            <div className="text-center w-64">
              <p className="mb-20">Kota Cerdas, .................... 2026<br/>Wali Kelas</p>
              <p className="font-bold border-b border-gray-900 pb-0.5 px-4 inline-block min-w-[200px]"></p>
            </div>
          </div>

        </div>
      )}
      
      {/* Hide print styles globally if needed, done via tailwind print: modifier */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background-color: white !important; }
          .mac-vibrancy, header { display: none !important; }
          .mac-admin { background-color: white !important; padding: 0 !important; }
        }
      `}} />
    </div>
  );
}
