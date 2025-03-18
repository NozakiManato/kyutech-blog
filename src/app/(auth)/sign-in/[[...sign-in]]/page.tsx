import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center gap-20">
      <div className="hidden md:block">
        <Image src="/kyutech.jpg" alt="kyutech" height="500" width="500" />
      </div>
      <SignIn />
    </div>
  );
}
