import { getTeachers } from "@/actions/teacher";
import { getExtracurriculars } from "@/actions/extracurricular";
import { getProfilSettings } from "@/actions/profilSettings";
import ProfilClientView from "./ProfilClientView";

export default async function ProfilPage() {
  const teachers = await getTeachers();
  const ekskuls = await getExtracurriculars();
  const settings = await getProfilSettings();
  
  return <ProfilClientView teachers={teachers} ekskuls={ekskuls} settings={settings} />;
}
