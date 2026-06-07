"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSubjects() {
  try {
    return await prisma.subject.findMany({
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    return [];
  }
}

export async function createSubject(data: { code: string; name: string }) {
  try {
    const subject = await prisma.subject.create({ data });
    revalidatePath("/admin/penilaian");
    return { success: true, data: subject };
  } catch (error: any) {
    if (error.code === 'P2002') return { success: false, error: "Kode Mata Pelajaran sudah ada" };
    return { success: false, error: error.message };
  }
}

export async function getGradesForInput(classroomId: string, subjectId: string, semester: number, academicYear: string) {
  try {
    // Get all students in the classroom
    const students = await prisma.student.findMany({
      where: { classroomId },
      orderBy: { fullName: 'asc' },
      select: { id: true, fullName: true, nisn: true }
    });

    // Get existing grades for this combination
    const existingGrades = await prisma.grade.findMany({
      where: {
        classroomId,
        subjectId,
        semester,
        academicYear
      }
    });

    return { success: true, data: { students, existingGrades } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function saveGradesBulk(data: {
  classroomId: string;
  subjectId: string;
  semester: number;
  academicYear: string;
  grades: { studentId: string; knowledgeScore: number; skillScore: number; notes: string }[];
}) {
  try {
    await prisma.$transaction(async (tx) => {
      // For each student, upsert their grade
      for (const g of data.grades) {
        await tx.grade.upsert({
          where: {
            studentId_subjectId_semester_academicYear: {
              studentId: g.studentId,
              subjectId: data.subjectId,
              semester: data.semester,
              academicYear: data.academicYear
            }
          },
          update: {
            knowledgeScore: g.knowledgeScore || null,
            skillScore: g.skillScore || null,
            notes: g.notes || ""
          },
          create: {
            studentId: g.studentId,
            subjectId: data.subjectId,
            classroomId: data.classroomId,
            semester: data.semester,
            academicYear: data.academicYear,
            knowledgeScore: g.knowledgeScore || null,
            skillScore: g.skillScore || null,
            notes: g.notes || ""
          }
        });
      }
    });

    revalidatePath("/admin/penilaian");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save grades:", error);
    return { success: false, error: "Gagal menyimpan nilai" };
  }
}

export async function getStudentReportCard(studentId: string, semester: number, academicYear: string) {
  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        classroom: true
      }
    });

    if (!student) return { success: false, error: "Siswa tidak ditemukan" };

    const grades = await prisma.grade.findMany({
      where: {
        studentId,
        semester,
        academicYear
      },
      include: {
        subject: true
      },
      orderBy: {
        subject: { name: 'asc' }
      }
    });

    // Get attendance summary for the semester
    // As a simplification, we'll get attendance within a rough 6-month period, but normally it relies on strict academic calendar dates.
    // Since we don't have exact term dates in schema, we will skip fetching real attendance in this simplified e-Rapor or just fetch all.
    const attendances = await prisma.attendance.groupBy({
      by: ['status'],
      where: { studentId },
      _count: { status: true }
    });

    const attendanceSummary = {
      HADIR: attendances.find(a => a.status === "HADIR")?._count.status || 0,
      SAKIT: attendances.find(a => a.status === "SAKIT")?._count.status || 0,
      IZIN: attendances.find(a => a.status === "IZIN")?._count.status || 0,
      ALPA: attendances.find(a => a.status === "ALPA")?._count.status || 0,
    };

    return { 
      success: true, 
      data: { student, grades, attendanceSummary } 
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
