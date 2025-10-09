"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, CheckCircle2, Shield, Lock } from "lucide-react";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Get payment details from URL params
  const amount = searchParams.get("amount") || "500000";
  const memo = searchParams.get("memo") || "웹사이트 디자인 및 개발 프로젝트 1차 결제입니다.";
  const serviceName = searchParams.get("service") || "웹사이트 디자인 및 개발";
  const chatId = searchParams.get("chatId") || "";

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setIsCompleted(true);

    // Redirect to chat after 2 seconds
    setTimeout(() => {
      if (chatId) {
        window.location.href = `/mypage?tab=chat&id=${chatId}`;
      }
    }, 2000);
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
            <p className="text-slate-400">안전하고 빠른 결제 시스템</p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left: Payment Details */}
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

              {/* Payment Method */}
              <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                <CardContent className="space-y-4 p-6">
                  <h2 className="text-xl font-semibold text-white">결제 수단</h2>
                  <Separator className="bg-slate-800" />

                  <div className="grid grid-cols-2 gap-4">
                    <button className="border-primary bg-primary/10 hover:bg-primary/20 rounded-xl border-2 p-4 transition-colors">
                      <CreditCard className="text-primary mx-auto mb-2 h-6 w-6" />
                      <p className="text-sm font-medium text-white">신용카드</p>
                    </button>
                    <button className="rounded-xl border border-slate-700 p-4 transition-colors hover:border-slate-600 hover:bg-slate-800/50">
                      <CreditCard className="mx-auto mb-2 h-6 w-6 text-slate-400" />
                      <p className="text-sm font-medium text-slate-400">계좌이체</p>
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/30 p-4">
                <Shield className="h-5 w-5 flex-shrink-0 text-green-500" />
                <p className="text-sm text-slate-300">
                  모든 결제는 SSL 암호화로 보호되며, 안전하게 처리됩니다.
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
                      disabled={isProcessing || isCompleted}
                      className="from-primary hover:from-primary/90 h-14 w-full bg-gradient-to-r to-purple-600 text-lg font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] hover:to-purple-600/90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <div className="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
                          결제 처리중...
                        </>
                      ) : isCompleted ? (
                        <>
                          <CheckCircle2 className="mr-2 h-5 w-5" />
                          결제 완료
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-5 w-5" />
                          결제하기
                        </>
                      )}
                    </Button>

                    {isCompleted && (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-green-500">
                                결제가 완료되었습니다
                              </p>
                              <p className="text-xs text-slate-400">
                                채팅방으로 결제 완료 메시지가 전송됩니다
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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
