# Complete AWS Amplify Next.js Project Documentation

This documentation provides a comprehensive guide to the AWS Amplify Next.js project, explaining its architecture, features, implementation details, and solutions to common challenges.

## Project Overview

This project is a fullstack application built with Next.js and AWS Amplify, featuring:

- User authentication
- Post creation and management 
- Comment functionality
- Serverless backend with AWS services

## Architecture

### Frontend
- Framework: Next.js 15 with App Router
- UI Components: AWS Amplify UI React components and custom components
- Styling: Tailwind CSS

### Backend (AWS Amplify)
- Authentication: AWS Cognito
- Database: AWS DynamoDB (through Amplify Data)
- GraphQL API: Auto-generated from schema definitions

## Setup Instructions

### Prerequisites
- Node.js LTS version (recommended: use NVM)
- AWS account
- Amplify CLI

### Environment Setup

```bash
# Install NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc

# Install and use LTS version of Node.js
nvm install --lts
nvm use --lts

# Lock Node.js version for project (recommended)
echo "18" > .nvmrc
```

### Project Creation

```bash
# Create Next.js project
npx create-next-app@latest

# Optional: Install code quality tools
npm install --save-dev --save-exact @biomejs/biome
npx @biomejs/biome init

# Optional: Install UI component library
npx shadcn@latest init

# Install Amplify dependencies
npm i aws-amplify @aws-amplify/ui-react @aws-amplify/adapter-nextjs

# Initialize Amplify
npm create amplify@latest

# Create local development sandbox
npx ampx sandbox
```

### Project Structure

```
src/
    app/                   # Next.js App Router pages
        _actions/            # Server actions for data mutations
        add/                 # Add post page
        posts/[id]/          # Post detail page with comments
        page.tsx             # Home page listing all posts
    components/            # React components
        auth/                # Authentication components
        AddComment.tsx       # Client component for adding comments
        Button.tsx          # Reusable delete button component
        NavBar.tsx          # Navigation component
        Post.tsx            # Post list item component
    utils/                # Utility functions
        amplify-utils.ts    # Server-side Amplify utilities
        client-side.ts      # Client-side Amplify utilities
amplify/                # Amplify configuration
    auth/                 # Auth resource configuration
    data/                # Data models and schema
    backend.ts           # Backend definition
```

## Key Features Implementation

### Authentication
The application uses AWS Cognito through Amplify for user authentication. The Auth component in `Auth.tsx` provides the authentication context for the entire application.

### Data Models
The data schema is defined in `resource.ts`:

```typescript
const schema = a.schema({
    Post: a
        .model({
            title: a.string().required(),
            content: a.string(),
            owner: a.string(),
            comments: a.hasMany('Comment', 'postId'),
        })
        .authorization((allow) => [
            allow.publicApiKey().to(["read"]),
            allow.owner(),
        ]),

    Comment: a
        .model({
            content: a.string().required(),
            post: a.belongsTo('Post', 'postId'),
            postId: a.id().required(),
            owner: a.string(),
        })
        .authorization((allow) => [
            allow.publicApiKey().to(["read"]),
            allow.owner(),
        ]),
});
```

### Server and Client Separation
The project properly separates server and client components following Next.js App Router architecture:

- Server Components: Handle data fetching and initial rendering
- Client Components: Handle user interactions and state management (marked with "use client")

### Server Actions
Server actions in `actions.ts` handle data mutations:

```typescript
export async function createPost(formData: FormData) {
        const {data} = await cookieBasedClient.models.Post.create({
                title: formData.get('title')?.toString() || "",
        });
        redirect('/');
}

export async function addComment(
    content: string,
    postId: string,
    paramsId: string
) {
    if (content.trim().length === 0) return;
    
    const { data: comment, errors } = await cookieBasedClient.models.Comment.create({
        postId,
        content
    });

    redirect(`/posts/${paramsId}`);
}
```

## Common Issues and Solutions

### Server/Client Component Separation
**Problem:** Mixing server-side code with client components causes errors: "You're importing a component that needs 'next/headers'. That only works in a Server Component"

**Solution:**
- Separate utilities into server-specific (`amplify-utils.ts`) and client-specific (`client-side.ts`) files
- Use `generateServerClientUsingCookies` for server components
- Use `generateClient` for client components
- Create separate functions for each context (e.g., `deletePost` vs `deletePostClient`)

### Field-Level Authorization Issues
**Problem:**
```
Error: [InvalidDirectiveError] When using field-level authorization rules you need to add rules to all of the model's required fields with at least read permissions.
```

**Solution:** Use model-level authorization instead of field-level authorization for consistency.

### Prop Passing Between Server and Client Components
**Problem:** Passing complex objects across the client-server boundary causes serialization issues

**Solution:**
- Pass only primitive values (IDs, strings) instead of full objects
- Keep client components focused on presentation and interaction
- Let server components handle data fetching

## Deployment

### Amplify Configuration
Create an `amplify.yml` in your root directory:

```yaml
version: 1
frontend:
    phases:
        preBuild:
            commands:
                - curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
                - source ~/.nvm/nvm.sh
                - nvm install --lts
                - nvm use --lts
                - nvm alias default lts
                - npm ci
        build:
            commands:
                - npm run build
    artifacts:
        baseDirectory: .next
        files:
            - '**/*'
    cache:
        paths:
            - node_modules/**/*
            - $HOME/.nvm/**/*
```

### Pre-Deployment Testing
To save costs on AWS Amplify, test builds locally before deployment:

```bash
npm run build
```

Or use GitHub Actions for automated testing:

```yaml
name: Build Check for Amplify

on:
    push:
        branches:
            - '**'
    pull_request:

jobs:
    build:
        runs-on: ubuntu-latest
        steps:
            - name: Checkout code
                uses: actions/checkout@v3

            - name: Install NVM
                run: |
                    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
                    export NVM_DIR="$HOME/.nvm"
                    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
                    nvm install --lts
                    nvm use --lts
                    nvm alias default lts
                    echo "NVM_DIR=$NVM_DIR" >> $GITHUB_ENV
                    echo "PATH=$NVM_DIR/versions/node/$(ls $NVM_DIR/versions/node)/bin:$PATH" >> $GITHUB_ENV

            - name: Install dependencies
                run: npm ci

            - name: Run build
                run: npm run build
```

## Best Practices

### Component Structure
- Server Components: Data fetching, SEO, initial rendering
- Client Components: Interactivity, events, state management

### State Management
- Use server actions for data mutations
- Implement proper error handling
- Use redirection or revalidation after mutations

### Authentication
- Enforce proper authorization on both frontend and backend
- Check authentication status before showing sensitive UI elements

### Performance
- Keep client components small and focused
- Minimize client-side JavaScript
- Leverage Server Components for improved performance

## Evolution of Web Development Patterns
This project demonstrates modern patterns that evolved from AJAX:

1. 2005: Full page reloads
2. 2010: AJAX + jQuery
3. 2015: React state management
4. 2020: SWR/React Query
5. 2023: Server Components + Optimistic UI

Next.js App Router provides tools like Server Actions, revalidatePath, and optimistic updates for a near real-time feel without complex WebSocket setups.

## Further Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [AWS Amplify Next.js Deployment Guide](https://docs.amplify.aws/nextjs/start/getting-started/introduction/)