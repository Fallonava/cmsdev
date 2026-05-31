import { prisma } from "@/lib/prisma";
import { Users, CheckCircle2, XCircle, Clock, Trash2, Smartphone } from "lucide-react";
import { updateApplicantStatus, deleteApplicant } from "@/actions/ppdb";
import { InsetGroup, InsetRow, MacBadge } from "@/components/admin/AppleStyle";

export default async function AdminPPDBPage() {
  const applicants = await prisma.applicant.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="w-full max-w-5xl mx-auto mac-admin">
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="mac-title-2 text-gray-900">Data Pendaftar PPDB</h1>
        <p className="mac-callout text-[#8e8e93]">Manajemen data peserta didik baru yang masuk melalui sistem online.</p>
      </div>

      <InsetGroup>
        {applicants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-[1.25rem] bg-[#f5f5f7] border border-[#e5e5ea] flex items-center justify-center mb-4 text-[#c7c7cc]">
              <Users size={28} strokeWidth={1.5} />
            </div>
            <p className="mac-headline text-[#3c3c43] mb-1">Belum Ada Pendaftar</p>
            <p className="mac-callout text-[#8e8e93] max-w-[240px] leading-relaxed">
              Data pendaftar dari formulir online PPDB akan muncul di layar ini secara otomatis.
            </p>
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
                    <p className="font-semibold text-[15px] text-[#1c1c1e] truncate">{app.fullName} <span className="text-[#8e8e93] font-medium text-[12px] ml-1">({app.nisn})</span></p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="mac-caption text-[#8e8e93] truncate">{app.prevSchool}</p>
                      <span className="text-[#c7c7cc]">&bull;</span>
                      <a href={`https://wa.me/${app.parentPhone.replace(/^0/, '62')}`} target="_blank" rel="noreferrer" className="mac-caption text-[#007AFF] hover:underline inline-flex items-center gap-1">
                        <Smartphone size={12} /> {app.parentPhone}
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                  <div className="flex items-center">
                    {app.status === "PENDING" && <MacBadge label="Menunggu" color="orange" />}
                    {app.status === "APPROVED" && <MacBadge label="Diterima" color="green" />}
                    {app.status === "REJECTED" && <MacBadge label="Ditolak" color="red" />}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {app.status === "PENDING" && (
                      <>
                        <form action={async () => { "use server"; await updateApplicantStatus(app.id, "APPROVED") }}>
                          <button className="mac-btn mac-btn-sm flex items-center justify-center text-[#34C759] hover:bg-[#34C759]/10">
                            <CheckCircle2 size={13} />
                          </button>
                        </form>
                        <form action={async () => { "use server"; await updateApplicantStatus(app.id, "REJECTED") }}>
                          <button className="mac-btn mac-btn-sm flex items-center justify-center text-[#FF3B30] hover:bg-[#FF3B30]/10">
                            <XCircle size={13} />
                          </button>
                        </form>
                      </>
                    )}
                    {app.status !== "PENDING" && (
                      <form action={async () => { "use server"; await deleteApplicant(app.id) }}>
                        <button className="mac-btn mac-btn-sm flex items-center justify-center text-[#FF3B30] hover:bg-[#FF3B30]/10">
                          <Trash2 size={13} />
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
