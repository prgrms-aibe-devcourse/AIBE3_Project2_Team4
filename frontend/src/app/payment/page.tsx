"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Shield, Lock, AlertCircle } from "lucide-react";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { v4 as uuidv4 } from "uuid";
import { useLoginStore } from "@/store/useLoginStore";
import { authorizedFetch } from "@/lib/api";

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;
const customerKey = uuidv4();
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [payment, setPayment] = useState(null as any);
  const [error, setError] = useState<string>("");
  const { member } = useLoginStore();

  // Get payment details from URL params
  const amount = searchParams.get("amount") || "500000";
  const memo = searchParams.get("memo") || "웹사이트 디자인 및 개발 프로젝트 1차 결제입니다.";
  const serviceName = searchParams.get("service") || "웹사이트 디자인 및 개발";
  const chatId = searchParams.get("chatId") || "";

  // 토스페이먼츠 위젯 초기화
  useEffect(() => {
    async function fetchPaymentWidgets() {
      try {
        const tossPayments = await loadTossPayments(clientKey);

        // 회원 결제
        const payment = tossPayments.payment({
          customerKey,
        });
        // 비회원 결제
        // const payment = tossPayments.payment({ customerKey: ANONYMOUS });

        setPayment(payment);
      } catch (err) {
        console.error("토스페이먼츠 초기화 실패:", err);
        setError("결제 시스템 초기화에 실패했습니다.");
      }
    }

    fetchPaymentWidgets();
  }, [clientKey, customerKey]);

  const handlePayment = async () => {
    if (!member) {
      setError("결제를 진행하려면 로그인이 필요합니다.");
      return;
    }

    setIsProcessing(true);
    setError("");
    try {
      const orderId = uuidv4();
      const paymentAmount = parseInt(amount);

      // 1단계: 결제를 요청하기 전에 orderId, amount를 서버에 저장
      // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도
      const saveResponse = await authorizedFetch(`${baseUrl}/api/v1/payments/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderId,
          amount: paymentAmount,
        }),
      });

      if (!saveResponse.ok) {
        const err = await saveResponse.json();
        throw new Error(err.message || "임시 결제 데이터 저장 실패");
      }

      // 2단계: 결제 요청
      await payment.requestPayment({
        method: "CARD", // 카드 결제
        amount: {
          currency: "KRW",
          value: paymentAmount,
        },
        orderId: orderId,
        orderName: serviceName,
        successUrl: `${window.location.origin}/payment/success?chatId=${chatId}&memo=${encodeURIComponent(memo)}`,
        failUrl: `${window.location.origin}/payment/fail`,
        customerEmail: member?.email,
        customerName: member?.nickname,
        card: {
          useEscrow: false,
          flowMode: "DEFAULT", // 통합결제창 여는 옵션
          useCardPoint: false,
          useAppCardOnly: false,
        },
      });
    } catch (err: any) {
      console.error("결제 요청 실패:", err);
      setError(err.message || "결제 요청 중 오류가 발생했습니다.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/10 absolute top-0 left-1/4 h-96 w-96 rounded-full blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-12">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="bg-primary/20 mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full">
              <CreditCard className="text-primary h-8 w-8" />
            </div>
            <h1 className="mb-2 text-4xl font-bold text-white">결제하기</h1>
            <p className="text-slate-400">토스페이먼츠 안전 결제</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-auto mb-6 max-w-4xl">
              <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-red-500">결제 오류</p>
                  <p className="mt-1 text-xs text-slate-300">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left: Payment Details & Widget */}
            <div className="space-y-6 lg:col-span-2">
              {/* Service Information */}
              <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">서비스 정보</h2>
                    <Badge
                      variant="secondary"
                      className="bg-primary/20 text-primary border-primary/30"
                    >
                      결제 대기
                    </Badge>
                  </div>

                  <Separator className="bg-slate-800" />

                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <span className="text-slate-400">서비스명</span>
                      <span className="max-w-xs text-right font-medium text-white">
                        {serviceName}
                      </span>
                    </div>

                    {memo && (
                      <div className="flex items-start justify-between">
                        <span className="text-slate-400">메모</span>
                        <span className="max-w-xs text-right text-sm leading-relaxed text-slate-300">
                          {memo}
                        </span>
                      </div>
                    )}

                    <Separator className="bg-slate-800" />

                    <div className="flex items-baseline justify-between">
                      <span className="text-slate-400">서비스 가격</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-white">
                          {Number.parseInt(amount).toLocaleString()}
                        </span>
                        <span className="text-slate-400">원</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Widget */}
              <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                <CardContent className="space-y-6 p-6">
                  <h2 className="text-xl font-semibold text-white">결제 수단 선택</h2>
                  <Separator className="bg-slate-800" />

                  {/* 결제 수단 UI */}
                  <div id="payment-method" className="min-h-[200px]" />

                  {/* 약관 동의 UI */}
                  <div id="agreement" className="mt-6" />
                </CardContent>
              </Card>

              {/* Security Notice */}
              <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/30 p-4">
                <Shield className="h-5 w-5 flex-shrink-0 text-green-500" />
                <p className="text-sm text-slate-300">
                  모든 결제는 토스페이먼츠의 SSL 암호화로 보호되며, 안전하게 처리됩니다.
                </p>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                <Card className="border-slate-700 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 shadow-2xl">
                  <CardContent className="space-y-6 p-6">
                    <div>
                      <h3 className="mb-4 text-lg font-semibold text-white">결제 요약</h3>
                      <Separator className="mb-4 bg-slate-700" />

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">결제 금액</span>
                          <span className="font-medium text-white">
                            {Number.parseInt(amount).toLocaleString()}원
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">수수료</span>
                          <span className="font-medium text-white">0원</span>
                        </div>
                      </div>

                      <Separator className="my-4 bg-slate-700" />

                      <div className="flex items-baseline justify-between">
                        <span className="font-medium text-slate-300">총 결제 금액</span>
                        <div className="flex items-baseline gap-1">
                          <span className="from-primary bg-gradient-to-r to-purple-500 bg-clip-text text-3xl font-bold text-transparent">
                            {Number.parseInt(amount).toLocaleString()}
                          </span>
                          <span className="text-lg text-slate-400">원</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handlePayment}
                      disabled={isProcessing || !member}
                      className="from-primary hover:from-primary/90 h-14 w-full bg-gradient-to-r to-purple-600 text-lg font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] hover:to-purple-600/90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <div className="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
                          결제 진행중...
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-5 w-5" />
                          {!member ? "로그인 필요" : "결제하기"}
                        </>
                      )}
                    </Button>

                    <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
                        <div className="space-y-1">
                          <p className="text-xs text-slate-300">
                            결제 수단을 선택하고 약관에 동의한 후 결제하기 버튼을 눌러주세요.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Flow Indicator */}
                <Card className="border-slate-800 bg-slate-900/30">
                  <CardContent className="p-6">
                    <h4 className="mb-4 text-sm font-semibold text-white">결제 후 진행 과정</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/20 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                          <span className="text-primary text-xs font-bold">1</span>
                        </div>
                        <p className="text-sm text-slate-300">결제 완료</p>
                      </div>
                      <div className="ml-4 h-4 border-l-2 border-slate-700" />
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/20 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                          <span className="text-primary text-xs font-bold">2</span>
                        </div>
                        <p className="text-sm text-slate-300">채팅방에 완료 메시지 전송</p>
                      </div>
                      <div className="ml-4 h-4 border-l-2 border-slate-700" />
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/20 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                          <span className="text-primary text-xs font-bold">3</span>
                        </div>
                        <p className="text-sm text-slate-300">프로젝트 진행</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
