import { useSession } from "next-auth/react";

const AccountManagement = () => {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Please sign in to view your account.</div>;

  return (
    <div>
      <h2>Account</h2>
      <p>Email: {session.user?.email}</p>
      {/* Add password change, profile update, etc. */}
    </div>
  );
};

export default AccountManagement;
