"use client";

import { Button } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";
import { deletePostClient } from "@/utils/client-side";

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      await deletePostClient(id);
      router.refresh();
    }
  };

  return (
    <Button 
      variation="destructive" 
      onClick={handleDelete}
    >
      Delete Post
    </Button>
  );
}