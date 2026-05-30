"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";



export async function createApplicant(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const nisn = formData.get("nisn") as string;
  const birthPlace = formData.get("birthPlace") as string;
  const birthDateStr = formData.get("birthDate") as string;
  const gender = formData.get("gender") as string;
  const prevSchool = formData.get("prevSchool") as string;
  const gradYear = formData.get("gradYear") as string;
  const parentName = formData.get("parentName") as string;
  const parentPhone = formData.get("parentPhone") as string;

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
    },
  });

  revalidatePath("/admin/ppdb");
  return { success: true };
}

export async function updateApplicantStatus(id: string, status: string) {
  await prisma.applicant.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/ppdb");
  revalidatePath("/admin");
}

export async function deleteApplicant(id: string) {
  await prisma.applicant.delete({
    where: { id },
  });

  revalidatePath("/admin/ppdb");
  revalidatePath("/admin");
}
