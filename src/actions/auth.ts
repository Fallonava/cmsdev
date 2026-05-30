"use server";

import { signIn, signOut } from "@/auth";

export async function doLogin(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  
  try {
    await signIn("credentials", { 
      email, 
      password, 
      redirectTo: "/admin" 
    });
  } catch (error: any) {
    // NextAuth throws AuthError which we can check, or just check the type
    if (error?.type === "CredentialsSignin") {
      return { error: "Email atau password salah" };
    }
    // If it's a redirect error from successful sign in, Next.js expects us to throw it!
    throw error;
  }
}

export async function doLogout() {
  await signOut({ redirectTo: "/admin/login" });
}
