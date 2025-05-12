"use client"

import { useRouter } from "next/navigation";
import { Button } from "@aws-amplify/ui-react";
import Link from "next/link";
import { deletePostClient } from "@/utils/client-side";

interface PostProps {
  id: string;
  title: string;
  isSignedIn: boolean;
}

export default function Post({ id, title, isSignedIn }: PostProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      await deletePostClient(id);
      router.refresh();
    }
  };

  return (
    <div className="border-b-2 border-gray-300 py-2 w-full flex justify-between items-center">
      <Link href={`/post/${id}`} className="text-lg font-semibold hover:text-blue-500">
        {title}
      </Link>
      {isSignedIn && (
        <Button
          variation="destructive"
          size="small"
          onClick={handleDelete}
        >
          Delete
        </Button>
      )}
    </div>
  );
}