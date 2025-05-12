import { create } from "domain";
import React from "react";
import { createPost } from "@/app/_actions/actions";

const AddPost = () => {
  return (
    <div>
      <h1  className="">Add Post</h1>
      <form
        className="flex flex-col gap-4 w-1/2 m-auto"
        action={createPost}>
        <input 
        type="text" 
        placeholder="Title"
        name="title"
        id="title" 
        className="border border-gray-200"/>
        <button type="submit" className="" >
            Add Post
        </button>
      </form>
    </div>
  );
};
export default AddPost;