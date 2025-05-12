import { cookieBasedClient, isAuthenticated, deletePost } from "@/utils/amplify-utils";
import { Button } from "@aws-amplify/ui-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PostPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const isSignedIn = await isAuthenticated();
  
  const { data: post } = await cookieBasedClient.models.Post.get({
    id,
  });

  if (!post) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-2xl pb-10">Post not found</h1>
        <Link href="/" className="text-blue-500 hover:underline">
          Back to homepage
        </Link>
      </main>
    );
  }

  async function handleDelete() {
    "use server";
    await deletePost(id);
    redirect('/');
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24 w-1/2 m-auto">
      <h1 className="text-3xl font-bold mb-6">{post.title}</h1>
      
      <div className="mb-8 w-full">
        {post.content ? (
          <p className="text-lg">{post.content}</p>
        ) : (
          <p className="text-gray-500 italic">No content provided</p>
        )}
      </div>
      
      <div className="flex gap-4 mt-8">
        <Link href="/" className="text-blue-500 hover:underline">
          Back to home
        </Link>
        
        {isSignedIn && (
          <form action={handleDelete}>
            <Button type="submit" variation="destructive">
              Delete Post
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}