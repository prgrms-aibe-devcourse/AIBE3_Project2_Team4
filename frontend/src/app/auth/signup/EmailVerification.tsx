import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { validateEmail } from "@/lib/validation/auth";

export default function EmailVerification({
  email,
  setVerified,
}: {
  email: string;
  setVerified: (v: boolean) => void;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [code, setCode] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0); // seconds

  const emailError = useMemo(() => validateEmail(email), [email]);
  const canSend = !emailError && !isLoading && cooldown === 0;
  const canResend = isSent && cooldown === 0 && !isLoading;
  const canConfirm = isSent && !!code.trim() && !isLoading;

  const sendCode = async () => {
    if (!canSend) return;
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${baseUrl}/api/v1/auth/email/verify/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || "인증 코드 전송 실패";
        throw new Error(errorMessage);
      }

      setIsSent(true);
      setSuccess(false);
      setCooldown(60); // 60s cooldown before resend
    } catch (err: any) {
      setError(err.message || "인증 코드 전송 중 오류 발생");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmCode = async () => {
    if (!code.trim()) {
      setError("코드를 입력해주세요");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${baseUrl}/api/v1/auth/email/verify/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: parseInt(code, 10) }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.message || "인증 확인 실패");
      }

      setSuccess(true);
      setVerified(true);
    } catch (err: any) {
      setError(err.message || "인증 확인 중 오류 발생");
      setVerified(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => {
      setCooldown((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        {!isSent ? (
          <>
            <Button type="button" onClick={sendCode} disabled={!canSend}>
              인증 코드 전송
            </Button>
            {cooldown > 0 && (
              <span className="text-muted-foreground self-center text-sm">{cooldown}s</span>
            )}
          </>
        ) : (
          <>
            <Input
              type="text"
              placeholder="인증 코드 입력"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="bg-input border-border flex-1"
            />
            <Button type="button" onClick={confirmCode} disabled={!canConfirm}>
              확인
            </Button>
            <Button type="button" variant="secondary" onClick={sendCode} disabled={!canResend}>
              {cooldown > 0 ? `재전송 (${cooldown}s)` : "재전송"}
            </Button>
          </>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert variant="default">
          <AlertDescription>이메일 인증이 완료되었습니다.</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
