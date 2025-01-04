"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Input from "./ui/Input";
import Button from "./ui/Button";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (error) {
      setSuccess("");
    }

    if (success) {
      setError("");
    }
  }, [success, error]);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("Fill all details");
      return;
    }
    console.log(name, email, password);

    const response = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // console.log(response);
    const data = await response.json();
    console.log(data);
    if (!response.ok) {
      setError(data?.message);
      return;
    }

    if (response.ok) {
      setSuccess(data?.message);
      router.push("/login");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-3 w-full h-[80vh]">
      <form className="flex flex-col w-[30%] gap-3" onSubmit={handleSubmit}>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="name"
        />

        <Input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
        />

        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />

        <Button className="justify-self-end">Register</Button>
      </form>
      {success && (
        <p className="text-green-700 decoration-dashed">✅{success}</p>
      )}
      {error && <p className="text-red-700 decoration-wavy">⚠{error}</p>}
      <p>
        Already have an account?{" "}
        <u>
          <Link href="/login">Login</Link>
        </u>
      </p>
    </div>
  );
};

export default Register;
