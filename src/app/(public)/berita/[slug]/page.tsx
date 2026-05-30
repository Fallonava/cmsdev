import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CalendarDays, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({ where: { published: true }, select: { slug: true } });
  return posts.map(p => ({ slug: p.slug }));
}

export default async function DetailBeritaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const post = await prisma.post.findFirst({
    where: { slug, published: true },
  });

  if (!post) notFound();

  const wordCount = post.content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <main className="min-h-screen bg-[#fbfbfd]">
      {/* Back Link */}
      <div className="fixed top-24 left-4 sm:left-6 z-30">
        <Link href="/berita" className="flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-xl rounded-full text-sm font-bold text-gray-700 shadow-sm border border-gray-200/80 hover:bg-white transition">
          <ArrowLeft size={16} /> Berita
        </Link>
      </div>

      {/* Hero Cover Image */}
      {post.imageUrl ? (
        <div className="relative w-full h-[45vh] md:h-[55vh] overflow-hidden">
          <Image src={post.imageUrl} alt={post.title} fill sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#fbfbfd]" />
        </div>
      ) : (
        <div className="h-32 md:h-40 bg-gradient-to-br from-primary/10 to-secondary/10" />
      )}

      {/* Article Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-32">
        <div className={`flex gap-10 items-start ${post.imageUrl ? '-mt-20' : 'mt-8'}`}>
          {/* Main Article Card */}
          <div className="flex-1 min-w-0 bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-gray-100/80 p-8 sm:p-12 lg:p-16">

            {/* Meta */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">Informasi</span>
              <span className="px-3 py-1 bg-gray-50 border border-gray-100 text-gray-500 rounded-full text-xs font-medium flex items-center gap-1.5">
                <CalendarDays size={12} />
                {new Date(post.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
              </span>
              <span className="px-3 py-1 bg-gray-50 border border-gray-100 text-gray-500 rounded-full text-xs font-medium flex items-center gap-1.5">
                <Clock size={12} />
                {readTime} menit baca
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-10">
              {post.title}
            </h1>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1 bg-gray-100" />
              <div className="w-2 h-2 rounded-full bg-primary" />
              <div className="h-px flex-1 bg-gray-100" />
            </div>

            {/* Markdown Content */}
            <div className="prose prose-gray max-w-none
              prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-gray-900
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-lg
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-xl prose-blockquote:not-italic
              prose-strong:text-gray-900
              prose-img:rounded-2xl prose-img:shadow-lg
              prose-code:bg-gray-100 prose-code:text-primary prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm
              prose-pre:bg-gray-900 prose-pre:rounded-2xl
              prose-ul:list-disc prose-ol:list-decimal
              prose-li:text-gray-700 prose-li:text-lg
              prose-table:w-full prose-th:bg-gray-50 prose-th:text-gray-900 prose-th:font-bold prose-td:text-gray-700">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
            </div>
          </div>

          {/* Sidebar — desktop only */}
          <aside className="hidden xl:flex flex-col gap-4 w-80 shrink-0 sticky top-28">
            {/* Info Card */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ringkasan</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-lg font-extrabold text-gray-900">{readTime} menit</p>
                  <p className="text-xs text-gray-400 font-medium">estimasi baca</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                  <CalendarDays size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{new Date(post.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                  <p className="text-xs text-gray-400 font-medium">tanggal terbit</p>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <Link href="/berita" className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold transition-all shadow-md hover:scale-105 text-sm">
              <ArrowLeft size={16} /> Semua Berita
            </Link>
          </aside>
        </div>

        {/* Mobile: Navigation Footer */}
        <div className="mt-10 flex items-center justify-center xl:hidden">
          <Link href="/berita" className="flex items-center gap-2 px-8 py-4 bg-gray-900 hover:bg-black text-white rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105">
            <ArrowLeft size={18} /> Lihat Semua Berita
          </Link>
        </div>
      </div>
    </main>
  );
}
