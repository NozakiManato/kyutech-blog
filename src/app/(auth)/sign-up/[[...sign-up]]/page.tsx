import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex min-h-screen  items-center justify-center gap-20">
      <div className="hidden md:block">
        <Image
          src="/kyutech_logo.jpg"
          alt="kyutechLogo"
          width="500"
          height="500"
        />
      </div>
      <SignUp />
    </div>
  );
}
