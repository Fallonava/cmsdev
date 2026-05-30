"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";



// ==========================================
// COMBINED FETCH FOR PUBLIC PAGE
// ==========================================
export async function getLandingData() {
  const [
    programs,
    achievements,
    testimonials,
    events,
    faqs,
    partners,
    galleryPhotos
  ] = await Promise.all([
    prisma.program.findMany({ orderBy: { order: 'asc' } }),
    prisma.achievement.findMany({ orderBy: { order: 'asc' } }),
    prisma.testimonial.findMany({ orderBy: { order: 'asc' } }),
    prisma.event.findMany({ orderBy: { order: 'asc' } }),
    prisma.faq.findMany({ orderBy: { order: 'asc' } }),
    prisma.partner.findMany({ orderBy: { order: 'asc' } }),
    prisma.galleryPhoto.findMany({ orderBy: { order: 'asc' } })
  ]);

  return { programs, achievements, testimonials, events, faqs, partners, galleryPhotos };
}

// ==========================================
// PROGRAMS
// ==========================================
export async function getPrograms() {
  return await prisma.program.findMany({ orderBy: { order: 'asc' } });
}

export async function createProgram(data: { title: string; description: string; icon: string; color: string; order?: number }) {
  const result = await prisma.program.create({ data });
  revalidatePath("/");
  return result;
}

export async function updateProgram(id: string, data: { title: string; description: string; icon: string; color: string; order?: number }) {
  const result = await prisma.program.update({ where: { id }, data });
  revalidatePath("/");
  return result;
}

export async function deleteProgram(id: string) {
  const result = await prisma.program.delete({ where: { id } });
  revalidatePath("/");
  return result;
}

// ==========================================
// ACHIEVEMENTS
// ==========================================
export async function getAchievements() {
  return await prisma.achievement.findMany({ orderBy: { order: 'asc' } });
}

export async function createAchievement(data: { label: string; scope: string; year: string; icon: string; color: string; order?: number }) {
  const result = await prisma.achievement.create({ data });
  revalidatePath("/");
  return result;
}

export async function updateAchievement(id: string, data: { label: string; scope: string; year: string; icon: string; color: string; order?: number }) {
  const result = await prisma.achievement.update({ where: { id }, data });
  revalidatePath("/");
  return result;
}

export async function deleteAchievement(id: string) {
  const result = await prisma.achievement.delete({ where: { id } });
  revalidatePath("/");
  return result;
}

// ==========================================
// TESTIMONIALS
// ==========================================
export async function getTestimonials() {
  return await prisma.testimonial.findMany({ orderBy: { order: 'asc' } });
}

export async function createTestimonial(data: { quote: string; author: string; role: string; avatarUrl?: string; order?: number }) {
  const result = await prisma.testimonial.create({ data });
  revalidatePath("/");
  return result;
}

export async function updateTestimonial(id: string, data: { quote: string; author: string; role: string; avatarUrl?: string; order?: number }) {
  const result = await prisma.testimonial.update({ where: { id }, data });
  revalidatePath("/");
  return result;
}

export async function deleteTestimonial(id: string) {
  const result = await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/");
  return result;
}

// ==========================================
// EVENTS (Kalender Kegiatan)
// ==========================================
export async function getEvents() {
  return await prisma.event.findMany({ orderBy: { order: 'asc' } });
}

export async function createEvent(data: { title: string; date: string; day: string; type: string; typeColor: string; order?: number }) {
  const result = await prisma.event.create({ data });
  revalidatePath("/");
  return result;
}

export async function updateEvent(id: string, data: { title: string; date: string; day: string; type: string; typeColor: string; order?: number }) {
  const result = await prisma.event.update({ where: { id }, data });
  revalidatePath("/");
  return result;
}

export async function deleteEvent(id: string) {
  const result = await prisma.event.delete({ where: { id } });
  revalidatePath("/");
  return result;
}

// ==========================================
// FAQS
// ==========================================
export async function getFaqs() {
  return await prisma.faq.findMany({ orderBy: { order: 'asc' } });
}

export async function createFaq(data: { question: string; answer: string; order?: number }) {
  const result = await prisma.faq.create({ data });
  revalidatePath("/");
  return result;
}

export async function updateFaq(id: string, data: { question: string; answer: string; order?: number }) {
  const result = await prisma.faq.update({ where: { id }, data });
  revalidatePath("/");
  return result;
}

export async function deleteFaq(id: string) {
  const result = await prisma.faq.delete({ where: { id } });
  revalidatePath("/");
  return result;
}

// ==========================================
// PARTNERS
// ==========================================
export async function getPartners() {
  return await prisma.partner.findMany({ orderBy: { order: 'asc' } });
}

export async function createPartner(data: { name: string; abbr: string; color: string; order?: number }) {
  const result = await prisma.partner.create({ data });
  revalidatePath("/");
  return result;
}

export async function updatePartner(id: string, data: { name: string; abbr: string; color: string; order?: number }) {
  const result = await prisma.partner.update({ where: { id }, data });
  revalidatePath("/");
  return result;
}

export async function deletePartner(id: string) {
  const result = await prisma.partner.delete({ where: { id } });
  revalidatePath("/");
  return result;
}

// ==========================================
// GALLERY PHOTOS
// ==========================================
export async function getGalleryPhotos() {
  return await prisma.galleryPhoto.findMany({ orderBy: { order: 'asc' } });
}

export async function createGalleryPhoto(data: { src: string; alt: string; tall: boolean; order?: number }) {
  const result = await prisma.galleryPhoto.create({ data });
  revalidatePath("/");
  return result;
}

export async function updateGalleryPhoto(id: string, data: { src: string; alt: string; tall: boolean; order?: number }) {
  const result = await prisma.galleryPhoto.update({ where: { id }, data });
  revalidatePath("/");
  return result;
}

export async function deleteGalleryPhoto(id: string) {
  const result = await prisma.galleryPhoto.delete({ where: { id } });
  revalidatePath("/");
  return result;
}
