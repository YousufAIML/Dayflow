import { redirect } from "next/navigation";

/**
 * Root redirect — sends users to signin.
 * The middleware will then redirect authenticated users to their home.
 */
export default function RootPage() {
  redirect("/signin");
}
