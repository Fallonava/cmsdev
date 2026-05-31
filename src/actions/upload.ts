"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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
    
    // Konfigurasi R2
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucketName = process.env.R2_BUCKET_NAME;
    const publicUrl = process.env.R2_PUBLIC_URL; // misal: https://pub-xxxxx.r2.dev

    // Fallback ke penyimpanan lokal jika kredensial R2 tidak lengkap (berguna untuk mode dev/lokal)
    if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
      console.warn("⚠️ Kredensial R2 tidak lengkap. Menggunakan penyimpanan lokal sementara.");
      const fs = await import("fs/promises");
      const path = await import("path");
      
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      
      // Pastikan direktori ada
      await fs.mkdir(uploadDir, { recursive: true });

      const filepath = path.join(uploadDir, filename);
      await fs.writeFile(filepath, buffer);
      return { success: true, url: `/uploads/${filename}` };
    }

    // Koneksi ke Cloudflare R2
    const S3 = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    await S3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: filename,
        Body: buffer,
        ContentType: file.type,
      })
    );

    // Kembalikan URL publik Cloudflare R2
    const finalUrl = publicUrl 
      ? `${publicUrl.replace(/\/$/, '')}/${filename}` 
      : `https://${bucketName}.${accountId}.r2.cloudflarestorage.com/${filename}`; // (Catatan: ini biasanya private kecuali dikonfigurasi lain)

    return { success: true, url: finalUrl };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { success: false, error: "Gagal mengupload file ke server." };
  }
}
