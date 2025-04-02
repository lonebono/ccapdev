//Import necessary modules/components
import LoginPage from "@/components/login_page";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // If a session exists, redirect to the dashboard
  if (session) redirect("/userpage");

  return (
    <main>
      <LoginPage />
    </main>
  );
}
