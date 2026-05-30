const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const PROGRAMS = [
  { icon: "BookMarked", color: "from-blue-500 to-indigo-600", title: "Tahfidz Al-Qur'an", description: "Target hafalan mutqin dengan metode tasmi' dan muraja'ah terstruktur.", order: 1 },
  { icon: "Cpu", color: "from-emerald-500 to-teal-600", title: "Kelas Digital", description: "Pembelajaran interaktif menggunakan iPad dan smartboard di setiap kelas.", order: 2 },
  { icon: "Users", color: "from-amber-500 to-orange-600", title: "Bilingual Program", description: "Pengantar Bahasa Inggris dan Arab untuk mata pelajaran sains dan agama.", order: 3 },
];

const ACHIEVEMENTS = [
  { icon: "Trophy", color: "from-yellow-400 to-amber-600", label: "Juara 1 Olimpiade Matematika", scope: "Tingkat Provinsi", year: "2025", order: 1 },
  { icon: "Medal", color: "from-slate-400 to-gray-600", label: "Medali Perak Robotik", scope: "Tingkat Nasional", year: "2024", order: 2 },
  { icon: "Award", color: "from-amber-700 to-yellow-800", label: "Sekolah Adiwiyata Mandiri", scope: "Kementerian LHK", year: "2025", order: 3 },
];

const EVENTS = [
  { date: "15", day: "Senin", title: "Masa Ta'aruf Siswa Madrasah (Matsama)", type: "Akademik", typeColor: "blue", order: 1 },
  { date: "22", day: "Sabtu", title: "Perkemahan Bakti Santri", type: "Ekstrakurikuler", typeColor: "green", order: 2 },
  { date: "10", day: "Kamis", title: "Festival Seni Islami", type: "Kompetisi", typeColor: "orange", order: 3 },
];

const FAQS = [
  { question: "Kapan pendaftaran siswa baru ditutup?", answer: "Pendaftaran Gelombang 1 ditutup pada akhir Februari. Gelombang 2 akan dibuka jika kuota masih tersedia (maksimal 150 siswa).", order: 1 },
  { question: "Apakah ada fasilitas asrama (boarding)?", answer: "Saat ini kami belum menyediakan asrama. Kami berfokus pada program full day school dari jam 07.00 hingga 15.30.", order: 2 },
  { question: "Berapa biaya SPP bulanan?", answer: "Biaya SPP bervariasi. Untuk informasi rincian biaya pendidikan terbaru, silakan unduh brosur di halaman PPDB.", order: 3 },
  { question: "Apakah menerima siswa mutasi?", answer: "Ya, kami menerima siswa mutasi pindahan jika kuota kelas masih tersedia dan lulus tes penempatan.", order: 4 },
];

const TESTIMONIALS = [
  { author: "Ibu Sarah", role: "Wali Murid Kelas 8", quote: "Alhamdulillah, sejak bersekolah di sini, anak saya tidak hanya berprestasi di akademik tapi juga akhlaknya semakin santun. Program tahfidznya sangat membanggakan.", order: 1 },
  { author: "Bapak Ahmad", role: "Alumni Angkatan 2020", quote: "Fasilitas digitalnya luar biasa. Membekali saya kemampuan teknologi yang sangat berguna saat melanjutkan ke SMA unggulan.", order: 2 },
  { author: "Ibu Linda", role: "Wali Murid Kelas 7", quote: "Guru-gurunya sangat perhatian dan mudah dihubungi. Komunikasi antara sekolah dan orang tua berjalan sangat transparan dan interaktif.", order: 3 },
];

const GALLERY = [
  { src: "https://images.unsplash.com/photo-1577896851231-70ef18881754", alt: "Students learning", tall: false, order: 1 },
  { src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b", alt: "School building", tall: true, order: 2 },
  { src: "https://images.unsplash.com/photo-1427504494785-319ce224a18e", alt: "Classroom", tall: false, order: 3 },
  { src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1", alt: "Graduation", tall: true, order: 4 },
  { src: "https://images.unsplash.com/photo-1510531704581-5b28709e5a9f", alt: "Digital class", tall: false, order: 5 },
  { src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f", alt: "Group study", tall: false, order: 6 },
];

const PARTNERS = [
  { name: "Kementerian Agama", abbr: "Kemenag", color: "green", order: 1 },
  { name: "Kementerian Pendidikan", abbr: "Kemdikbud", color: "blue", order: 2 },
  { name: "Muhammadiyah", abbr: "MDMC", color: "yellow", order: 3 },
];

async function main() {
  console.log("Seeding data statis...");

  // Hanya isi jika tabel kosong
  const pCount = await prisma.program.count();
  if (pCount === 0) await prisma.program.createMany({ data: PROGRAMS });

  const aCount = await prisma.achievement.count();
  if (aCount === 0) await prisma.achievement.createMany({ data: ACHIEVEMENTS });

  const eCount = await prisma.event.count();
  if (eCount === 0) await prisma.event.createMany({ data: EVENTS });

  const fCount = await prisma.faq.count();
  if (fCount === 0) await prisma.faq.createMany({ data: FAQS });

  const tCount = await prisma.testimonial.count();
  if (tCount === 0) await prisma.testimonial.createMany({ data: TESTIMONIALS });
  
  const gCount = await prisma.galleryPhoto.count();
  if (gCount === 0) await prisma.galleryPhoto.createMany({ data: GALLERY });

  const ptCount = await prisma.partner.count();
  if (ptCount === 0) await prisma.partner.createMany({ data: PARTNERS });

  console.log("Data seeding selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
