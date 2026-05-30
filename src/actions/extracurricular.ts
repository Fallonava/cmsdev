"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getExtracurriculars() {
  try {
    return await prisma.extracurricular.findMany({
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Error fetching extracurriculars:", error);
    return [];
  }
}

export async function addExtracurricular(data: { name: string; description: string; schedule?: string; coach?: string; photoUrl?: string }) {
  try {
    const maxOrder = await prisma.extracurricular.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });
    
    const newOrder = maxOrder ? maxOrder.order + 1 : 0;
    
    const item = await prisma.extracurricular.create({
      data: {
        ...data,
        order: newOrder,
      },
    });
    revalidatePath("/admin/ekskul");
    revalidatePath("/ekskul");
    revalidatePath("/");
    return { success: true, item };
  } catch (error: any) {
    console.error("Error adding extracurricular:", error);
    return { success: false, error: error.message };
  }
}

export async function updateExtracurricular(id: string, data: { name?: string; description?: string; schedule?: string; coach?: string; photoUrl?: string }) {
  try {
    const item = await prisma.extracurricular.update({
      where: { id },
      data,
    });
    revalidatePath("/admin/ekskul");
    revalidatePath("/ekskul");
    revalidatePath("/");
    return { success: true, item };
  } catch (error: any) {
    console.error("Error updating extracurricular:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteExtracurricular(id: string) {
  try {
    await prisma.extracurricular.delete({
      where: { id },
    });
    revalidatePath("/admin/ekskul");
    revalidatePath("/ekskul");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting extracurricular:", error);
    return { success: false, error: error.message };
  }
}

export async function reorderExtracurriculars(items: { id: string; order: number }[]) {
  try {
    await prisma.$transaction(
      items.map((item) =>
        prisma.extracurricular.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );
    revalidatePath("/admin/ekskul");
    revalidatePath("/ekskul");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error reordering extracurriculars:", error);
    return { success: false, error: error.message };
  }
}
