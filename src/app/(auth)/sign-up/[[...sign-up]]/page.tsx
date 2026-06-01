import { redirect } from "next/navigation";

// No separate sign-up flow — Google OAuth handles both sign-in and sign-up.
const SignUpPage = () => {
  redirect("/sign-in");
};

export default SignUpPage;
