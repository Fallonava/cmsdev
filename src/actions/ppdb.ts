"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createApplicant(formData: FormData) {
  try {
    const fullName = formData.get("fullName") as string;
    const nisn = formData.get("nisn") as string;
    const birthPlace = formData.get("birthPlace") as string;
    const birthDateStr = formData.get("birthDate") as string;
    const gender = formData.get("gender") as string;
    const prevSchool = formData.get("prevSchool") as string;
    const gradYear = formData.get("gradYear") as string;
    const parentName = formData.get("parentName") as string;
    const parentPhone = formData.get("parentPhone") as string;

    const existing = await prisma.applicant.findUnique({
      where: { nisn }
    });

    if (existing) {
      throw new Error("NISN sudah terdaftar!");
    }

    await prisma.applicant.create({
      data: {
        fullName,
        nisn,
        birthPlace,
        birthDate: new Date(birthDateStr),
        gender,
        prevSchool,
        gradYear,
        parentName,
        parentPhone,
        status: "PENDING"
      },
    });

    revalidatePath("/admin/ppdb");
    return { success: true };
  } catch (error: any) {
    throw new Error(error.message || "Gagal menyimpan pendaftaran.");
  }
}

export async function getApplicants() {
  try {
    const applicants = await prisma.applicant.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: applicants };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateApplicantStatus(id: string, status: string) {
  try {
    const updated = await prisma.applicant.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/admin/ppdb");
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteApplicant(id: string) {
  try {
    await prisma.applicant.delete({
      where: { id },
    });

    revalidatePath("/admin/ppdb");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
