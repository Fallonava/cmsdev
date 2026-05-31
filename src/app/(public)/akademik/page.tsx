import { getAkademikSettings } from "@/actions/akademikSettings";
import { getExtracurriculars } from "@/actions/extracurricular";
import AkademikClientView from "./AkademikClientView";

export const metadata = {
  title: "Akademik | MTs Muhammadiyah 07 Purbalingga",
  description: "Sistem Akademik Terpadu, Program Tahfidz Unggulan, dan Kurikulum KBM Berbasis Digital.",
};

export default async function AkademikPage() {
  const settings = await getAkademikSettings();
  const ekskuls = await getExtracurriculars();

  return <AkademikClientView settings={settings} ekskuls={ekskuls} />;
}
