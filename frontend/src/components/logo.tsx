import Link from "next/link";

export default function Logo () {
    return (<>
        {/* 메인 로고 */}
            <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">F</span>
                </div>
                <span className="text-xl font-bold text-foreground">이바닥 고수들</span>
            </Link>
        </>
    );
}