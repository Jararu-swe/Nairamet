import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type CommentDTO = {
  id: string;
  name: string;
  content: string;
  createdAt: string;
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const rows = await prisma.comment.findMany({
    where: { articleId: id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  const comments: CommentDTO[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    content: r.content,
    createdAt: r.createdAt.toISOString(),
  }));
  return NextResponse.json({ comments });
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const body = await request.json();
    const session = await getServerSession(authOptions);
    const derivedName = session?.user?.name || session?.user?.email?.split("@")[0];
    const name = String(body.name || derivedName || "Anonymous").trim();
    const content = String(body.content || "").trim();

    if (!content || content.length < 2) {
      return NextResponse.json(
        { error: "Comment is too short" },
        { status: 400 }
      );
    }

    const row = await prisma.comment.create({
      data: {
        articleId: id,
        userId: session?.user?.id ? String(session.user.id) : null,
        name: name || "Anonymous",
        content,
      },
    });

    const comment: CommentDTO = {
      id: row.id,
      name: row.name,
      content: row.content,
      createdAt: row.createdAt.toISOString(),
    };

    return NextResponse.json({ comment }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
