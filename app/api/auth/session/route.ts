import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
      });
    }

    // Find existing user
    let user = await prisma.user.findUnique({ where: { email } });

    // Create if not exists
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || email.split("@")[0],
        },
      });
      return new Response(JSON.stringify({ user, isNewUser: true }), {
        status: 200,
      });
    }

    // Update name if provided and changed
    if ((!user.name || user.name !== name) && name) {
      user = await prisma.user.update({
        where: { email },
        data: { name },
      });
    }

    return new Response(JSON.stringify({ user, isNewUser: false }), {
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
