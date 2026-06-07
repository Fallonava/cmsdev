"use client";

import React, { useState, useEffect } from "react";
import { getAttendancesByClassAndDate, saveAttendances, getClassrooms } from "@/actions/akademik";
import { Save, Search } from "lucide-react";
import { InsetGroup, InsetRow } from "@/components/admin/AppleStyle";

type Student = {
  id: string;
  fullName: string;
  nisn: string;
  gender: string;
};

type Attendance = {
  studentId: string;
  status: string;
  notes?: string;
};

type Classroom = {
  id: string;
  name: string;
};

export default function AbsensiAdminPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  
  const [students, setStudents] = useState<Student[]>([]);
  const [attendances, setAttendances] = useState<Record<string, Attendance>>({});
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadClasses() {
      const cls = await getClassrooms();
      setClassrooms(cls as unknown as Classroom[]);
      if (cls.length > 0) {
        setSelectedClassId(cls[0].id);
      }
    }
    loadClasses();
  }, []);

  const handleFetchData = async () => {
    if (!selectedClassId || !selectedDate) return;
    
    setLoading(true);
    setMessage("");
    
    const res = await getAttendancesByClassAndDate(selectedClassId, selectedDate);
    
    if (res.success && res.data) {
      setStudents(res.data.students);
      
      const newAtt: Record<string, Attendance> = {};
      
      // Default all to HADIR
      res.data.students.forEach((s: Student) => {
        newAtt[s.id] = { studentId: s.id, status: "HADIR", notes: "" };
      });
      
      // Override with saved data if any
      res.data.attendances.forEach((a: any) => {
        newAtt[a.studentId] = { studentId: a.studentId, status: a.status, notes: a.notes || "" };
      });
      
      setAttendances(newAtt);
    } else {
      setMessage("Gagal mengambil data absensi.");
    }
    
    setLoading(false);
  };

  useEffect(() => {
    if (selectedClassId && selectedDate) {
      handleFetchData();
    }
  }, [selectedClassId, selectedDate]);

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendances(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }));
  };

  const handleNotesChange = (studentId: string, notes: string) => {
    setAttendances(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], notes }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    
    const dataToSave = Object.values(attendances);
    const res = await saveAttendances(selectedClassId, selectedDate, dataToSave);
    
    if (res.success) {
      setMessage("Berhasil menyimpan absensi!");
      setTimeout(() => setMessage(""), 3000);
    } else {
      setMessage("Gagal menyimpan absensi: " + res.error);
    }
    setSaving(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mac-admin pb-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="mac-title-2 text-gray-900">Portal Absensi</h1>
          <p className="mac-callout text-[#8e8e93] mt-0.5">Catat kehadiran siswa secara cepat dan terpusat.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Tanggal</label>
          <input 
            type="date" 
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all text-[15px]"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Pilih Kelas</label>
          <select 
            value={selectedClassId}
            onChange={e => setSelectedClassId(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all text-[15px]"
          >
            {classrooms.map(c => (
              <option key={c.id} value={c.id}>Kelas {c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-xl text-sm font-medium ${message.includes('Gagal') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
          {message}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3 text-[#8e8e93]">
          <div className="w-5 h-5 border-2 border-[#c7c7cc] border-t-[#007AFF] rounded-full animate-spin" />
          <span className="mac-callout">Memuat daftar siswa…</span>
        </div>
      ) : students.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 rounded-[1.25rem] bg-[#f5f5f7] border border-[#e5e5ea] flex items-center justify-center mb-4 text-[#c7c7cc]">
            <Search size={24} />
          </div>
          <p className="mac-headline text-[#3c3c43] mb-1">Tidak Ada Siswa</p>
          <p className="mac-callout text-[#8e8e93] max-w-[250px] leading-relaxed">
            Tidak ada siswa di kelas ini. Silakan tambahkan siswa terlebih dahulu.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Siswa</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest text-center">Kehadiran</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Catatan</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => {
                  const att = attendances[student.id] || { status: "HADIR", notes: "" };
                  return (
                    <tr key={student.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${idx === students.length - 1 ? 'border-b-0' : ''}`}>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[15px] text-gray-900 whitespace-nowrap">{student.fullName}</p>
                        <p className="text-[12px] text-gray-500 mt-0.5">{student.nisn} ({student.gender})</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {["HADIR", "IZIN", "SAKIT", "ALPA"].map(status => (
                            <label key={status} className={`flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                              att.status === status 
                                ? status === 'HADIR' ? 'bg-green-100 text-green-700 ring-2 ring-green-500/50' 
                                : status === 'IZIN' ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500/50'
                                : status === 'SAKIT' ? 'bg-amber-100 text-amber-700 ring-2 ring-amber-500/50'
                                : 'bg-red-100 text-red-700 ring-2 ring-red-500/50'
                                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                            }`}>
                              <input 
                                type="radio" 
                                name={`status-${student.id}`} 
                                value={status}
                                checked={att.status === status}
                                onChange={() => handleStatusChange(student.id, status)}
                                className="sr-only"
                              />
                              {status}
                            </label>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <input 
                          type="text" 
                          placeholder="Tambahkan catatan..."
                          value={att.notes || ""}
                          onChange={(e) => handleNotesChange(student.id, e.target.value)}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all text-[13px]"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="mac-btn mac-btn-primary flex items-center gap-2 px-8"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save size={16} /> Simpan Absensi
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
