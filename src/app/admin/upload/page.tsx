import { notFound } from "next/navigation";
import AdminUploadClient from "./AdminUploadClient";

export const dynamic = "force-dynamic";

export default function AdminUploadPage() {
  if (process.env.VERCEL_ENV === "production") {
    notFound();
  }
  return <AdminUploadClient />;
}
