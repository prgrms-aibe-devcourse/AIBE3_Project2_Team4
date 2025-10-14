"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Home, MessageSquare, Loader2 } from "lucide-react";
import { authorizedFetch } from "@/lib/api";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(true);
  const [confirmData, setConfirmData] = useState<any>(null);
  const [error, setError] = useState<string>("");

  // URL 파라미터에서 결제 정보 추출
  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const chatId = searchParams.get("chatId");
  const memo = searchParams.get("memo");
  const serviceId = searchParams.get("serviceId");

  // 결제 승인 요청
  useEffect(() => {
    const confirmPayment = async () => {
      // 쿼리 파라미터 값이 결제 요청할 때 보낸 데이터와 동일한지 반드시 확인
      if (!paymentKey || !orderId || !amount) {
        setError("결제 정보가 올바르지 않습니다.");
        setIsConfirming(false);
        return;
      }

      const requestData = {
        orderId: orderId,
        amount: parseInt(amount),
        paymentKey: paymentKey,
        memo: memo || "",
        serviceId: serviceId,
      };

      try {
        const response = await authorizedFetch(`${baseUrl}/api/v1/payments/confirm`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        const json = await response.json();

        if (!response.ok) {
          // 결제 실패 비즈니스 로직
          throw new Error(json.message || "결제 승인에 실패했습니다.");
        }

        // 결제 성공 비즈니스 로직
        setConfirmData(json);
      } catch (err: any) {
        console.error("결제 승인 실패:", err);
        const errorMessage = err.message || "결제 승인 중 오류가 발생했습니다.";
        const errorCode = err.code || "PAYMENT_CONFIRMATION_FAILED";

        // 실패 페이지로 리다이렉트
        router.push(`/payment/fail?message=${encodeURIComponent(errorMessage)}&code=${errorCode}`);
        return;
      } finally {
        setIsConfirming(false);
      }
    };

    confirmPayment();
  }, [paymentKey, orderId, amount, router]);

  // 채팅방으로 이동
  const goToChat = () => {
    if (chatId) {
      window.location.href = `/mypage?tab=chat&id=${chatId}`;
    } else {
      window.location.href = "/mypage?tab=chat";
    }
  };

  // 홈으로 이동
  const goToHome = () => {
    window.location.href = "/";
  };

  // 로딩 상태
  if (isConfirming) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="flex min-h-screen items-center justify-center">
          <Card className="w-full max-w-md border-slate-800 bg-slate-900/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center space-y-4 p-12">
              <Loader2 className="text-primary h-16 w-16 animate-spin" />
              <h2 className="text-2xl font-bold text-white">결제 승인 처리중</h2>
              <p className="text-center text-slate-400">
                결제 정보를 확인하고 있습니다.
                <br />
                잠시만 기다려주세요.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // 성공 상태
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-green-500/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          {/* Success Icon */}
          <div className="mb-8 flex justify-center">
            <div className="animate-in zoom-in duration-500">
              <img
                src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
                alt="Success"
                className="h-32 w-32"
              />
            </div>
          </div>

          {/* Main Card */}
          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
            <CardContent className="space-y-8 p-8">
              {/* Title */}
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold text-white">결제가 완료되었습니다</h1>
                <p className="text-slate-400">결제 정보가 채팅방으로 전송되었습니다.</p>
              </div>

              {/* Response Data */}
              {confirmData.receiptUrl && (
                <div className="flex justify-center">
                  <Button
                    asChild
                    variant="outline"
                    className="border-emerald-600 text-emerald-400 hover:bg-emerald-600/20"
                  >
                    <a href={confirmData.receiptUrl} target="_blank" rel="noopener noreferrer">
                      🧾 영수증 확인하기
                    </a>
                  </Button>
                </div>
              )}

              {/* Success Message */}
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-green-500">
                      결제가 성공적으로 완료되었습니다
                    </p>
                    <p className="text-xs text-slate-400">
                      프로젝트 진행과 관련된 내용은 채팅방에서 확인하실 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={goToHome}
                  variant="outline"
                  className="flex-1 border-slate-700 bg-slate-800/50 hover:bg-slate-800"
                >
                  <Home className="mr-2 h-4 w-4" />
                  홈으로
                </Button>
                <Button
                  onClick={goToChat}
                  className="from-primary hover:from-primary/90 flex-1 bg-gradient-to-r to-purple-600 hover:to-purple-600/90"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  채팅방으로
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
