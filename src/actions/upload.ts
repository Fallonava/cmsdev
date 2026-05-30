"use server";

import { promises as fs } from "fs";
import path from "path";

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "Tidak ada file yang diupload." };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Bikin nama file unik agar tidak bentrok
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const originalName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, ""); // sanitize
    const filename = `${uniqueSuffix}-${originalName}`;
    
    // Tentukan path penyimpanan
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filepath = path.join(uploadDir, filename);

    // Tulis ke disk
    await fs.writeFile(filepath, buffer);

    // Kembalikan URL publik
    return { success: true, url: `/uploads/${filename}` };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { success: false, error: "Gagal mengupload file ke server." };
  }
}
