import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
  try {
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
  } catch (err) {
    console.error("Comments GET failed:", err);
    const msg = (err as any)?.message || String(err || "");
    const isConnIssue = /P1001|ECONNREFUSED|timeout|connect/i.test(msg);
    const isMissingTable = /relation .*comments.* does not exist|UndefinedTable/i.test(
      msg
    );
    if (isConnIssue || isMissingTable) {
      // Graceful fallback: return empty list so the UI can render without errors
      return NextResponse.json(
        { comments: [] },
        { headers: { "X-Comments-Source": "fallback" } }
      );
    }
    return NextResponse.json(
      { error: "Failed to load comments" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const body = await request.json();
    const name = String(body.name || "Anonymous").trim();
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
        userId: null,
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
    console.error("Comments POST failed:", err);
    const msg = (err as any)?.message || String(err || "");
    const isConnIssue = /P1001|ECONNREFUSED|timeout|connect/i.test(msg);
    const isMissingTable = /relation .*comments.* does not exist|UndefinedTable/i.test(
      msg
    );
    if (isConnIssue) {
      return NextResponse.json(
        {
          error:
            "Database connection unavailable. Please try again in a few minutes.",
        },
        { status: 503 }
      );
    }
    if (isMissingTable) {
      return NextResponse.json(
        {
          error:
            "Comments table is not ready. Apply migrations to enable commenting.",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
