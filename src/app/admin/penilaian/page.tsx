"use client";

import React, { useState, useEffect } from "react";
import { getSubjects, getGradesForInput, saveGradesBulk, createSubject } from "@/actions/penilaian";
import { getClassrooms } from "@/actions/akademik";
import { Save, Search, Table, AlertCircle, CheckCircle2, Plus } from "lucide-react";
import { AppleModal, AppleInput, InsetGroup, InsetRow } from "@/components/admin/AppleStyle";

export default function InputNilaiPage() {
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [semester, setSemester] = useState(1);
  const [academicYear, setAcademicYear] = useState("2026/2027");

  const [students, setStudents] = useState<any[]>([]);
  const [grades, setGrades] = useState<Record<string, { knowledgeScore: string; skillScore: string; notes: string }>>({});
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // New subject modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState({ code: "", name: "" });

  useEffect(() => {
    async function init() {
      const [cls, subjs] = await Promise.all([
        getClassrooms(),
        getSubjects()
      ]);
      setClassrooms(cls);
      setSubjects(subjs);
      
      if (cls.length > 0) setSelectedClassId(cls[0].id);
      if (subjs.length > 0) setSelectedSubjectId(subjs[0].id);
    }
    init();
  }, []);

  const handleFetchData = async () => {
    if (!selectedClassId || !selectedSubjectId) return;
    
    setLoading(true);
    setMessage(null);
    
    const res = await getGradesForInput(selectedClassId, selectedSubjectId, semester, academicYear);
    
    if (res.success && res.data) {
      setStudents(res.data.students);
      
      const newGrades: Record<string, any> = {};
      
      res.data.students.forEach((s: any) => {
        // Find existing
        const existing = res.data.existingGrades.find((g: any) => g.studentId === s.id);
        newGrades[s.id] = {
          knowledgeScore: existing?.knowledgeScore?.toString() || "",
          skillScore: existing?.skillScore?.toString() || "",
          notes: existing?.notes || ""
        };
      });
      
      setGrades(newGrades);
    } else {
      setMessage({ type: 'error', text: "Gagal mengambil data siswa." });
    }
    
    setLoading(false);
  };

  useEffect(() => {
    if (selectedClassId && selectedSubjectId) {
      handleFetchData();
    }
  }, [selectedClassId, selectedSubjectId, semester, academicYear]);

  const handleGradeChange = (studentId: string, field: 'knowledgeScore' | 'skillScore' | 'notes', value: string) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    
    const gradesToSave = students.map(s => ({
      studentId: s.id,
      knowledgeScore: parseFloat(grades[s.id].knowledgeScore) || 0,
      skillScore: parseFloat(grades[s.id].skillScore) || 0,
      notes: grades[s.id].notes
    }));

    const res = await saveGradesBulk({
      classroomId: selectedClassId,
      subjectId: selectedSubjectId,
      semester,
      academicYear,
      grades: gradesToSave
    });
    
    if (res.success) {
      setMessage({ type: 'success', text: "Nilai berhasil disimpan!" });
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: 'error', text: res.error || "Gagal menyimpan nilai." });
    }
    setSaving(false);
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createSubject(newSubject);
    if (res.success) {
      const subjs = await getSubjects();
      setSubjects(subjs);
      if (res.data) setSelectedSubjectId(res.data.id);
      setIsModalOpen(false);
      setNewSubject({ code: "", name: "" });
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mac-admin pb-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="mac-title-2 text-gray-900">Input Nilai Akademik</h1>
          <p className="mac-callout text-[#8e8e93] mt-0.5">Entri nilai Pengetahuan dan Keterampilan secara kolektif.</p>
        </div>
      </div>

      <div className="bg-white rounded-[1.25rem] p-5 border border-gray-100 shadow-sm mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Tahun Ajaran</label>
            <select 
              value={academicYear}
              onChange={e => setAcademicYear(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-[14px]"
            >
              <option value="2025/2026">2025/2026</option>
              <option value="2026/2027">2026/2027</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Semester</label>
            <select 
              value={semester}
              onChange={e => setSemester(Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-[14px]"
            >
              <option value={1}>Ganjil (1)</option>
              <option value={2}>Genap (2)</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Kelas</label>
            <select 
              value={selectedClassId}
              onChange={e => setSelectedClassId(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-[14px]"
            >
              {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex justify-between">
              Mata Pelajaran
              <button onClick={() => setIsModalOpen(true)} className="text-blue-500 hover:text-blue-700 font-normal">
                <Plus size={12} className="inline" /> Baru
              </button>
            </label>
            <select 
              value={selectedSubjectId}
              onChange={e => setSelectedSubjectId(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-[14px]"
            >
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
            </select>
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-xl text-sm font-medium flex items-center gap-2 ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
          {message.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3 text-[#8e8e93]">
          <div className="w-5 h-5 border-2 border-[#c7c7cc] border-t-[#007AFF] rounded-full animate-spin" />
          <span className="mac-callout">Mempersiapkan lembar penilaian…</span>
        </div>
      ) : students.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 rounded-[1.25rem] bg-[#f5f5f7] border border-[#e5e5ea] flex items-center justify-center mb-4 text-[#c7c7cc]">
            <Table size={24} />
          </div>
          <p className="mac-headline text-[#3c3c43] mb-1">Kelas Masih Kosong</p>
          <p className="mac-callout text-[#8e8e93] max-w-[280px] leading-relaxed">
            Pilih kelas lain atau pastikan sudah ada siswa yang didaftarkan ke kelas ini.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest w-[10%]">No</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest w-[30%]">Nama Siswa</th>
                  <th className="px-4 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest text-center w-[15%]">Pengetahuan<br/><span className="text-[9px] font-normal lowercase">(0-100)</span></th>
                  <th className="px-4 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest text-center w-[15%]">Keterampilan<br/><span className="text-[9px] font-normal lowercase">(0-100)</span></th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest w-[30%]">Catatan Guru</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => {
                  const g = grades[student.id] || { knowledgeScore: "", skillScore: "", notes: "" };
                  return (
                    <tr key={student.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[14px] text-gray-900 whitespace-nowrap">{student.fullName}</p>
                        <p className="text-[11px] text-gray-500">{student.nisn}</p>
                      </td>
                      <td className="px-4 py-4">
                        <input 
                          type="number" 
                          min="0" max="100"
                          value={g.knowledgeScore}
                          onChange={(e) => handleGradeChange(student.id, 'knowledgeScore', e.target.value)}
                          className="w-full px-2 py-1.5 text-center font-semibold bg-white border border-gray-200 rounded-md focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF]/20 outline-none transition-all text-[14px]"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <input 
                          type="number" 
                          min="0" max="100"
                          value={g.skillScore}
                          onChange={(e) => handleGradeChange(student.id, 'skillScore', e.target.value)}
                          className="w-full px-2 py-1.5 text-center font-semibold bg-white border border-gray-200 rounded-md focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF]/20 outline-none transition-all text-[14px]"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input 
                          type="text" 
                          placeholder="Deskripsi kemampuan..."
                          value={g.notes}
                          onChange={(e) => handleGradeChange(student.id, 'notes', e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-md focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF]/20 outline-none transition-all text-[13px]"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
             <span className="text-sm text-gray-500">Terdapat <b>{students.length}</b> siswa di kelas ini.</span>
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
                  <Save size={16} /> Simpan Nilai
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Modal Tambah Mapel */}
      <AppleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Mata Pelajaran Baru"
        onSubmit={handleAddSubject}
      >
        <InsetGroup>
          <InsetRow label="Kode Mapel" vertical>
            <AppleInput required type="text" value={newSubject.code} onChange={e => setNewSubject({ ...newSubject, code: e.target.value })} placeholder="MTK" className="w-full text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent text-left uppercase" />
          </InsetRow>
          <InsetRow label="Nama Mata Pelajaran" vertical isLast>
            <AppleInput required type="text" value={newSubject.name} onChange={e => setNewSubject({ ...newSubject, name: e.target.value })} placeholder="Matematika" className="w-full text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent text-left" />
          </InsetRow>
        </InsetGroup>
      </AppleModal>

    </div>
  );
}
