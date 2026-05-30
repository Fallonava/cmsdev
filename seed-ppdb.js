const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.applicant.createMany({
    data: [
      {
        fullName: "Ahmad Rizqi Maulana",
        nisn: "0102938475",
        birthPlace: "Purbalingga",
        birthDate: new Date("2010-05-12T00:00:00Z"),
        gender: "L",
        prevSchool: "SDN 1 Purbalingga",
        gradYear: "2024",
        parentName: "Budi Santoso",
        parentPhone: "081234567890",
        status: "PENDING",
        createdAt: new Date(Date.now() - 1000 * 60 * 5)
      },
      {
        fullName: "Siti Nurhaliza",
        nisn: "0102938476",
        birthPlace: "Banyumas",
        birthDate: new Date("2010-08-21T00:00:00Z"),
        gender: "P",
        prevSchool: "MI Muhammadiyah 1",
        gradYear: "2024",
        parentName: "Ahmad Dahlan",
        parentPhone: "082345678901",
        status: "APPROVED",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
      },
      {
        fullName: "Dimas Anggara",
        nisn: "0102938477",
        birthPlace: "Banjarnegara",
        birthDate: new Date("2011-01-15T00:00:00Z"),
        gender: "L",
        prevSchool: "SDN 2 Kalimanah",
        gradYear: "2024",
        parentName: "Agus Setiawan",
        parentPhone: "083456789012",
        status: "REJECTED",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
      },
      {
        fullName: "Fatimah Azzahra",
        nisn: "0102938478",
        birthPlace: "Purwokerto",
        birthDate: new Date("2010-11-30T00:00:00Z"),
        gender: "P",
        prevSchool: "SD IT Harapan Bangsa",
        gradYear: "2024",
        parentName: "Lukman Hakim",
        parentPhone: "085678901234",
        status: "PENDING",
        createdAt: new Date(Date.now() - 1000 * 60 * 30)
      },
      {
        fullName: "Muhammad Iqbal",
        nisn: "0102938479",
        birthPlace: "Purbalingga",
        birthDate: new Date("2011-03-05T00:00:00Z"),
        gender: "L",
        prevSchool: "SDN 3 Bobotsari",
        gradYear: "2024",
        parentName: "Suryono",
        parentPhone: "089012345678",
        status: "APPROVED",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48)
      }
    ]
  });
  console.log("Mock PPDB data injected successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
