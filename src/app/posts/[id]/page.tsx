import { cookieBasedClient, isAuthenticated } from "@/utils/amplify-utils";
import Link from "next/link";
import DeleteButton from "@/components/Button";
import { redirect } from "next/navigation";
import { addComment } from "@/app/_actions/actions";
import AddComment from "@/components/AddComment";

export default async function PostPage({ params }: { params: { id: string } }) {
    // Await the params object to ensure it's fully resolved
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    // Verify if id is not available
    if (!id) {
        return <p>Error: Invalid post ID.</p>;
    }

    // Verify if the user is authenticated
    const isSignedIn = await isAuthenticated();

    // Get the post by ID
    const { data: post } = await cookieBasedClient.models.Post.get(
        { id },
        {
            selectionSet: ['title', 'id'],
            authMode: 'apiKey',
        }
    );

    // Redirect if the post doesn't exist
    if (!post) {
        redirect("/");
    }

    // Get all comments
    const { data: allComments } = await cookieBasedClient.models.Comment.list({
        selectionSet: ['content', 'id', 'postId'],
        authMode: 'apiKey',
    });

    // Filter comments related to the current post
    const comments = allComments.filter((comment) => comment.postId === id);


    

    return (
        <div className="flex flex-col items-center justify-center w-full p-8">
            <h1 className="text-2xl font-bold mb-4">Post Information</h1>
            <div className="border p-4 rounded-lg shadow-md w-full max-w-md mb-8">
                <h2 className="text-xl font-semibold">{post.title}</h2>
                {isSignedIn && (
                    <div className="mt-4">
                        {/* Button to delete the post */}
                        <DeleteButton id={id} type="post" />
                    </div>
                )}
            </div>

            {isSignedIn && (
                <AddComment
                addComment={addComment}
                postId={id} // Just pass the ID instead of the whole post
                paramsId={id}
            />
            )}

            <h1 className="text-2xl font-bold mb-4">Comments</h1>
            {comments.length > 0 ? (
                comments.map((comment, idx) => (
                    <div key={idx} className="border p-4 rounded-lg shadow-md w-full max-w-md mb-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">{comment.content}</h2>
                            {isSignedIn && (
                                <DeleteButton id={comment.id} type="comment" />
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-500 italic">No comments available for this post.</p>
            )}

            <div className="mt-8">
                <Link href="/" className="text-blue-500 hover:underline">
                    Back to home
                </Link>
            </div>
        </div>
    );
}
