"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";



export async function getLandingSettings() {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "landing_page" }
    });

    if (setting && setting.value) {
      return JSON.parse(setting.value);
    }
    
    // Return default values if not set
    return {
      hero: {
        heroStyle: "bento",
        badge: "Tahun Ajaran 2026/2027",
        title: "Pendidikan Islami, Standar Global.",
        subtitle: "MTs Muhammadiyah 07 Purbalingga merancang ekosistem pembelajaran modern yang memadukan keunggulan teknologi digital dengan penanaman akhlak mulia.",
        cta1_text: "Mulai Pendaftaran",
        cta2_text: "Profil Sekolah"
      },
      stats: {
        title: "Lebih dari sekadar sekolah.",
        subtitle: "Kami merancang ekosistem pembelajaran yang menginspirasi setiap siswa untuk mencapai potensi terbaik mereka.",
        stat1_value: "500+",
        stat1_label: "Siswa Aktif",
        stat2_value: "45+",
        stat2_label: "Guru Profesional",
        stat3_value: "A",
        stat3_label: "Terakreditasi",
        ppdb_title: "Daftar PPDB\n2026/2027",
        ppdb_desc: "Kuota terbatas. Segera daftarkan putra-putri Anda.",
        prestasi_title: "Prestasi Nasional",
        prestasi_desc: "Ratusan penghargaan tingkat kabupaten hingga nasional."
      },
      features: {
        image_title: "Fasilitas Modern",
        image_desc: "Lingkungan asri yang mendukung proses KBM berbasis teknologi digital.",
        extra_title: "Program Tahfidz Unggulan",
        extra_desc: "Mencetak generasi penghafal Al-Qur'an dengan metode pembelajaran modern yang menyenangkan."
      },
      headmaster: {
        name: "Bapak Fulan, S.Pd., M.Pd.",
        role: "Kepala Sekolah",
        message: "\"Kami terus berinovasi mengintegrasikan nilai-nilai Islam dengan ilmu pengetahuan modern. Membekali siswa bukan hanya dengan kecerdasan intelektual, tapi juga spiritual dan emosional yang kokoh.\""
      }
    };
  } catch (error) {
    console.error("Error getting landing settings:", error);
    return null;
  }
}

export async function updateLandingSettings(formData: FormData) {
  try {
    const data = {
      hero: {
        heroStyle: (formData.get("heroStyle") as string) || "bento",
        badge: formData.get("heroBadge") as string,
        title: formData.get("heroTitle") as string,
        subtitle: formData.get("heroSubtitle") as string,
        cta1_text: formData.get("heroCta1") as string,
        cta2_text: formData.get("heroCta2") as string,
      },
      stats: {
        title: formData.get("statsTitle") as string,
        subtitle: formData.get("statsSubtitle") as string,
        stat1_value: formData.get("stat1Value") as string,
        stat1_label: formData.get("stat1Label") as string,
        stat2_value: formData.get("stat2Value") as string,
        stat2_label: formData.get("stat2Label") as string,
        stat3_value: formData.get("stat3Value") as string,
        stat3_label: formData.get("stat3Label") as string,
        ppdb_title: formData.get("ppdbTitle") as string,
        ppdb_desc: formData.get("ppdbDesc") as string,
        prestasi_title: formData.get("prestasiTitle") as string,
        prestasi_desc: formData.get("prestasiDesc") as string,
      },
      features: {
        image_title: formData.get("featImgTitle") as string,
        image_desc: formData.get("featImgDesc") as string,
        extra_title: formData.get("featExtTitle") as string,
        extra_desc: formData.get("featExtDesc") as string,
      },
      headmaster: {
        name: formData.get("headmasterName") as string,
        role: formData.get("headmasterRole") as string,
        message: formData.get("headmasterMessage") as string,
      }
    };

    await prisma.siteSetting.upsert({
      where: { key: "landing_page" },
      update: { value: JSON.stringify(data) },
      create: { key: "landing_page", value: JSON.stringify(data) }
    });

    revalidatePath("/");
    revalidatePath("/admin/pengaturan");
    
    return { success: true };
  } catch (error) {
    console.error("Error saving landing settings:", error);
    return { success: false, error: "Gagal menyimpan pengaturan." };
  }
}

// ==========================================
// IDENTITAS GLOBAL
// ==========================================
export async function getIdentitySettings() {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: "site_identity" } });
    if (setting && setting.value) return JSON.parse(setting.value);
    
    return {
      schoolName: "MTs Muhammadiyah 07 Purbalingga",
      shortName: "MTs MUTU",
      logoUrl: "",
      email: "info@mtsmutupbg.sch.id",
      phone: "+62 812 3456 7890",
      address: "Jl. Raya Kejobon, Purbalingga, Jawa Tengah",
      waNumber: "6281234567890",
      waMessage: "Halo Admin MTs Muhammadiyah 07, saya ingin bertanya.",
      waActive: false
    };
  } catch (error) {
    return null;
  }
}

export async function updateIdentitySettings(formData: FormData) {
  try {
    const data = {
      schoolName: formData.get("schoolName") as string,
      shortName: formData.get("shortName") as string,
      logoUrl: formData.get("logoUrl") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      waNumber: formData.get("waNumber") as string || "6281234567890",
      waMessage: formData.get("waMessage") as string || "Halo Admin, saya ingin bertanya.",
      waActive: formData.get("waActive") === "true",
    };

    await prisma.siteSetting.upsert({
      where: { key: "site_identity" },
      update: { value: JSON.stringify(data) },
      create: { key: "site_identity", value: JSON.stringify(data) }
    });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal menyimpan identitas." };
  }
}

// ==========================================
// MEDIA BERANDA
// ==========================================
export async function getMediaSettings() {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: "site_media" } });
    if (setting && setting.value) return JSON.parse(setting.value);
    
    return {
      heroUrl: "/images/hero_cinematic.png",
      facilityUrl: "/images/school_building.png",
      principalUrl: "/images/principal_portrait.png",
    };
  } catch (error) {
    return null;
  }
}

export async function updateMediaSettings(formData: FormData) {
  try {
    const data = {
      heroUrl: formData.get("heroUrl") as string,
      facilityUrl: formData.get("facilityUrl") as string,
      principalUrl: formData.get("principalUrl") as string,
    };

    await prisma.siteSetting.upsert({
      where: { key: "site_media" },
      update: { value: JSON.stringify(data) },
      create: { key: "site_media", value: JSON.stringify(data) }
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal menyimpan media." };
  }
}
