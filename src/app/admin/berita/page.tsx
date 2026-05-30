import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FileText, Plus, Trash2, Edit2, CheckCircle2, Clock } from "lucide-react";
import { deleteBerita } from "@/actions/berita";
import { InsetGroup, InsetRow } from "@/components/admin/AppleStyle";

export default async function AdminBeritaPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Berita & Artikel</h1>
          <p className="text-[14px] text-gray-500 font-medium mt-1">Kelola artikel dan publikasi sekolah.</p>
        </div>
        <Link
          href="/admin/berita/tambah"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#007aff] text-white text-[14px] font-semibold rounded-xl hover:bg-[#0056b3] transition-colors shadow-sm active:scale-95"
        >
          <Plus size={18} strokeWidth={2.5} /> Tulis Berita
        </Link>
      </div>

      {/* List */}
      {posts.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-[1.25rem] border border-[#e5e5ea] shadow-sm py-24 flex flex-col items-center text-center px-6">
          <div className="w-20 h-20 bg-[#f2f2f7] rounded-2xl flex items-center justify-center mb-5 shadow-inner">
            <FileText size={36} strokeWidth={1.5} className="text-gray-400" />
          </div>
          <h3 className="text-[17px] font-bold text-gray-900 tracking-tight">Belum Ada Artikel</h3>
          <p className="text-[14px] text-gray-500 font-medium mt-2 max-w-xs leading-relaxed">
            Mulai buat berita atau pengumuman pertama untuk ditampilkan ke publik.
          </p>
          <Link
            href="/admin/berita/tambah"
            className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-[#007aff] text-white text-[14px] font-semibold rounded-xl hover:bg-[#0056b3] transition-colors shadow-sm active:scale-95"
          >
            <Plus size={16} /> Tulis Berita Pertama
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
                    <p className="font-semibold text-[15px] text-gray-900 truncate leading-snug">{post.title}</p>
                    <div className="flex items-center gap-2.5 mt-1">
                      {/* Status Badge */}
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${
                        post.published
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {post.published ? <CheckCircle2 size={10} strokeWidth={2.5} /> : <Clock size={10} strokeWidth={2.5} />}
                        {post.published ? "Publik" : "Draft"}
                      </span>
                      <span className="text-[12px] text-gray-400 font-medium">
                        {new Date(post.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Link
                      href={`/admin/berita/edit/${post.id}`}
                      className="w-9 h-9 flex items-center justify-center text-[#007aff] hover:bg-blue-50 rounded-xl transition-colors active:scale-95"
                    >
                      <Edit2 size={17} strokeWidth={2} />
                    </Link>
                    <form action={async () => {
                      "use server";
                      await deleteBerita(post.id);
                    }}>
                      <button
                        type="submit"
                        className="w-9 h-9 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-xl transition-colors active:scale-95"
                      >
                        <Trash2 size={17} strokeWidth={2} />
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
