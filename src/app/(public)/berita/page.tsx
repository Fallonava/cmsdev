import { prisma } from "@/lib/prisma";
import { BookOpen, CalendarDays, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";


export const revalidate = 60;

export default async function BeritaPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="flex flex-col min-h-screen bg-[#fbfbfd]">
      
      {/* 1. Spatial Hero */}
      <section className="relative w-full pt-40 pb-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-5xl text-center flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-600 font-bold text-xs sm:text-sm shadow-sm border border-gray-100">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            Pusat Informasi
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold text-gray-900 tracking-tighter">
            Berita & <br className="hidden md:block"/> Pengumuman.
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-2xl leading-relaxed mt-2">
            Tetap terhubung dengan dinamika, prestasi, dan pengumuman terbaru dari MTs Muhammadiyah 07.
          </p>
        </div>
      </section>

      {/* 2. Floating Filter Capsule (Static visual) */}
      <section className="pb-12 sticky top-24 z-40 px-4">
        <div className="container mx-auto flex justify-center">
          <div className="flex bg-white/80 backdrop-blur-xl p-1.5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white">
            {["Semua Berita", "Akademik", "Prestasi", "Pengumuman"].map((cat, i) => (
              <button key={i} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${i === 0 ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. News Grid */}
      <section className="pb-32 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          {posts.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[3rem] shadow-sm border border-gray-100">
              <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-300 mx-auto mb-6">
                <BookOpen size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Belum Ada Publikasi</h3>
              <p className="text-gray-500 text-lg">Berita dan pengumuman akan segera hadir di sini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post.id} href={`/berita/${post.slug}`} className="group block">
                  <article className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 flex flex-col h-full relative">
                    
                    {/* Decorative Top Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                    <div className="h-56 bg-gray-100 w-full overflow-hidden relative">
                      {post.imageUrl ? (
                        <Image src={post.imageUrl} alt={post.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-gray-200">
                          <BookOpen size={48} className="opacity-10" />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-8 flex flex-col flex-grow bg-white relative z-10">
                      <div className="flex gap-2 mb-4">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
                          Informasi
                        </span>
                        <span className="px-3 py-1 bg-gray-50 border border-gray-100 text-gray-500 rounded-full text-xs font-medium flex items-center gap-1">
                          <CalendarDays size={12} />
                          {new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      
                      <h3 className="font-extrabold text-2xl text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2 tracking-tight leading-tight">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-500 text-base line-clamp-3 mb-6 leading-relaxed">
                        {post.content}
                      </p>
                      
                      <div className="mt-auto pt-4 border-t border-gray-100">
                        <span className="text-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                          Baca Artikel <ArrowRight size={16} />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
