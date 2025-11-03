import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// POST /api/blog/like
export async function POST(req: Request) {
  return NextResponse.json(
    { error: 'Blog likes have been removed' },
    { status: 410 }
  );
}

// GET /api/blog/like?articleId=xxx
export async function GET(req: Request) {
  return NextResponse.json(
    { liked: false, count: 0, message: 'Blog likes have been removed' },
    { status: 410 }
  );
}

// Helper function to get the like count for an article
async function getLikeCount(articleId: string): Promise<number> {
  const article = await prisma.blogPost.findUnique({
    where: { id: articleId },
    select: { likeCount: true },
  });
  
  return article?.likeCount || 0;
}