"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getDocuments() {
  try {
    return await prisma.document.findMany({
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
}

export async function addDocument(data: { title: string; fileUrl: string; category?: string }) {
  try {
    const maxOrder = await prisma.document.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });
    
    const newOrder = maxOrder ? maxOrder.order + 1 : 0;
    
    const doc = await prisma.document.create({
      data: {
        ...data,
        category: data.category || "Umum",
        order: newOrder,
      },
    });
    revalidatePath("/admin/dokumen");
    revalidatePath("/dokumen");
    return { success: true, doc };
  } catch (error: any) {
    console.error("Error adding document:", error);
    return { success: false, error: error.message };
  }
}

export async function updateDocument(id: string, data: { title?: string; fileUrl?: string; category?: string }) {
  try {
    const doc = await prisma.document.update({
      where: { id },
      data,
    });
    revalidatePath("/admin/dokumen");
    revalidatePath("/dokumen");
    return { success: true, doc };
  } catch (error: any) {
    console.error("Error updating document:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteDocument(id: string) {
  try {
    await prisma.document.delete({
      where: { id },
    });
    revalidatePath("/admin/dokumen");
    revalidatePath("/dokumen");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting document:", error);
    return { success: false, error: error.message };
  }
}

export async function reorderDocuments(items: { id: string; order: number }[]) {
  try {
    await prisma.$transaction(
      items.map((item) =>
        prisma.document.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );
    revalidatePath("/admin/dokumen");
    revalidatePath("/dokumen");
    return { success: true };
  } catch (error: any) {
    console.error("Error reordering documents:", error);
    return { success: false, error: error.message };
  }
}
