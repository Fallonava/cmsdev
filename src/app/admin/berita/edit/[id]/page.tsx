"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, Eye, PenLine, Loader2, ImageIcon, Link as LinkIcon, UploadCloud, LayoutPanelLeft, X, Sparkles } from "lucide-react";
import { getBeritaById, updateBerita } from "@/actions/berita";
import { uploadFile } from "@/actions/upload";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[àáâäãåā]/g, 'a')
    .replace(/[èéêëē]/g, 'e')
    .replace(/[ìíîïī]/g, 'i')
    .replace(/[òóôöõō]/g, 'o')
    .replace(/[ùúûüū]/g, 'u')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}

function MediaInput({ onUrl }: { onUrl: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadFile(fd);
    if (res.success && res.url) {
      setUrlInput(res.url);
      onUrl(res.url);
    }
    setUploading(false);
  };

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={urlInput}
          onChange={e => { setUrlInput(e.target.value); onUrl(e.target.value); }}
          placeholder="Tempel link gambar, atau upload file..."
          className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition"
        />
      </div>
      <input type="file" ref={fileRef} accept="image/*" onChange={handleUpload} className="hidden" />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="shrink-0 flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-bold text-gray-700 transition disabled:opacity-50"
      >
        {uploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
        Upload
      </button>
    </div>
  );
}

export default function EditBeritaPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [mode, setMode] = useState<"edit" | "preview" | "split">("split");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [published, setPublished] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    getBeritaById(resolvedParams.id).then((post) => {
      if (post) {
        setTitle(post.title);
        setSlug(post.slug);
        setSlugEdited(true);
        setContent(post.content);
        setImageUrl(post.imageUrl || "");
        setPublished(post.published);
      }
      setIsFetching(false);
    });
  }, [resolvedParams.id]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
  }, [content]);

  // Auto-slug from title
  useEffect(() => {
    if (!slugEdited) setSlug(slugify(title));
  }, [title, slugEdited]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const fd = new FormData();
    fd.append("title", title);
    fd.append("content", content);
    fd.append("slug", slug);
    fd.append("imageUrl", imageUrl);
    if (published) fd.append("published", "on");
    await updateBerita(resolvedParams.id, fd);
    setIsLoading(false);
    router.push("/admin/berita");
  }

  const MarkdownPreview = () => (
    <div className="h-full overflow-y-auto p-8 lg:p-12">
      {imageUrl && (
        <div className="w-full aspect-[16/7] rounded-2xl overflow-hidden mb-8 bg-gray-100">
          <img src={imageUrl} alt="Cover" className="w-full h-full object-cover" />
        </div>
      )}
      {title ? (
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-3">{title}</h1>
      ) : (
        <p className="text-3xl font-extrabold text-gray-300 tracking-tight italic mb-3">Judul artikel...</p>
      )}
      <div className="flex gap-3 items-center mb-8">
        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase">Informasi</span>
        <span className="text-sm text-gray-400 font-medium">{new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
        {wordCount > 0 && <span className="text-sm text-gray-400">· {Math.ceil(wordCount / 200)} menit baca</span>}
      </div>
      {content ? (
        <div className="prose prose-gray max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-2xl prose-blockquote:border-primary prose-blockquote:text-gray-600 prose-code:bg-gray-100 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      ) : (
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`h-4 bg-gray-100 rounded-full ${i === 3 ? 'w-3/4' : i === 7 ? 'w-1/2' : 'w-full'}`} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-full">
      {/* Top Navigation / Action Bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-xl border-b border-[#e5e5ea] shrink-0">
        
        {/* Left Actions */}
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-all active:scale-90">
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-[14px] font-bold text-gray-900 leading-tight">Edit Berita</h1>
            <p className="text-[12px] text-gray-500 font-medium">{wordCount} kata · {Math.ceil(wordCount / 200) || 0} menit baca</p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="hidden md:flex bg-[#e5e5ea]/50 p-1 rounded-lg gap-1">
          {([
            { id: "edit", icon: PenLine, label: "Tulis" },
            { id: "split", icon: LayoutPanelLeft, label: "Split" },
            { id: "preview", icon: Eye, label: "Preview" },
          ] as const).map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold transition-all ${mode === m.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <m.icon size={13} /> {m.label}
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div className={`relative w-9 h-5 rounded-full transition-colors duration-200 ease-in-out ${published ? 'bg-green-500' : 'bg-gray-300'}`}
              onClick={() => setPublished(!published)}>
              <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${published ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
            <span className="text-[12px] font-medium text-gray-700 hidden sm:block">
              {published ? <span className="text-green-600">Publikasikan</span> : "Simpan Draf"}
            </span>
          </label>
          <button
            type="submit"
            form="artikel-form"
            disabled={isLoading || !title || !content}
            className="flex items-center gap-1.5 bg-primary hover:opacity-90 text-white px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : null}
            {isLoading ? "Menyimpan..." : (published ? "Terbitkan" : "Simpan")}
          </button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className={`flex flex-1 overflow-hidden bg-[#f5f5f7] ${mode === 'split' ? 'divide-x divide-[#e5e5ea]' : ''}`}>

        {/* EDITOR PANE */}
        <AnimatePresence>
          {(mode === "edit" || mode === "split") && (
            <motion.div
              key="editor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col overflow-y-auto"
            >
              <form id="artikel-form" onSubmit={handleSubmit} className="flex flex-col p-6 lg:p-12 gap-8 max-w-3xl mx-auto w-full">
                
                {isFetching && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <Loader2 size={32} className="animate-spin text-primary" />
                  </div>
                )}

                {/* Cover Image */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <ImageIcon size={14} /> Gambar Sampul (Opsional)
                  </label>
                  <MediaInput onUrl={setImageUrl} />
                  {imageUrl && (
                    <div className="relative mt-2 w-full aspect-[16/7] rounded-2xl overflow-hidden bg-gray-100">
                      <img src={imageUrl} alt="Preview sampul" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setImageUrl("")}
                        className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black rounded-full flex items-center justify-center text-white">
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Title */}
                <div className="flex flex-col gap-2">
                  <textarea
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    rows={1}
                    placeholder="Tulis judul yang menarik..."
                    required
                    className="w-full text-3xl lg:text-4xl font-extrabold text-gray-900 placeholder:text-gray-200 bg-transparent border-none outline-none resize-none tracking-tight leading-tight overflow-hidden"
                    style={{ minHeight: "56px" }}
                    onInput={e => {
                      const t = e.currentTarget;
                      t.style.height = "auto";
                      t.style.height = `${t.scrollHeight}px`;
                    }}
                  />
                  {/* Auto-Slug Preview */}
                  {title && (
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-500">
                      <LinkIcon size={12} className="shrink-0 text-gray-400" />
                      <span className="text-gray-400 hidden sm:block">berita/</span>
                      <input
                        type="text"
                        value={slug}
                        onChange={e => { setSlug(slugify(e.target.value)); setSlugEdited(true); }}
                        className="flex-1 bg-transparent outline-none text-primary font-bold min-w-0"
                      />
                      {slugEdited && (
                        <button type="button" onClick={() => { setSlug(slugify(title)); setSlugEdited(false); }}
                          className="text-gray-400 hover:text-gray-600 font-medium shrink-0">Auto</button>
                      )}
                    </div>
                  )}
                </div>

                {/* Markdown Cheatsheet hint */}
                <div className="flex gap-4 flex-wrap text-xs text-gray-300 font-mono select-none">
                  {[["**tebal**", "tebal"], ["*miring*", "miring"], ["## Judul", "judul"], ["- item", "daftar"], ["`kode`", "kode"], ["> quote", "kutipan"]].map(([hint, label]) => (
                    <span key={label} title={label}>{hint}</span>
                  ))}
                </div>

                {/* Content Textarea */}
                <div>
                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    required
                    placeholder="Mulai menulis... Gunakan Markdown untuk format teks.&#10;&#10;## Contoh Judul Bagian&#10;Konten paragraf di sini...&#10;&#10;- Poin penting pertama&#10;- Poin penting kedua"
                    className="w-full min-h-[400px] text-base text-gray-700 leading-relaxed placeholder:text-gray-200 bg-transparent border-none outline-none resize-none font-mono"
                  />
                </div>

              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PREVIEW PANE */}
        <AnimatePresence>
          {(mode === "preview" || mode === "split") && (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`flex-1 bg-white overflow-hidden flex flex-col ${mode === 'preview' ? 'max-w-4xl mx-auto w-full' : ''}`}
            >
              <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-2 shrink-0">
                <Eye size={14} className="text-gray-400" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Preview Artikel</span>
              </div>
              <MarkdownPreview />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
