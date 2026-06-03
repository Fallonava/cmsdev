import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log("Memulai proses injeksi data (Seeding)...");

  // 1. Akun Admin Default
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const adminExists = await prisma.user.findUnique({ where: { email: "admin@sekolah.id" } });
  if (!adminExists) {
    await prisma.user.create({
      data: {
        name: "Superadmin",
        email: "admin@sekolah.id",
        password: hashedPassword,
        role: "ADMIN"
      }
    });
    console.log("✅ Admin dibuat (admin@sekolah.id / admin123)");
  }

  // 2. Pengaturan Profil & Akademik (SiteSetting)
  const settings = [
    { key: "profil_hero_title", value: "Membangun Generasi Cerdas & Berakhlak Mulia" },
    { key: "profil_hero_subtitle", value: "MTs & MA unggulan dengan kurikulum integrasi Islam dan Sains modern." },
    { key: "profil_visi", value: "Menjadi lembaga pendidikan Islam terdepan yang mencetak generasi qur'ani, cerdas, terampil, dan berwawasan global." },
    { key: "profil_misi", value: "1. Menyelenggarakan pendidikan berbasis Al-Quran dan As-Sunnah.\n2. Mengembangkan kurikulum sains dan teknologi terpadu.\n3. Membina karakter islami dan jiwa kepemimpinan siswa.\n4. Mendorong kreativitas dan kemandirian." },
    { key: "akademik_hero_title", value: "Sistem Akademik Terpadu" },
    { key: "akademik_hero_subtitle", value: "Kurikulum kami memadukan standar nasional dengan pendidikan karakter Islami yang kuat." },
    { key: "akademik_tahfidz_title", value: "Program Unggulan Tahfidz Qur'an" },
    { key: "akademik_tahfidz_desc", value: "Lulusan ditargetkan menghafal minimal 5 Juz dengan tajwid bersanad dan pemahaman makna yang mendalam." },
    { key: "akademik_digital_title", value: "KBM Berbasis Digital" },
    { key: "akademik_digital_desc", value: "Ruang kelas dilengkapi Smart TV, WiFi, dan penggunaan tablet untuk mengakses E-Library interaktif." },
    { key: "akademik_ismuba_title", value: "Pendidikan ISMUBA" },
    { key: "akademik_ismuba_desc", value: "Pendidikan Al-Islam, Kemuhammadiyahan, dan Bahasa Arab sebagai fondasi karakter siswa." }
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value }
    });
  }
  console.log("✅ Pengaturan SiteSetting ditambahkan");

  // 3. Ekstrakurikuler
  await prisma.extracurricular.deleteMany();
  await prisma.extracurricular.createMany({
    data: [
      { name: "Pramuka", description: "Membentuk kemandirian dan jiwa kepemimpinan melalui kepanduan.", photoUrl: "/assets/seed/pramuka.png", coach: "Kak Budi", schedule: "Jumat, 15:30" },
      { name: "Paskibra", description: "Melatih kedisiplinan dan rasa nasionalisme.", photoUrl: "/assets/seed/school.png", coach: "Kak Arya", schedule: "Selasa, 15:30" },
      { name: "Rohis & Tahfidz", description: "Pendalaman kajian Islam dan perbaikan bacaan Al-Quran.", photoUrl: "/assets/seed/pramuka.png", coach: "Ust. Fatih", schedule: "Senin - Kamis" },
    ]
  });
  console.log("✅ Ekstrakurikuler ditambahkan");

  // 4. Guru
  await prisma.teacher.deleteMany();
  await prisma.teacher.createMany({
    data: [
      { name: "Ahmad Fauzi, S.Pd., M.Pd.", position: "Kepala Sekolah", subjects: "Pendidikan Agama Islam", photoUrl: "/assets/seed/teacher.png", order: 1 },
      { name: "Rina Wahyuni, M.Sc.", position: "Wakabid Kurikulum", subjects: "Matematika & Fisika", photoUrl: "/assets/seed/teacher.png", order: 2 },
      { name: "Budi Santoso, S.Kom.", position: "Guru TIK", subjects: "Informatika", photoUrl: "/assets/seed/teacher.png", order: 3 }
    ]
  });
  console.log("✅ Guru ditambahkan");

  // 5. Berita (Post)
  await prisma.post.deleteMany();
  await prisma.post.createMany({
    data: [
      { title: "Penerimaan Siswa Baru Tahun Ajaran 2026/2027 Resmi Dibuka", slug: "ppdb-2026-dibuka", content: "Pendaftaran dapat dilakukan secara online melalui website ini. Kuota terbatas hanya untuk 150 siswa.", published: true, imageUrl: "/assets/seed/school.png" },
      { title: "Prestasi Gemilang: Tim Robotik Juara Nasional", slug: "tim-robotik-juara", content: "Siswa-siswi kami berhasil meraih juara 1 dalam kompetisi robotik tingkat nasional yang diselenggarakan di Jakarta.", published: true, imageUrl: "/assets/seed/pramuka.png" },
      { title: "Kunjungan Studi Kampus ke Universitas Terkemuka", slug: "kunjungan-studi-kampus", content: "Program tahunan untuk memberikan gambaran dunia perkuliahan kepada siswa kelas XII.", published: true, imageUrl: "/assets/seed/school.png" }
    ]
  });
  console.log("✅ Berita ditambahkan");

  // 6. Testimoni
  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({
    data: [
      { quote: "Sekolah ini tidak hanya mengajarkan ilmu akademik, tapi juga membentuk akhlak anak saya menjadi lebih baik.", author: "Ibu Fatimah", role: "Orang Tua Siswa", order: 1 },
      { quote: "Fasilitas lengkap dan guru yang sangat suportif membantu saya meraih beasiswa kuliah di luar negeri.", author: "Rizky Pratama", role: "Alumni Angkatan 2024", order: 2 }
    ]
  });
  console.log("✅ Testimoni ditambahkan");

  // 7. Prestasi
  await prisma.achievement.deleteMany();
  await prisma.achievement.createMany({
    data: [
      { label: "Juara 1 Olimpiade Sains Nasional", scope: "Tingkat Nasional", year: "2025", icon: "Trophy", color: "from-amber-400 to-orange-500", order: 1 },
      { label: "Medali Emas Lomba Kaligrafi", scope: "Tingkat Provinsi", year: "2024", icon: "Award", color: "from-blue-400 to-cyan-500", order: 2 },
      { label: "Sekolah Adiwiyata Mandiri", scope: "Kementerian LHK", year: "2023", icon: "Leaf", color: "from-green-400 to-emerald-500", order: 3 }
    ]
  });
  console.log("✅ Prestasi ditambahkan");

  // 8. FAQ
  await prisma.faq.deleteMany();
  await prisma.faq.createMany({
    data: [
      { question: "Bagaimana cara mendaftar secara online?", answer: "Anda dapat mengakses menu PPDB di navigasi atas, lalu mengisi formulir yang tersedia. Setelah itu, tim kami akan menghubungi Anda melalui WhatsApp.", order: 1 },
      { question: "Apakah disediakan beasiswa?", answer: "Ya, kami menyediakan beasiswa prestasi dan beasiswa tahfidz untuk siswa yang memenuhi kriteria.", order: 2 },
      { question: "Berapa biaya pendaftaran awal?", answer: "Biaya formulir adalah Rp 250.000. Untuk rincian biaya pembangunan dan SPP akan diinformasikan saat tes wawancara.", order: 3 }
    ]
  });
  console.log("✅ FAQ ditambahkan");

  console.log("🎉 Seeding Selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
