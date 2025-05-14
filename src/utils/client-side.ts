"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

// Client-side data client
export const client = generateClient<Schema>();

// Client-side function to delete a post
export async function deletePostClient(id: string) {
  try {
    const { data, errors } = await client.models.Post.delete({
      id
    });
    
    if (errors) {
      console.error('Error deleting post:', errors);
      throw new Error('Failed to delete post');
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { success: false, error };
  }
}

// Client-side function to delete a comment
export async function deleteCommentClient(id: string) {
  try {
    const { data, errors } = await client.models.Comment.delete({
      id
    });

    if (errors) {
      console.error('Error deleting comment:', errors);
      throw new Error('Failed to delete comment');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error deleting comment:', error);
    return { success: false, error };
  }
}