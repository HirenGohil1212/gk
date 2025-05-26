
// This page is temporarily stubbed out as authentication is disabled.
// You may want to delete this file and its parent directory.
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Login Disabled</CardTitle>
          <CardDescription>Login functionality is temporarily unavailable.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center">Please return to the <Link href="/" className="text-primary hover:underline">Dashboard</Link>.</p>
        </CardContent>
      </Card>
    </div>
  );
}
