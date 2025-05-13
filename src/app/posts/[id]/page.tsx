import { cookieBasedClient, isAuthenticated } from "@/utils/amplify-utils";
import Link from "next/link";
import Button from "@/components/Button";
import { redirect } from "next/navigation";

export default async function PostPage({ params }: { params: { id: string } }) {
    if (!params.id) return null;
    const isSignedIn = await isAuthenticated();
    const { data: post } = await cookieBasedClient.models.Post.get(
        { id: params.id },
        {
            selectionSet: ['title', 'id'],
            authMode: 'apiKey',
        }
    );

    if (!post) {
        redirect("/");
    }

    return (
        <div className="flex flex-col items-center justify-center w-full p-8">
            <h1 className="text-2xl font-bold mb-4">Post Information</h1>
            <div className="border p-4 rounded-lg shadow-md w-full max-w-md mb-8">
                <h2 className="text-xl font-semibold">{post.title}</h2>
                
                {isSignedIn && (
                    <div className="mt-4">
                        <Button id={params.id} />
                    </div>
                )}
            </div>

            <h1 className="text-2xl font-bold mb-4">Comments</h1>
            {/* Comments section can be added here */}
            
            <div className="mt-8">
                <Link href="/" className="text-blue-500">
                    Back to home
                </Link>
            </div>
        </div>
    );
}
