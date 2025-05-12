import { cookieBasedClient } from "@/utils/amplify-utils"


export default async function Home() {

  const { data: posts } = await cookieBasedClient.models.Post.list({
    selectionSet: ['title', 'id'], 
    authMode: 'apiKey',
  });

  console.log('posts: ', posts);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 w-1/2 m-auto">
      <h1 className="text-2xl pb-10">List of all titles</h1>
      {posts?.map( async (post, idx) => (
        <div key={idx} className="border-b-2 border-gray-300 py-2">
          <div className="text-lg font-semibold">
            {post.title}
          </div>
        </div>
      ))}
      <p>This is a placeholder for the home page content.</p>
    </main>
  )
}
