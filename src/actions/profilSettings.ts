"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSessionRole } from "./role";

export type ProfilSettings = {
  profil_hero_title: string;
  profil_hero_desc: string;
  profil_visi: string;
  profil_visi_desc: string;
  profil_misi: string; // JSON string array
};

const DEFAULT_SETTINGS: ProfilSettings = {
  profil_hero_title: "Berakar pada Akhlak, \nTumbuh Melampaui Batas.",
  profil_hero_desc: "Mengenal lebih dalam ruh pendidikan di MTs Muhammadiyah 07 Purbalingga—tempat bertemunya nilai luhur Islam dan inovasi masa depan.",
  profil_visi: "\"Mewujudkan Generasi Islami, Berakhlak Mulia, dan Berprestasi Global.\"",
  profil_visi_desc: "Visi ini menjadi kompas bagi seluruh aktivitas pendidikan. Kami mendidik tidak hanya untuk kecerdasan akademik, namun juga kematangan spiritual.",
  profil_misi: JSON.stringify([
    "Mengintegrasikan IPTEK dan IMTAQ secara holistik.",
    "Membentuk karakter berakhlakul karimah dan disiplin tinggi.",
    "Mengoptimalkan potensi bakat akademik & non-akademik.",
    "Menciptakan ekosistem belajar inovatif berbasis digital."
  ]),
};

export async function getProfilSettings(): Promise<ProfilSettings> {
  const keys = Object.keys(DEFAULT_SETTINGS);
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: keys } },
  });

  const settingMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return {
    profil_hero_title: settingMap["profil_hero_title"] || DEFAULT_SETTINGS.profil_hero_title,
    profil_hero_desc: settingMap["profil_hero_desc"] || DEFAULT_SETTINGS.profil_hero_desc,
    profil_visi: settingMap["profil_visi"] || DEFAULT_SETTINGS.profil_visi,
    profil_visi_desc: settingMap["profil_visi_desc"] || DEFAULT_SETTINGS.profil_visi_desc,
    profil_misi: settingMap["profil_misi"] || DEFAULT_SETTINGS.profil_misi,
  };
}

export async function updateProfilSettings(data: Partial<ProfilSettings>) {
  const role = await getSessionRole();
  if (role !== "SUPERADMIN" && role !== "ADMIN") throw new Error("Unauthorized");

  const updates = Object.entries(data).map(([key, value]) => {
    return prisma.siteSetting.upsert({
      where: { key },
      update: { value: value as string },
      create: { key, value: value as string },
    });
  });

  await prisma.$transaction(updates);
  
  revalidatePath("/", "layout");
  revalidatePath("/profil");
  revalidatePath("/admin/pengaturan");
  
  return { success: true };
}
