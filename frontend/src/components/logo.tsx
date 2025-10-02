import Link from "next/link";

export default function Logo() {
  return (
    <>
      {/* 메인 로고 */}
      <Link href="/" className="flex items-center space-x-2">
        <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
          <span className="text-primary-foreground text-lg font-bold">F</span>
        </div>
        <span className="text-foreground text-xl font-bold">이바닥 고수들</span>
      </Link>
    </>
  );
}
