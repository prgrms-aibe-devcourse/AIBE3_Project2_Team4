import Link from "next/link";

export default function Logo() {
  return (
    <>
      {/* 메인 로고 */}
      <Link href="/" className="flex items-center space-x-2">
        <div className="bg-primary /* min≈h-6, max=h-8(2rem) */ flex h-[clamp(1.5rem,3.5vw,2rem)] w-[clamp(1.5rem,3.5vw,2rem)] items-center justify-center rounded-lg">
          <span className="text-primary-foreground /* max = text-lg(1.125rem) */ [font-size:clamp(0.95rem,2.2vw,1.125rem)] leading-none font-bold">
            E
          </span>
        </div>

        <span className="text-foreground /* max = text-xl(1.25rem) */ [font-size:clamp(1rem,2.6vw,1.25rem)] leading-none font-bold break-keep">
          이바닥 고수들
        </span>
      </Link>
    </>
  );
}
