# Sellaap - Premium Digital Goods Marketplace

Sellaap is a comprehensive digital marketplace platform built with Next.js, specializing in Firestick setup services and digital product delivery.

## Features

- **Multi-Regional Support**: Customized experiences for UK, USA, Europe, Canada, and Australia.
- **Dynamic Category Management**: Admin tools for creating and organizing product categories.
- **Featured Products**: Highlight specific products on the homepage.
- **Blog System**: SEO-optimized content management for guides and updates.
- **Secure Admin Dashboard**: Full control over products, categories, and orders.
- **Responsive Design**: Optimized for all devices using Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Database**: SQLite (with Prisma ORM)
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Language**: TypeScript

## Getting Started

First, install the dependencies:

```bash
npm install
```

Run the database migrations:

```bash
npx prisma db push
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/src/app`: App router pages and API routes
- `/src/components`: Reusable UI components
- `/src/lib`: Utility functions and server actions
- `/prisma`: Database schema and seeds
- `/public`: Static assets

## License

[Add License Information Here]
