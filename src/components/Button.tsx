"use client";

import { Button } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";
import { deletePostClient, deleteCommentClient } from "@/utils/client-side";

type DeleteButtonProps = {
  id: string;
  type: "post" | "comment";
};

export default function DeleteButton({ id, type }: DeleteButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
      if (type === "post") {
        await deletePostClient(id);
      } else if (type === "comment") {
        await deleteCommentClient(id);
      }
      router.refresh();
    }
  };

  return (
    <Button 
      variation="destructive" 
      onClick={handleDelete}
    >
      {type === "post" ? "Delete Post" : "Delete Comment"}
    </Button>
  );
}