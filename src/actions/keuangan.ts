"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ==========================================
// KEUANGAN ACTIONS
// ==========================================

export async function getDashboardStats() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Get today's income
    const todaysPayments = await prisma.payment.aggregate({
      where: {
        paymentDate: {
          gte: today,
        },
        status: "LUNAS",
      },
      _sum: {
        amount: true,
      },
    });

    // Get this month's income
    const monthsPayments = await prisma.payment.aggregate({
      where: {
        paymentDate: {
          gte: firstDayOfMonth,
        },
        status: "LUNAS",
      },
      _sum: {
        amount: true,
      },
    });

    // Get recent transactions
    const recentTransactions = await prisma.payment.findMany({
      take: 10,
      orderBy: { paymentDate: 'desc' },
      include: {
        student: {
          select: { fullName: true, nisn: true, classroom: { select: { name: true } } }
        }
      }
    });

    return {
      success: true,
      data: {
        todayIncome: todaysPayments._sum.amount || 0,
        monthIncome: monthsPayments._sum.amount || 0,
        recentTransactions
      }
    };
  } catch (error: any) {
    console.error("Error fetching financial stats:", error);
    return { success: false, error: error.message };
  }
}

export async function getStudentPayments(studentId: string) {
  try {
    const payments = await prisma.payment.findMany({
      where: { studentId },
      orderBy: [
        { year: 'desc' },
        { month: 'desc' },
        { paymentDate: 'desc' }
      ]
    });
    return { success: true, data: payments };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function searchStudentsForPayment(query: string) {
  try {
    const students = await prisma.student.findMany({
      where: {
        OR: [
          { fullName: { contains: query, mode: 'insensitive' } },
          { nisn: { contains: query } }
        ]
      },
      take: 10,
      include: {
        classroom: { select: { name: true } }
      }
    });
    return { success: true, data: students };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function recordPayment(data: {
  studentId: string;
  paymentType: string;
  amount: number;
  month?: number;
  year?: number;
  paymentMethod: string;
  notes?: string;
}) {
  try {
    // Check for duplicate monthly SPP payment
    if (data.paymentType.toUpperCase() === "SPP" && data.month && data.year) {
      const existing = await prisma.payment.findFirst({
        where: {
          studentId: data.studentId,
          paymentType: data.paymentType,
          month: data.month,
          year: data.year,
          status: "LUNAS"
        }
      });
      if (existing) {
        return { success: false, error: `Siswa ini sudah melunasi SPP untuk bulan ${data.month}/${data.year}` };
      }
    }

    // Generate receipt number (INV-YYYYMMDD-XXXX)
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const receiptNo = `INV-${dateStr}-${randomSuffix}`;

    const payment = await prisma.payment.create({
      data: {
        receiptNo,
        studentId: data.studentId,
        paymentType: data.paymentType,
        amount: data.amount,
        month: data.month || null,
        year: data.year || null,
        paymentMethod: data.paymentMethod,
        status: "LUNAS",
        notes: data.notes || "",
        paymentDate: new Date()
      }
    });

    revalidatePath("/admin/keuangan");
    revalidatePath("/admin/keuangan/spp");
    
    return { success: true, data: payment };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
