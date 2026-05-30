"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTeachers() {
  try {
    return await prisma.teacher.findMany({
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return [];
  }
}

export async function addTeacher(data: { name: string; position: string; subjects?: string; photoUrl?: string }) {
  try {
    const maxOrder = await prisma.teacher.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });
    
    const newOrder = maxOrder ? maxOrder.order + 1 : 0;
    
    const teacher = await prisma.teacher.create({
      data: {
        ...data,
        order: newOrder,
      },
    });
    revalidatePath("/admin/guru");
    revalidatePath("/profil");
    revalidatePath("/");
    return { success: true, teacher };
  } catch (error: any) {
    console.error("Error adding teacher:", error);
    return { success: false, error: error.message };
  }
}

export async function updateTeacher(id: string, data: { name?: string; position?: string; subjects?: string; photoUrl?: string }) {
  try {
    const teacher = await prisma.teacher.update({
      where: { id },
      data,
    });
    revalidatePath("/admin/guru");
    revalidatePath("/profil");
    revalidatePath("/");
    return { success: true, teacher };
  } catch (error: any) {
    console.error("Error updating teacher:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteTeacher(id: string) {
  try {
    await prisma.teacher.delete({
      where: { id },
    });
    revalidatePath("/admin/guru");
    revalidatePath("/profil");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting teacher:", error);
    return { success: false, error: error.message };
  }
}

export async function reorderTeachers(items: { id: string; order: number }[]) {
  try {
    await prisma.$transaction(
      items.map((item) =>
        prisma.teacher.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );
    revalidatePath("/admin/guru");
    revalidatePath("/profil");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error reordering teachers:", error);
    return { success: false, error: error.message };
  }
}
