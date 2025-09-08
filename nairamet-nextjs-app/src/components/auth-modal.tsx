import { signIn, signOut } from "next-auth/react";

const AuthModal = () => {
  // ...existing modal UI...

  return (
    <div>
      {/* ...existing code... */}
      <button onClick={() => signIn()}>Sign In</button>
      <button onClick={() => signOut()}>Sign Out</button>
      {/* ...existing code... */}
    </div>
  );
};

export default AuthModal;
