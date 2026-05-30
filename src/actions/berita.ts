"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";



export async function createBerita(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const published = formData.get("published") === "on";
  let slug = formData.get("slug") as string;
  const imageUrl = formData.get("imageUrl") as string || null;
  
  if (!slug) {
    slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  await prisma.post.create({
    data: {
      title,
      content,
      slug,
      published,
      imageUrl,
    },
  });

  revalidatePath("/admin/berita");
  revalidatePath("/berita");
}

export async function getBeritaById(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
  });
  return post;
}

export async function updateBerita(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const published = formData.get("published") === "on";
  let slug = formData.get("slug") as string;
  const imageUrl = formData.get("imageUrl") as string || null;
  
  if (!slug) {
    slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  await prisma.post.update({
    where: { id },
    data: {
      title,
      content,
      slug,
      published,
      imageUrl,
    },
  });

  revalidatePath("/admin/berita");
  revalidatePath("/berita");
  revalidatePath(`/berita/${slug}`);
}

export async function deleteBerita(id: string) {
  await prisma.post.delete({
    where: { id },
  });

  revalidatePath("/admin/berita");
  revalidatePath("/berita");
}

export async function getPublishedBerita(take?: number) {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: take,
  });
  return posts;
}
