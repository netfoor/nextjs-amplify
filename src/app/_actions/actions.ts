"use server"

import { cookieBasedClient } from "@/utils/amplify-utils"
import { Schema } from "../../../amplify/data/resource";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type PostWithId = Schema["Post"] & { id: string };

export async function createPost(formData: FormData) {
    const {data} = await cookieBasedClient.models.Post.create({
        title: formData.get('title')?.toString() || "",
    });
    console.log('data: ', data);
    redirect('/'); // Redirect to the home page after creating the post
}

export async function addComment(
  content: string,
  postId: string,
  paramsId: string
) {
  if (content.trim().length === 0) return;
  
  const { data: comment, errors } = await cookieBasedClient.models.Comment.create({
    postId,
    content
  });

  if (errors) {
    console.error('Error creating comment:', errors);
    throw new Error('Failed to create comment');
  }
  redirect(`/posts/${paramsId}`); // Redirect to the post page after adding the comment

  // Revalidation logic would go here if using Next.js caching
}