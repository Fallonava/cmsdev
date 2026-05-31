"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSessionRole } from "./role";

export type AkademikSettings = {
  akademik_hero_title: string;
  akademik_hero_desc: string;
  akademik_tahfidz_title: string;
  akademik_tahfidz_desc: string;
  akademik_kbm_desc: string;
  akademik_ismuba_desc: string;
};

const DEFAULT_SETTINGS: AkademikSettings = {
  akademik_hero_title: "Ekselensi Kurikulum. \nSains Terapan & Ilmu Agama.",
  akademik_hero_desc: "Menyelaraskan standar pendidikan nasional dengan nilai-nilai luhur Kemuhammadiyahan untuk mencetak pemimpin masa depan.",
  akademik_tahfidz_title: "Program \nTahfidz Unggulan",
  akademik_tahfidz_desc: "Metode hafalan intensif namun menyenangkan. Didampingi oleh Hafidz/Hafidzah bersertifikat untuk memastikan tartil dan tajwid yang sempurna.",
  akademik_kbm_desc: "Semua ruang kelas dilengkapi dengan proyektor interaktif dan fasilitas WiFi untuk mendukung riset siswa langsung dari meja belajar.",
  akademik_ismuba_desc: "Pendidikan Al-Islam, Kemuhammadiyahan, dan Bahasa Arab.",
};

export async function getAkademikSettings(): Promise<AkademikSettings> {
  const keys = Object.keys(DEFAULT_SETTINGS);
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: keys } },
  });

  const settingMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return {
    akademik_hero_title: settingMap["akademik_hero_title"] || DEFAULT_SETTINGS.akademik_hero_title,
    akademik_hero_desc: settingMap["akademik_hero_desc"] || DEFAULT_SETTINGS.akademik_hero_desc,
    akademik_tahfidz_title: settingMap["akademik_tahfidz_title"] || DEFAULT_SETTINGS.akademik_tahfidz_title,
    akademik_tahfidz_desc: settingMap["akademik_tahfidz_desc"] || DEFAULT_SETTINGS.akademik_tahfidz_desc,
    akademik_kbm_desc: settingMap["akademik_kbm_desc"] || DEFAULT_SETTINGS.akademik_kbm_desc,
    akademik_ismuba_desc: settingMap["akademik_ismuba_desc"] || DEFAULT_SETTINGS.akademik_ismuba_desc,
  };
}

export async function updateAkademikSettings(data: Partial<AkademikSettings>) {
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
  revalidatePath("/akademik");
  revalidatePath("/admin/pengaturan");
  
  return { success: true };
}
