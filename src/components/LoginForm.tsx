"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { Login, type LoginType } from "@/lib/validators/user";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginType>({ resolver: zodResolver(Login) });
  const router = useRouter();

  const login = async (body: LoginType) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        toast.error(data.error);
      } else {
        router.push(`/profile/${data.id}`);
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      toast.error("Internal server error.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-y-4">
      <h1 className="text-4xl">
        <strong>Log In</strong>
      </h1>
      <form className="flex min-w-80 flex-col gap-y-4 text-spotify-white" onSubmit={handleSubmit(login)}>
        <div className="flex flex-col">
          <label className="text-xl" htmlFor="email">
            Email
          </label>
          <input className="rounded border border-solid border-black p-2 bg-textbox-gray text-spotify-black" type="email" {...register("email")} />
          {errors.email && <span className="text-red-600">{errors.email.message}</span>}
        </div>
        <div className="flex flex-col">
          <label className="text-xl" htmlFor="password">
            Password
          </label>
          <input className="rounded border border-solid border-black p-2 bg-textbox-gray text-spotify-black" type="password" {...register("password")} />
          {errors.password && <span className="text-red-600">{errors.password.message}</span>}
        </div>
        {errors.root && <span className="text-red-600">{errors.root?.message}</span>}
        <button className="w-full rounded-3xl border border-solid border-black p-2 bg-spotify-green text-spotify-black font-extrabold" type="submit">
          Log In
        </button>
      </form>
    </div>
  );
}
