"use client";

import React, { useRef, useState, useEffect } from "react";
import { Link as LinkIcon } from "lucide-react";
import { uploadFile } from "@/actions/upload";

// ─── APPLE STYLE COMPONENTS ──────────────────────────────────────────────────

export function InsetGroup({ title, children }: { title?: string, children: React.ReactNode }) {
  return (
    <div className="mb-8">
      {title && <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">{title}</h2>}
      <div className="bg-white rounded-[1.25rem] overflow-hidden border border-[#e5e5ea] shadow-sm">
        {children}
      </div>
    </div>
  );
}

export function InsetRow({ label, children, isLast = false, vertical = false, onClick }: { label?: string, children: React.ReactNode, isLast?: boolean, vertical?: boolean, onClick?: () => void }) {
  const content = (
    <div className={`flex ${vertical ? 'flex-col gap-3 items-start' : 'flex-row items-center justify-between'} p-4 ${!isLast ? 'border-b border-[#e5e5ea]' : ''} ${onClick ? 'hover:bg-gray-50 cursor-pointer active:bg-gray-100 transition-colors' : ''}`} onClick={onClick}>
      {label && <label className="text-[15px] font-medium text-gray-900 shrink-0">{label}</label>}
      <div className={`w-full ${vertical ? '' : 'max-w-md flex justify-end'} flex-1`}>
        {children}
      </div>
    </div>
  );
  return content;
}

export function AppleInput(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { rows: number }): React.ReactElement;
export function AppleInput(props: React.InputHTMLAttributes<HTMLInputElement>): React.ReactElement;
export function AppleInput({ ...props }: any) {
  if ('rows' in props) {
    return <textarea {...props} className={props.className ?? "w-full text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none resize-none bg-transparent text-right"} />;
  }
  return <input {...props} className={props.className ?? "w-full text-right text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"} />;
}

export function MediaUploaderRow({ label, name, defaultValue, value, onChange, isLast = false }: { label: string, name: string, defaultValue?: string, value?: string, onChange?: (val: string) => void, isLast?: boolean }) {
  const [val, setVal] = useState(defaultValue || "");
  
  // Sinkronisasi dengan props value (controlled)
  useEffect(() => {
    if (value !== undefined) setVal(value);
  }, [value]);

  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    
    const res = await uploadFile(formData);
    if (res.success && res.url) {
      setVal(res.url);
      if (onChange) onChange(res.url);
    } else {
      alert(res.error || "Gagal upload");
    }
    setUploading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  return (
    <InsetRow isLast={isLast} vertical>
      <div className="flex justify-between items-center w-full">
        <label className="text-[15px] font-medium text-gray-900">{label}</label>
        {val && (
          <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden relative">
            {val.match(/\.(mp4|webm)$/i) ? (
               <video src={val} className="w-full h-full object-cover" muted />
            ) : (
               <img src={val} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
            )}
          </div>
        )}
      </div>
      
      <div className="flex gap-2 w-full mt-2">
        <div className="relative flex-1 bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <LinkIcon size={14} />
          </div>
          <input 
            type="text" 
            name={name} 
            value={val}
            onChange={handleChange}
            className="w-full py-2.5 pl-9 pr-3 text-[14px] text-gray-900 focus:outline-none bg-transparent" 
            placeholder="https://... atau /uploads/..."
            required 
          />
        </div>
        
        <input type="file" ref={inputRef} onChange={handleUpload} className="hidden" accept="image/*,video/*" />
        
        <button 
          type="button" 
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="shrink-0 flex items-center justify-center gap-2 bg-[#007aff] hover:bg-[#0056b3] text-white px-4 py-2.5 rounded-xl text-[14px] font-medium transition-colors disabled:opacity-50"
        >
          {uploading ? "..." : "Upload"}
        </button>
      </div>
    </InsetRow>
  );
}

export function AppleModal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  onSubmit, 
  submitLabel = "Simpan" 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  title: string, 
  children: React.ReactNode,
  onSubmit: (e: React.FormEvent) => void,
  submitLabel?: string
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#f2f2f7] rounded-[1.5rem] w-full max-w-[480px] overflow-hidden animate-in fade-in zoom-in-95 duration-200 shadow-[0_30px_60px_rgba(0,0,0,0.2)] flex flex-col max-h-[90vh] border border-white/20">
        
        {/* iOS Native-like Header */}
        <div className="flex items-center justify-between px-4 py-3.5 bg-white/80 backdrop-blur-md shrink-0 border-b border-gray-200/50 sticky top-0 z-10">
          <button type="button" onClick={onClose} className="text-[#007aff] hover:opacity-80 transition-opacity font-medium text-[16px]">
            Batal
          </button>
          <h3 className="font-semibold text-[16px] text-black tracking-tight">{title}</h3>
          <button type="button" onClick={onSubmit} className="text-[#007aff] hover:opacity-80 transition-opacity font-bold text-[16px]">
            {submitLabel}
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
