import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, name, supabaseId } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
      });
    }

    // Try to find the user by email
    let user = await prisma.user.findUnique({ where: { email } });

    // If not found, create the user
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || email.split("@")[0],
          // You can add other fields here if needed
        },
      });
      return new Response(JSON.stringify({ user, isNewUser: true }), {
        status: 200,
      });
    }

    // If found, update the name if it's missing and provided
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
