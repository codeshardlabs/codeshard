# CodeShard: browser based collaborative code editor

<!-- ## High Level Design

<img src="images/final high level design.png" alt="Image 1" /> -->

## Local Setup

1. Clone the repository into your system.

```bash
git clone https://github.com/MridulDhiman/code-shard.git
```

2. Install `pnpm` as a package manager globally in your systems, if you haven't installed it yet using this command:

```bash
npm install -g pnpm
```

3. Install all packages and dev dependencies for your project.

```bash
pnpm install
```

4. Setup environment variables inside of `.env.local` file.

```bash

## Replace with your values
HOST_URL="http://localhost:3000"
NEXT_PUBLIC_BACKEND_URL="http://localhost:8080"
NEXT_PUBLIC_WS_ENDPOINT="ws://localhost:8080"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
CLERK_SECRET_KEY=<clerk-secret-here>
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

5. Disable Next.js from scraping telemetry data from your system
```bash
pnpm exec next telemetry disable
```

## Overview

It is browser based collaborative code editor with built-in frontend templates support like React, Svelte, Vue, Angular, Solid etc. Each template provides multi-file support, and you can add new files, dependencies and dev dependencies. It executes the code within the browser itself, inside a separate iframe. User can Signup/Login using email and password. Even without login, one can try out all the editors and their code state would be saved permanently, even after closing the tab. After successful login, you can create new shards/playgrounds in your account, and it would be visible in your profile. You can change the visibility of particular shard from Public to Private and vice versa. User can like each other's posts and comment on them, and follow each other. Personalized Comment Thread for each post. User have a personalized github like feed, where he/she can she all the activities of the users he/she have followed. User can create collaborative rooms and shard room id, and they can collaborative on multiple files at the same time, without worrying about write conflicts, as they get synchronized automatically by CRDTs.

## Demo

<table>
  <tr>
    <td><img src="public/images/image-10.png" alt="Image 1" width="200"/></td>
    <td><img src="public/images/shard.png" alt="Image 2" width="200"/></td>
    <td><img src="public/images/image-3.png" alt="Image 3" width="200"/></td>
  </tr>
  <tr>
    <td><img src="public/images/image-4.png" alt="Image 4" width="200"/></td>
    <td><img src="public/images/image-5.png" alt="Image 5" width="200"/></td>
    <td><img src="public/images/image-7.png" alt="Image 6" width="200"/></td>
  </tr>
  <tr>
    <td><img src="public/images/image-8.png" alt="Image 7" width="200"/></td>
    <td><img src="public/images/image-9.png" alt="Image 8" width="200"/></td>
    <td></td>
  </tr>
</table>
