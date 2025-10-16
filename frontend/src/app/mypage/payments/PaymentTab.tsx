"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Filter, ArrowUpDown, Calendar, CreditCard, Edit, Save, X, FileText } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { authorizedFetch } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import useLogin from "@/hooks/use-Login";
import { useRouter } from "next/navigation";

interface PaymentHistory {
  paymentKey: string;
  freelancerId: number;
  serviceId: number;
  serviceTitle: string;
  price: number;
  memo?: string;
  approvedAt: string;
  paymentStatus:
    | "READY"
    | "IN_PROGRESS"
    | "WAITING_FOR_DEPOSIT"
    | "DONE"
    | "CANCELED"
    | "PARTIAL_CANCELED"
    | "ABORTED"
    | "EXPIRED";
}

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function PaymentTab({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc" | "price-high" | "price-low">(
    "date-desc",
  );
  const [isEditingMemo, setIsEditingMemo] = useState<number | null>(null);
  const [editMemoText, setEditMemoText] = useState("");
  const MEMO_MAX_LENGTH = 200;

  const statusOptions = [
    { value: "DONE", label: "결제 완료" },
    { value: "IN_PROGRESS", label: "결제 진행중" },
    { value: "WAITING_FOR_DEPOSIT", label: "입금 대기" },
    { value: "CANCELED", label: "결제 취소" },
    { value: "READY", label: "결제 준비" },
    { value: "PARTIAL_CANCELED", label: "부분 취소" },
    { value: "ABORTED", label: "결제 중단" },
    { value: "EXPIRED", label: "결제 만료" },
  ];

  const fetchPaymentHistory = async () => {
    setIsPaymentLoading(true);
    setPaymentError(null);
    try {
      const res = await authorizedFetch(`${baseUrl}/api/v1/auth/me/payments`);
      if (!res.ok) throw new Error("결제 내역을 불러오는데 실패했습니다.");
      const data = await res.json();
      setPaymentHistory(data);
    } catch (e) {
      setPaymentError(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setIsPaymentLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/auth/login");
      return;
    }
    fetchPaymentHistory();
  }, [isLoggedIn]);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const getPaymentStatusText = (status: string) =>
    statusOptions.find((s) => s.value === status)?.label || status;

  const getPaymentStatusVariant = (status: string) => {
    switch (status) {
      case "DONE":
        return "bg-green-500 hover:bg-green-600";
      case "CANCELED":
      case "PARTIAL_CANCELED":
      case "ABORTED":
        return "bg-red-500 hover:bg-red-600";
      case "READY":
      case "IN_PROGRESS":
      case "WAITING_FOR_DEPOSIT":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "yyyy.MM.dd", { locale: ko });
    } catch {
      return dateString;
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...paymentHistory];
    if (selectedStatuses.size > 0) {
      result = result.filter((p) => selectedStatuses.has(p.paymentStatus));
    }
    result.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.approvedAt).getTime() - new Date(a.approvedAt).getTime();
        case "date-asc":
          return new Date(a.approvedAt).getTime() - new Date(b.approvedAt).getTime();
        case "price-high":
          return b.price - a.price;
        case "price-low":
          return a.price - b.price;
        default:
          return 0;
      }
    });
    return result;
  }, [paymentHistory, selectedStatuses, sortBy]);

  const handleStatusToggle = (status: string) => {
    const newStatuses = new Set(selectedStatuses);
    newStatuses.has(status) ? newStatuses.delete(status) : newStatuses.add(status);
    setSelectedStatuses(newStatuses);
  };

  const handleSaveMemo = async (paymentKey: string) => {
    await authorizedFetch(`${baseUrl}/api/v1/payments/${paymentKey}/memo`, {
      method: "PATCH",
      body: JSON.stringify({ memo: editMemoText }),
      headers: { "Content-Type": "application/json" },
    });
    setPaymentHistory((prev) =>
      prev.map((p) => (p.paymentKey === paymentKey ? { ...p, memo: editMemoText } : p)),
    );
    setIsEditingMemo(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            결제 내역
          </div>
          <div className="flex gap-2">
            {/* 필터 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" /> 상태 필터
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {statusOptions.map((s) => (
                  <DropdownMenuCheckboxItem
                    key={s.value}
                    checked={selectedStatuses.has(s.value)}
                    onCheckedChange={() => handleStatusToggle(s.value)}
                  >
                    {s.label}
                  </DropdownMenuCheckboxItem>
                ))}
                {selectedStatuses.size > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSelectedStatuses(new Set())}>
                      필터 초기화
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 정렬 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="h-4 w-4" /> 정렬
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("date-desc")}>최신순</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("date-asc")}>오래된순</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("price-high")}>
                  금액 높은순
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("price-low")}>
                  금액 낮은순
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" onClick={fetchPaymentHistory}>
              새로고침
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {isPaymentLoading ? (
          <p className="text-muted-foreground py-10 text-center">불러오는 중...</p>
        ) : paymentError ? (
          <p className="text-destructive py-10 text-center">{paymentError}</p>
        ) : filteredAndSortedData.length === 0 ? (
          <p className="text-muted-foreground py-10 text-center">결제 내역이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedData.map((payment, idx) => (
              <Card key={payment.paymentKey} className="transition hover:shadow-md">
                <div className="bg-muted flex h-40 items-center justify-center">
                  <FileText className="text-muted-foreground h-10 w-10" />
                </div>
                <CardContent className="space-y-3 p-4">
                  <h3 className="font-bold">{payment.serviceTitle}</h3>
                  <div className="flex items-baseline justify-between">
                    <span className="text-primary text-xl font-bold">
                      {payment.price.toLocaleString()}원
                    </span>
                    <Badge variant="secondary">
                      <Calendar className="mr-1 h-3 w-3" />
                      {formatDate(payment.approvedAt)}
                    </Badge>
                  </div>

                  <div className="bg-muted/50 rounded-lg border p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-muted-foreground text-xs font-semibold">메모</p>
                      {isEditingMemo === idx ? (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSaveMemo(payment.paymentKey)}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setIsEditingMemo(null)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setIsEditingMemo(idx);
                            setEditMemoText(payment.memo || "");
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {isEditingMemo === idx ? (
                      <Textarea
                        value={editMemoText}
                        onChange={(e) => setEditMemoText(e.target.value)}
                        rows={3}
                        className="text-sm"
                        maxLength={MEMO_MAX_LENGTH}
                      />
                    ) : (
                      <p className="text-sm">{payment.memo || "메모가 없습니다."}</p>
                    )}
                  </div>

                  <Badge
                    className={`w-full justify-center ${getPaymentStatusVariant(payment.paymentStatus)}`}
                  >
                    {getPaymentStatusText(payment.paymentStatus)}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
