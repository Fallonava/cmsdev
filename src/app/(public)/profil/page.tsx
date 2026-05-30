import { getTeachers } from "@/actions/teacher";
import { getExtracurriculars } from "@/actions/extracurricular";
import ProfilClientView from "./ProfilClientView";

export default async function ProfilPage() {
  const teachers = await getTeachers();
  const ekskuls = await getExtracurriculars();
  
  return <ProfilClientView teachers={teachers} ekskuls={ekskuls} />;
}
