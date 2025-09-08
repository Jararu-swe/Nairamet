declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      // Add any other custom properties you want to include in the session
    };
  }

  interface User {
    id: string;
    email: string;
    // Add any other custom properties you want to include in the user object
  }
}