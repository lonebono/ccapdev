//Enables Client Side Components
"use client";
//Import relavent modules/components
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  //A React Hook (built in react functions) to add state to functional components
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  //Access the router object for navigation and routing among pages
  const router = useRouter();

  //Handles Submission, takes in an event object
  const handleSubmit = async (e) => {
    //Prevents page reload
    e.preventDefault();

    try {
      //Calls signin with the provided credentials
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError("INVALID CREDENTIALS");
        return;
      }

      router.replace("/userpage");
    } catch (error) {
      console.log("An error occurred whilst logging in: ", error);
    }
  };
  //Lots of tailwind css: min-h-screen sets min heigh to 100% of the viewport screen, flex the belowed flex layout, items-center centers the items vertically.
  //justify-center centers the child elements horizontally within the flex container, bg-gradient-to-r back ground gradient with its respective colors
  //shadow-lg: This class applies a large shadow effect to the div, p adds padding, rounded-lg: This class rounds the corners of the div
  //border-t-4: This class adds a border to the top of the div, and the rest are colors
  //relative: This class sets the position of the div to relative (basiacally it adjusts) mb: bottom margin
  //Image: added our logo,  alt is the alternative text for the image, className="rounded-full": This applies the rounded styling to the image
  //The rest are a bunch of flex/font/gaps/padding/colors and etc. styling
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 via-gray-700 to-gray-800">
      <div className="shadow-lg p-5 rounded-lg border-t-4 border-blue-400 bg-white">
        <div className="relative flex flex-col items-center mb-12">
          <div className="relative mb-2">
            <Image
              src="/Images/TempLogo.png"
              alt="Logo"
              width={120}
              height={120}
              className="rounded-full"
            />
          </div>
          <h1 className="text-3xl font-bold text-black-600">HOMIGO</h1>
        </div>

        <h1 className="text-xl font-bold text-center my-4">Login</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email"
            className="p-2 border border-gray-300 rounded"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="p-2 border border-gray-300 rounded"
          />
          <button className="bg-blue-400 text-white font-bold cursor-pointer px-6 py-2 rounded hover:bg-blue-500 transition-colors">
            Login
          </button>
          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}

          <Link className="text-sm mt-3 text-right" href={"/register"}>
            Don't have an account? <span className="underline">Register</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
