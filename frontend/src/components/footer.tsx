import Logo from "@/components/logo";

export default function Footer () {
    return (
        <>
            {/* 푸터 */}
            <footer className="bg-muted py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 justify-center items-center">
                        <Logo />
                        <p className="text-muted-foreground">© 2025 FreelanceHub. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>

    );
}