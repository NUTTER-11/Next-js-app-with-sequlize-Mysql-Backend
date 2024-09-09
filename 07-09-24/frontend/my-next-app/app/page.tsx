import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";


export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">

      
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/login">
            <Mail className="mr-2 h-4 w-4" />
            Login
          </Link>
        </Button>

        <Button asChild>
          <Link href="/signup">
            Signup
          </Link>
        </Button>
      </div>
    </div>
  );
}
