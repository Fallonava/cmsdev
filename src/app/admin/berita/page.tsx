import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FileText, Plus, Trash2, Edit2, CheckCircle2, Clock } from "lucide-react";
import { deleteBerita } from "@/actions/berita";
import { InsetGroup, InsetRow, MacBadge, MacEmptyState } from "@/components/admin/AppleStyle";

export default async function AdminBeritaPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="w-full max-w-5xl mx-auto mac-admin">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="mac-title-2 text-gray-900">Berita &amp; Artikel</h1>
          <p className="mac-callout text-[#8e8e93] mt-0.5">Kelola artikel dan publikasi sekolah.</p>
        </div>
        <Link
          href="/admin/berita/tambah"
          className="mac-btn mac-btn-primary flex items-center gap-1.5"
        >
          <Plus size={15} /> Tulis Berita
        </Link>
      </div>

      {/* List */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-[1.25rem] bg-[#f5f5f7] border border-[#e5e5ea] flex items-center justify-center mb-4 text-[#c7c7cc]">
            <FileText size={28} strokeWidth={1.5} />
          </div>
          <p className="mac-headline text-[#3c3c43] mb-1">Belum Ada Artikel</p>
          <p className="mac-callout text-[#8e8e93] max-w-[240px] leading-relaxed mb-6">
            Mulai buat berita atau pengumuman pertama untuk ditampilkan ke publik.
          </p>
          <Link
            href="/admin/berita/tambah"
            className="mac-btn mac-btn-primary flex items-center gap-1.5"
          >
            <Plus size={15} /> Tulis Berita Pertama
          </Link>
        </div>
      ) : (
        <InsetGroup>
          <div className="flex flex-col">
            {posts.map((post, index) => (
              <InsetRow key={post.id} isLast={index === posts.length - 1}>
                <div className="flex items-center gap-4 w-full">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-[#f2f2f7] flex items-center justify-center shrink-0">
                    <FileText size={18} strokeWidth={1.5} className={post.published ? "text-[#007aff]" : "text-gray-400"} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[15px] text-[#1c1c1e] truncate leading-snug">{post.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {/* Status Badge */}
                      <MacBadge 
                        label={post.published ? "Publik" : "Draft"} 
                        color={post.published ? "green" : "gray"} 
                      />
                      <span className="mac-caption font-medium">
                        {new Date(post.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Link
                      href={`/admin/berita/edit/${post.id}`}
                      className="mac-btn mac-btn-ghost mac-btn-sm flex items-center gap-1"
                    >
                      <Edit2 size={13} /> Edit
                    </Link>
                    <form action={async () => {
                      "use server";
                      await deleteBerita(post.id);
                    }}>
                      <button
                        type="submit"
                        className="mac-btn mac-btn-sm flex items-center gap-1 text-[#FF3B30] hover:bg-[#FF3B30]/10 active:bg-[#FF3B30]/20"
                      >
                        <Trash2 size={13} /> Hapus
                      </button>
                    </form>
                  </div>
                </div>
              </InsetRow>
            ))}
          </div>
        </InsetGroup>
      )}
    </div>
  );
}
