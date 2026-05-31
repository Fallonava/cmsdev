"use client";

import React, { useRef, useState, useEffect } from "react";
import { Link as LinkIcon, X, UploadCloud } from "lucide-react";
import { uploadFile } from "@/actions/upload";
import { motion, AnimatePresence } from "framer-motion";
import { macSheetVariants, macBackdropVariants } from "@/lib/macosAnimations";

// ── INSET GROUP ───────────────────────────────────────────────────────────────
export function InsetGroup({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      {title && (
        <h2 className="mac-label-caps mb-2 px-1">{title}</h2>
      )}
      <div className="bg-white rounded-[1.125rem] overflow-hidden border border-[#e5e5ea] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        {children}
      </div>
    </div>
  );
}

// ── INSET ROW ─────────────────────────────────────────────────────────────────
export function InsetRow({
  label,
  children,
  isLast = false,
  vertical = false,
  onClick,
}: {
  label?: string;
  children: React.ReactNode;
  isLast?: boolean;
  vertical?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className={[
        "flex",
        vertical ? "flex-col gap-2 items-start" : "flex-row items-center justify-between",
        "px-4 py-3",
        !isLast ? "border-b border-[#e5e5ea]" : "",
        onClick ? "hover:bg-[#f5f5f7] cursor-default transition-colors duration-100 active:bg-[#ebebef]" : "",
      ].join(" ")}
      onClick={onClick}
    >
      {label && (
        <label className="mac-body font-medium text-[#1c1c1e] shrink-0 select-none">
          {label}
        </label>
      )}
      <div className={`w-full ${vertical ? "" : "max-w-md flex justify-end"} flex-1`}>
        {children}
      </div>
    </div>
  );
}

// ── APPLE INPUT ───────────────────────────────────────────────────────────────
export function AppleInput(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { rows: number }
): React.ReactElement;
export function AppleInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
): React.ReactElement;
export function AppleInput({ ...props }: any) {
  const baseClass =
    "w-full mac-body text-[#1c1c1e] placeholder-[#c7c7cc] focus:outline-none bg-transparent";
  if ("rows" in props) {
    return (
      <textarea
        {...props}
        className={props.className ?? `${baseClass} resize-none`}
      />
    );
  }
  return (
    <input
      {...props}
      className={props.className ?? `${baseClass} text-right`}
    />
  );
}

// ── MEDIA UPLOADER ROW ────────────────────────────────────────────────────────
export function MediaUploaderRow({
  label,
  name,
  defaultValue,
  value,
  onChange,
  isLast = false,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  value?: string;
  onChange?: (val: string) => void;
  isLast?: boolean;
}) {
  const [val, setVal] = useState(defaultValue || "");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value !== undefined) setVal(value);
  }, [value]);

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
      <div className="flex justify-between items-center w-full mb-2">
        <label className="mac-body font-medium text-[#1c1c1e]">{label}</label>
        {val && (
          <div className="w-10 h-10 rounded-lg bg-[#f5f5f7] border border-[#e5e5ea] overflow-hidden relative shrink-0">
            {val.match(/\.(mp4|webm)$/i) ? (
              <video src={val} className="w-full h-full object-cover" muted />
            ) : (
              <img
                src={val}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2 w-full">
        <div className="relative flex-1 bg-[#f5f5f7] rounded-lg overflow-hidden border border-[#e5e5ea]">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#aeaeb2]">
            <LinkIcon size={13} />
          </div>
          <input
            type="text"
            name={name}
            value={val}
            onChange={handleChange}
            className="w-full py-2 pl-8 pr-3 mac-callout text-[#1c1c1e] focus:outline-none bg-transparent"
            placeholder="https://… atau /uploads/…"
          />
        </div>

        <input
          type="file"
          ref={inputRef}
          onChange={handleUpload}
          className="hidden"
          accept="image/*,video/*"
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="mac-btn mac-btn-secondary mac-btn-sm flex items-center gap-1.5 shrink-0"
        >
          {uploading ? (
            <div className="w-3.5 h-3.5 border-2 border-[#c7c7cc] border-t-[#007AFF] rounded-full animate-spin" />
          ) : (
            <UploadCloud size={13} />
          )}
          {uploading ? "…" : "Upload"}
        </button>
      </div>
    </InsetRow>
  );
}

// ── APPLE MODAL (macOS Sheet) ─────────────────────────────────────────────────
export function AppleModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel = "Simpan",
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel?: string;
}) {
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            variants={macBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 bg-black/25 backdrop-blur-[6px]"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            variants={macSheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-0 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 left-1/2 -translate-x-1/2 z-[51]
                       w-full sm:w-full sm:max-w-[500px] max-h-[90vh]
                       bg-[#f2f2f7] rounded-t-[1.75rem] sm:rounded-[1.5rem]
                       overflow-hidden flex flex-col
                       shadow-[0_32px_80px_rgba(0,0,0,0.22)]
                       border border-white/30"
          >
            {/* Handle bar (mobile) */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-9 h-[4.5px] rounded-full bg-[#c7c7cc]" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/60 backdrop-blur-md border-b border-[#e5e5ea]/60 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="mac-btn-ghost mac-btn mac-btn-sm flex items-center gap-1 text-[#007AFF]"
              >
                <X size={14} /> Batal
              </button>
              <h3 className="mac-headline text-[#1c1c1e] absolute left-1/2 -translate-x-1/2">
                {title}
              </h3>
              <button
                type="button"
                onClick={onSubmit as any}
                className="mac-btn mac-btn-primary mac-btn-sm"
              >
                {submitLabel}
              </button>
            </div>

            {/* Body */}
            <div className="p-4 overflow-y-auto mac-admin">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── LOADING SPINNER (macOS style) ─────────────────────────────────────────────
export function MacSpinner({ size = 20 }: { size?: number }) {
  return (
    <div
      className="rounded-full border-2 border-[#c7c7cc] border-t-[#007AFF] animate-spin"
      style={{ width: size, height: size }}
    />
  );
}

// ── EMPTY STATE ───────────────────────────────────────────────────────────────
export function MacEmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
      <div className="w-16 h-16 rounded-[1.25rem] bg-[#f5f5f7] border border-[#e5e5ea] flex items-center justify-center mb-4 text-[#c7c7cc]">
        {icon}
      </div>
      <p className="mac-headline text-[#3c3c43] mb-1">{title}</p>
      {description && (
        <p className="mac-callout text-[#8e8e93] max-w-[240px] leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

// ── MAC STATUS BADGE ──────────────────────────────────────────────────────────
export function MacBadge({
  label,
  color = "gray",
}: {
  label: string;
  color?: "blue" | "green" | "red" | "orange" | "purple" | "gray";
}) {
  const colors = {
    blue:   "bg-[#007AFF]/12 text-[#007AFF]",
    green:  "bg-[#34C759]/12 text-[#1a8a3a]",
    red:    "bg-[#FF3B30]/12 text-[#FF3B30]",
    orange: "bg-[#FF9500]/12 text-[#b86800]",
    purple: "bg-[#AF52DE]/12 text-[#7b2fa8]",
    gray:   "bg-[#8e8e93]/12 text-[#636366]",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full mac-callout font-semibold ${colors[color]}`}
    >
      {label}
    </span>
  );
}
