"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { type IComment } from "@/lib/models/comment";
import { type IPost } from "@/lib/models/post";

import { toast } from "react-toastify";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { CreateComment, CreateCommentType } from "@/lib/validators/comment";


type PostProps = {
  post: IPost;
  user: string;
  comments: IComment[];
  commentUsernames: string[];
};

export default function SinglePost(props: PostProps) {
  const [post, setPost] = useState<IPost>(props.post);
  const [username] = useState<string>(props.user);
  const [comments, setComments] = useState<IComment[]>(props.comments);
  const [commentUsernames, setCommentUsernames] = useState<string[]>(props.commentUsernames);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CreateCommentType>({ resolver: zodResolver(CreateComment) });
  const router = useRouter();

  useEffect(() => {
    let removed: string[] = [];
    post.likes.forEach((id) => {
      if (!removed.includes(id)) {
        removed.push(id);
      }
    });
    post.likes = removed;
    removed = [];
    post.dislikes.forEach((id) => {
      if (!removed.includes(id)) {
        removed.push(id);
      }
    });
    post.dislikes = removed;
    setPost(post);
  }, [post]);


  const createComment = async (body: CreateCommentType) => {
    try {
      const response = await fetch(`/api/posts/${post._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        toast.error(data.error);
      }
      toast.success("Successfully Created Comment.");
      setComments((prevComments) => [...prevComments, data.comment]);
      setCommentUsernames((prevCommentUsernames) => [...prevCommentUsernames, data.commentUsername]);
      router.refresh();
      reset();
    } catch (error) {
      console.log(error);
      toast.error("Internal server error.");
    }
  };

  const handleLikes = async () => {
    try {
      const response = await fetch(`/api/posts/${post._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          liked: true,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        toast.error(data.error);
      } else {
        setPost(data.post);
      }
    } catch (error) {
      console.log(error);
      toast.error("Internal server error.");
    }
  };

  const handleDislikes = async () => {
    try {
      const response = await fetch(`/api/posts/${post._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          disliked: true,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        toast.error(data.error);
      } else {
        setPost(data.post);
      }
    } catch (error) {
      console.log(error);
      toast.error("Internal server error.");
    }
  };

  const handleCommentLikes = async (commentId: string) => {
    try {
      const response = await fetch(`/api/posts/${post._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentLiked: true,
          commentId: commentId,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        toast.error(data.error);
      } else {
        setComments((prevComments) =>
          prevComments.map((comment) => {
            if (comment._id === data.comment._id) {
              return data.comment;
            } else {
              return comment;
            }
          }),
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("Internal server error.");
    }
  };

  const handleCommentDislikes = async (commentId: string) => {
    try {
      const response = await fetch(`/api/posts/${post._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentDisliked: true,
          commentId: commentId,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        toast.error(data.error);
      } else {
        setComments((prevComments) =>
          prevComments.map((comment) => {
            if (comment._id === data.comment._id) {
              return data.comment;
            } else {
              return comment;
            }
          }),
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("Internal server error.");
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="space-y-6">
        <h3 className="mt-5 text-2xl font-semibold text-pink-400">{post.title}</h3>
        <p className="text-gray mt-2">{post.text}</p>
        <div className="mt-3 flex gap-x-8 text-sm">
          <Link href={`/profile/${post.user_id}`}>
            <p>@{username}</p>
          </Link>
          <button onClick={() => handleLikes()}>&#x25B2; {post.likes.length}</button>
          <button onClick={() => handleDislikes()}>&#x25BC; {post.dislikes.length}</button>
        </div>
        <br />
        <p>Comments</p>
        <ul>
          {comments &&
            comments.map((comment, index) => (
              <li key={index} className="mb-10">
                <p>{comment.text}</p>
                <div className="mt-3 flex gap-x-8 text-sm">
                  <Link href={`/profile/${comment.user_id}`}>
                    <p>@{commentUsernames[index]}</p>
                  </Link>
                  <button onClick={() => handleCommentLikes(comment._id as string)}>
                    &#x25B2; {comment.likes.length}
                  </button>
                  <button onClick={() => handleCommentDislikes(comment._id as string)}>
                    &#x25BC; {comment.dislikes.length}
                  </button>
                </div>
              </li>
            ))}
        </ul>
        <form className="flex flex-col gap-y-4" onSubmit={handleSubmit(createComment)}>
          <div className="flex flex-col gap-y-2">
            <label htmlFor="text">
              <strong>Leave a Comment:</strong>
            </label>
            <textarea className="grow border border-solid border-black p-2" {...register("text")} />
            {errors.text && <span className="text-red-600">{errors.text.message}</span>}
          </div>
          {errors.root && <span className="text-red-600">{errors.root?.message}</span>}
          <button className="w-fit self-center border border-solid border-black p-2" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
