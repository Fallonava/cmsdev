import { getDocuments } from "@/actions/document";
import { Download, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Pusat Unduhan | MTs Muhammadiyah 07 Purbalingga",
  description: "Pusat unduhan formulir, brosur, jadwal, dan dokumen penting lainnya.",
};

export default async function DokumenPage() {
  const documents = await getDocuments();

  // Group by category
  const categories = documents.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, typeof documents>);

  return (
    <main className="min-h-screen bg-[#fbfbfd] pt-32 pb-24 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
          <ChevronRight size={16} />
          <span className="text-gray-900">Pusat Unduhan</span>
        </div>

        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Pusat Unduhan
          </h1>
          <p className="text-xl text-gray-500 font-medium">
            Akses dan unduh formulir pendaftaran, kalender akademik, brosur, serta berkas penting lainnya.
          </p>
        </div>

        <div className="space-y-12">
          {Object.entries(categories).length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium text-lg">Belum ada dokumen yang tersedia.</p>
            </div>
          ) : (
            Object.entries(categories).map(([category, docs]) => (
              <div key={category}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 px-2 border-l-4 border-primary">
                  {category}
                </h2>
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                  <div className="divide-y divide-gray-100">
                    {docs.map((doc, idx) => (
                      <div key={doc.id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-gray-50/50 transition-colors">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <FileText size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900">{doc.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Diunggah pada {new Date(doc.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                        </div>
                        <a 
                          href={doc.fileUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#007aff] hover:bg-[#0056b3] text-white font-medium rounded-xl transition-colors shrink-0 shadow-sm active:scale-95"
                        >
                          <Download size={18} />
                          Unduh File
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
