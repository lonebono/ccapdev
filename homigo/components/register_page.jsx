"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Name: ", name);
    console.log("Email: ", email);
    console.log("Password: ", password);

    if (!name || !email || !password) {
      setError("Please fill all the fields");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const form = e.target;
        form.reset();
        setName("");
        setEmail("");
        setPassword("");
        setError("");
        router.push("/");
      } else {
        // Registration failed
        const data = await res.json();
        setError(data.message);
        if (data.errors?.email) {
          setError("Invalid email format. Please enter a valid email address.");
        } else {
          console.log("Registration failed:", data.message);
        }
      }
    } catch (error) {
      console.log("An error occurred whilst registering: ", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 via-gray-700 to-gray-800">
      <div className="shadow-lg p-5 rounded-lg border-t-4 border-indigo-400 bg-white">
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

        <h1 className="text-xl font-bold text-center my-4">Register</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Full Name"
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
          <button className="bg-indigo-600 text-white font-bold cursor-pointer px-6 py-2">
            Register
          </button>
          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}
          <Link className="text-sm mt-3 text-right" href={"/"}>
            Already have an account? <span className="underline">Login</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
