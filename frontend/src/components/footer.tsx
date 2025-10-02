import Logo from "@/components/logo";

export default function Footer() {
  return (
    <>
      {/* 푸터 */}
      <footer className="bg-muted py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <Logo />
            <p className="text-muted-foreground">© 2025 FreelanceHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
