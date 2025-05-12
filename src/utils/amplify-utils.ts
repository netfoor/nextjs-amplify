import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import outputs from '@/../amplify_outputs.json';
import { cookies } from 'next/headers';
import { getCurrentUser } from 'aws-amplify/auth/server';
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data';
import { Schema } from '../../amplify/data/resource';
import { revalidatePath } from 'next/cache';

export const { runWithAmplifyServerContext } = createServerRunner({
  config: outputs,
});

export const isAuthenticated = async ()=> await runWithAmplifyServerContext({
    nextServerContext: {cookies},
    async operation(contextSpec) {
        try {
            const user = await getCurrentUser(contextSpec);
            return !!user; 
        }
        catch (error) {
            return false;
        }   
}});

export const cookieBasedClient = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
  authMode: 'userPool',
});

// Server action to delete a post - this can only be used in Server Components
export async function deletePost(id: string) {
  try {
    const { data, errors } = await cookieBasedClient.models.Post.delete({
      id
    });
    
    if (errors) {
      console.error('Error deleting post:', errors);
      throw new Error('Failed to delete post');
    }
    
    revalidatePath('/');
    return { success: true, data };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { success: false, error };
  }
}