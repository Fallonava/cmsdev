"use server";

import { auth } from "@/auth";

export async function getSessionRole() {
  const session = await auth();
  return session?.user?.role || null;
}
