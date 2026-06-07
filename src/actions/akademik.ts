"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ==========================================
// CLASSROOM ACTIONS
// ==========================================

export async function getClassrooms() {
  try {
    return await prisma.classroom.findMany({
      include: {
        homeroomTeacher: true,
        _count: {
          select: { students: true }
        }
      },
      orderBy: [
        { grade: 'asc' },
        { name: 'asc' }
      ]
    });
  } catch (error) {
    console.error("Failed to fetch classrooms:", error);
    return [];
  }
}

export async function createClassroom(data: { name: string; grade: number; homeroomTeacherId?: string }) {
  try {
    const classroom = await prisma.classroom.create({
      data: {
        name: data.name,
        grade: Number(data.grade),
        homeroomTeacherId: data.homeroomTeacherId || null,
      }
    });
    revalidatePath("/admin/kelas");
    return { success: true, data: classroom };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateClassroom(id: string, data: { name: string; grade: number; homeroomTeacherId?: string }) {
  try {
    const classroom = await prisma.classroom.update({
      where: { id },
      data: {
        name: data.name,
        grade: Number(data.grade),
        homeroomTeacherId: data.homeroomTeacherId || null,
      }
    });
    revalidatePath("/admin/kelas");
    return { success: true, data: classroom };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteClassroom(id: string) {
  try {
    await prisma.classroom.delete({ where: { id } });
    revalidatePath("/admin/kelas");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Gagal menghapus kelas. Pastikan kelas ini kosong (tidak ada siswa/jadwal)." };
  }
}

// ==========================================
// STUDENT ACTIONS
// ==========================================

export async function getStudents(filters?: { classroomId?: string; search?: string }) {
  try {
    return await prisma.student.findMany({
      where: {
        ...(filters?.classroomId ? { classroomId: filters.classroomId } : {}),
        ...(filters?.search ? {
          OR: [
            { fullName: { contains: filters.search, mode: 'insensitive' } },
            { nisn: { contains: filters.search } }
          ]
        } : {})
      },
      include: {
        classroom: true
      },
      orderBy: { fullName: 'asc' }
    });
  } catch (error) {
    console.error("Failed to fetch students:", error);
    return [];
  }
}

export async function createStudent(data: {
  nisn: string;
  fullName: string;
  gender: string;
  birthPlace: string;
  birthDate: string;
  classroomId?: string;
}) {
  try {
    const student = await prisma.student.create({
      data: {
        ...data,
        birthDate: new Date(data.birthDate),
        classroomId: data.classroomId || null,
      }
    });
    revalidatePath("/admin/siswa");
    return { success: true, data: student };
  } catch (error: any) {
    if (error.code === 'P2002') return { success: false, error: "NISN sudah terdaftar" };
    return { success: false, error: error.message };
  }
}

export async function updateStudent(id: string, data: {
  nisn: string;
  fullName: string;
  gender: string;
  birthPlace: string;
  birthDate: string;
  classroomId?: string;
}) {
  try {
    const student = await prisma.student.update({
      where: { id },
      data: {
        ...data,
        birthDate: new Date(data.birthDate),
        classroomId: data.classroomId || null,
      }
    });
    revalidatePath("/admin/siswa");
    return { success: true, data: student };
  } catch (error: any) {
    if (error.code === 'P2002') return { success: false, error: "NISN sudah digunakan" };
    return { success: false, error: error.message };
  }
}

export async function deleteStudent(id: string) {
  try {
    await prisma.student.delete({ where: { id } });
    revalidatePath("/admin/siswa");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Gagal menghapus siswa." };
  }
}

// ==========================================
// ATTENDANCE ACTIONS
// ==========================================

export async function getAttendancesByClassAndDate(classroomId: string, date: string) {
  try {
    const targetDate = new Date(date);
    // Reset time to midnight
    targetDate.setHours(0, 0, 0, 0);

    const attendances = await prisma.attendance.findMany({
      where: {
        classroomId,
        date: targetDate
      }
    });

    // We also need the students to map them
    const students = await prisma.student.findMany({
      where: { classroomId },
      orderBy: { fullName: 'asc' }
    });

    return { success: true, data: { attendances, students } };
  } catch (error: any) {
    console.error("Failed to fetch attendance:", error);
    return { success: false, error: error.message };
  }
}

export async function saveAttendances(classroomId: string, date: string, attendancesData: { studentId: string; status: string; notes?: string }[]) {
  try {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    // Use transaction to delete existing and create new
    await prisma.$transaction(async (tx) => {
      // 1. Delete existing attendances for this class and date
      await tx.attendance.deleteMany({
        where: {
          classroomId,
          date: targetDate
        }
      });

      // 2. Insert new attendances
      if (attendancesData.length > 0) {
        await tx.attendance.createMany({
          data: attendancesData.map(a => ({
            classroomId,
            date: targetDate,
            studentId: a.studentId,
            status: a.status,
            notes: a.notes || ""
          }))
        });
      }
    });

    revalidatePath("/admin/absensi");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save attendances:", error);
    return { success: false, error: "Gagal menyimpan data absensi." };
  }
}

// ==========================================
// TEACHER ACTIONS (Helpers for Dropdowns)
// ==========================================
export async function getTeachersForDropdown() {
  try {
    return await prisma.teacher.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    return [];
  }
}
