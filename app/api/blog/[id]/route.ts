import { NextResponse } from "next/server";

type Comment = {
  id: string;
  name: string;
  content: string;
  createdAt: string;
};

// Simple in-memory store: Map<articleId, Comment[]>
const store = new Map<string, Comment[]>();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const comments = store.get(id) || [];
  return NextResponse.json({ comments });
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

    const comment: Comment = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name || "Anonymous",
      content,
      createdAt: new Date().toISOString(),
    };

    const list = store.get(id) || [];
    list.unshift(comment);
    store.set(id, list);

    return NextResponse.json({ comment }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
