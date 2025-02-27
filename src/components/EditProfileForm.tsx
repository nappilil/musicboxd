"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { EditProfile, type EditProfileType } from "@/lib/validators/user";

type EditProfileFormProps = {
  username: string;
  bio: string;
};

export default function EditProfileForm(props: EditProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfileType>({ resolver: zodResolver(EditProfile) });
  const router = useRouter();

  const editProfile = async (body: EditProfileType) => {
    try {
      const response = await fetch("/api/user/edit", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        toast.error(data.error);
      }

      router.refresh();
      toast.success("Successfully edited profile.");
    } catch (error) {
      console.log(error);
      toast.error("Internal server error.");
    }
  };

  return (
    <form className="flex flex-col gap-y-4" onSubmit={handleSubmit(editProfile)}>
      <div className="flex flex-col gap-y-2">
        <label htmlFor="username">
          <strong>Username:</strong>
        </label>
        <input
          className="grow border border-solid rounded border-black p-2 text-black bg-textbox-gray"
          type="text"
          defaultValue={props.username}
          {...register("username")}
        />
        {errors.username && <span className="text-red-600">{errors.username.message}</span>}
      </div>
      <div className="flex flex-col gap-y-2">
        <label htmlFor="username">
          <strong>Bio:</strong>
        </label>
        <textarea className="grow border border-solid rounded border-black p-2 text-black bg-textbox-gray" defaultValue={props.bio} {...register("bio")} />
        {errors.bio && <span className="text-red-600">{errors.bio.message}</span>}
      </div>
      {errors.root && <span className="text-red-600">{errors.root?.message}</span>}
      <button className="w-fit rounded-3xl self-center border border-solid hover:bg-spotify-white border-black p-2 bg-spotify-green text-spotify-black font-bold" type="submit">
        Save
      </button>
    </form>
  );
}
