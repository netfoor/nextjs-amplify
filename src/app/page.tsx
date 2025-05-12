import { cookieBasedClient, isAuthenticated } from "@/utils/amplify-utils";
import Post from "@/components/Post";

export default async function Home() {
  const { data: posts } = await cookieBasedClient.models.Post.list({
    selectionSet: ['title', 'id'], 
    authMode: 'apiKey',
  });

  const isSignedIn = await isAuthenticated();

  return (
    <main className="flex min-h-screen flex-col items-center p-24 w-1/2 m-auto">
      <h1 className="text-2xl pb-10">List of all titles</h1>
      <div className="w-full">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Post 
              key={post.id} 
              id={post.id} 
              title={post.title} 
              isSignedIn={isSignedIn}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No posts found. Add a new title to get started.</p>
        )}
      </div>
    </main>
  );
}
