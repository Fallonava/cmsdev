import { prisma } from "@/lib/prisma";
import { Users, CheckCircle2, XCircle, Clock, Trash2, Smartphone } from "lucide-react";
import { updateApplicantStatus, deleteApplicant } from "@/actions/ppdb";
import { InsetGroup, InsetRow } from "@/components/admin/AppleStyle";export default async function AdminPPDBPage() {
  const applicants = await prisma.applicant.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Data Pendaftar PPDB</h1>
        <p className="text-[13px] text-gray-500 font-medium">Manajemen data peserta didik baru yang masuk melalui sistem online.</p>
      </div>

      <InsetGroup>
        {applicants.length === 0 ? (
          <div className="py-24 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-5 border border-gray-100 shadow-inner">
              <Users size={40} strokeWidth={1.5} />
            </div>
            <h3 className="text-[16px] font-bold text-gray-900 tracking-tight">Belum Ada Pendaftar</h3>
            <p className="text-[13px] text-gray-500 font-medium mt-1 max-w-xs">Data pendaftar dari formulir online PPDB akan muncul di layar ini secara otomatis.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {applicants.map((app, index) => (
              <InsetRow key={app.id} isLast={index === applicants.length - 1}>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-[13px] text-gray-500 shadow-[0_1px_3px_rgba(0,0,0,0.1)] shrink-0">
                    {app.fullName.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0 text-left">
                    <p className="font-semibold text-[15px] text-gray-900 truncate">{app.fullName} <span className="text-gray-400 font-medium text-[12px] ml-1">({app.nisn})</span></p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[13px] text-gray-500 truncate">{app.prevSchool}</p>
                      <span className="text-gray-300">&bull;</span>
                      <a href={`https://wa.me/${app.parentPhone.replace(/^0/, '62')}`} target="_blank" rel="noreferrer" className="text-[13px] text-blue-500 hover:underline inline-flex items-center gap-1 transition-colors hover:text-blue-600">
                        <Smartphone size={12} /> {app.parentPhone}
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                  <div className="flex items-center">
                    {app.status === "PENDING" && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-amber-200 text-[12px] font-semibold bg-amber-50 text-amber-700">
                        <Clock size={12} /> Menunggu
                      </div>
                    )}
                    {app.status === "APPROVED" && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-green-200 text-[12px] font-semibold bg-green-50 text-green-700">
                        <CheckCircle2 size={12} /> Diterima
                      </div>
                    )}
                    {app.status === "REJECTED" && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-red-200 text-[12px] font-semibold bg-red-50 text-red-700">
                        <XCircle size={12} /> Ditolak
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {app.status === "PENDING" && (
                      <>
                        <form action={async () => { "use server"; await updateApplicantStatus(app.id, "APPROVED") }}>
                          <button className="flex items-center justify-center w-7 h-7 text-green-600 hover:bg-green-50 rounded-md transition-all active:scale-90">
                            <CheckCircle2 size={16} />
                          </button>
                        </form>
                        <form action={async () => { "use server"; await updateApplicantStatus(app.id, "REJECTED") }}>
                          <button className="flex items-center justify-center w-7 h-7 text-red-600 hover:bg-red-50 rounded-md transition-all active:scale-90">
                            <XCircle size={16} />
                          </button>
                        </form>
                      </>
                    )}
                    {app.status !== "PENDING" && (
                      <form action={async () => { "use server"; await deleteApplicant(app.id) }}>
                        <button className="flex items-center justify-center w-7 h-7 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-md transition-all active:scale-90">
                          <Trash2 size={15} />
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </InsetRow>
            ))}
          </div>
        )}
      </InsetGroup>
    </div>
  );
}
