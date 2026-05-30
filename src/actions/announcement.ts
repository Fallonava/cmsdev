"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAnnouncements() {
  try {
    return await prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return [];
  }
}

export async function getActiveAnnouncements() {
  try {
    return await prisma.announcement.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching active announcements:", error);
    return [];
  }
}

export async function addAnnouncement(data: { content: string; isActive: boolean; isPopup: boolean }) {
  try {
    const announcement = await prisma.announcement.create({
      data,
    });
    revalidatePath("/admin/pengumuman");
    revalidatePath("/");
    revalidatePath("/layout"); // if it's placed in root layout
    return { success: true, announcement };
  } catch (error: any) {
    console.error("Error adding announcement:", error);
    return { success: false, error: error.message };
  }
}

export async function updateAnnouncement(id: string, data: { content?: string; isActive?: boolean; isPopup?: boolean }) {
  try {
    const announcement = await prisma.announcement.update({
      where: { id },
      data,
    });
    revalidatePath("/admin/pengumuman");
    revalidatePath("/");
    revalidatePath("/layout");
    return { success: true, announcement };
  } catch (error: any) {
    console.error("Error updating announcement:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteAnnouncement(id: string) {
  try {
    await prisma.announcement.delete({
      where: { id },
    });
    revalidatePath("/admin/pengumuman");
    revalidatePath("/");
    revalidatePath("/layout");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting announcement:", error);
    return { success: false, error: error.message };
  }
}
