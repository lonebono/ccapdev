// Import Necessary Modules/Components
import RegisterPage from "@/components/register_page";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

//export makes it so that the function/etc can be imported into other files
//default makes the specified function the default export of the file
//async is used to make an asynchronous function, allows the use of await to hanfle queries and api calls
export default async function Register() {
  const session = await getServerSession(authOptions);
  // If a session exists, redirect to the dashboard
  if (session) redirect("/userpage");

  return <RegisterPage />;
}