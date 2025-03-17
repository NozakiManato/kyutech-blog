import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">ログイン</h1>
          <p className="mt-2 text-muted-foreground">
            今日も一日頑張っていきましょう！
          </p>
        </div>
        <div className="flex justify-center">
          <SignIn />
        </div>
        <div></div>
      </div>
    </div>
  );
}
