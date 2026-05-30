"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  try {
    const [
      totalStudents,
      totalTeachers,
      totalNews,
      totalGalleries,
      totalExtracurriculars,
      totalTestimonials
    ] = await Promise.all([
      prisma.applicant.count(),
      prisma.teacher.count(),
      prisma.post.count(),
      prisma.galleryPhoto.count(),
      prisma.extracurricular.count(),
      prisma.testimonial.count()
    ]);

    // Optional: Get recent applicants for dashboard
    const recentApplicants = await prisma.applicant.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return {
      stats: {
        totalStudents,
        totalTeachers,
        totalNews,
        totalGalleries,
        totalExtracurriculars,
        totalTestimonials
      },
      recentApplicants,
      success: true
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { success: false, stats: null, recentApplicants: [] };
  }
}
