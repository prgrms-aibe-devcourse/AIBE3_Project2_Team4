"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Mail } from "lucide-react";

export default function FindPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${baseUrl}/api/v1/auth/reset-password/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (response.ok) {
        const message = await response.text();
        setError(message);
        setIsSuccess(true);
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || "비밀번호 재설정 요청 중 오류가 발생했습니다.";
        setError(errorMessage);
      }
    } catch (err) {
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <Mail className="text-primary h-6 w-6" />
              </div>
              <CardTitle className="text-2xl">이메일을 확인하세요</CardTitle>
              <CardDescription>
                입력하신 이메일로 비밀번호 재설정 링크를 발송했습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-muted-foreground text-center text-sm">
                이메일이 도착하지 않았다면 스팸 폴더를 확인해주세요.
              </div>
              <Button asChild className="w-full">
                <Link href="/auth/login">로그인으로 돌아가기</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Button variant="ghost" asChild className="h-auto p-0">
            <Link
              href="/auth/login"
              className="text-muted-foreground hover:text-foreground flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              로그인으로 돌아가기
            </Link>
          </Button>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-foreground mb-2 text-3xl font-bold">비밀번호 찾기</h1>
          <p className="text-muted-foreground">가입 시 사용한 이메일을 입력해주세요</p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl">이메일 입력</CardTitle>
            <CardDescription className="text-center">
              등록된 이메일로 비밀번호 재설정 링크를 보내드립니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-input border-border"
                />
              </div>

              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 w-full"
                disabled={isLoading}
              >
                {isLoading ? "전송 중..." : "비밀번호 재설정"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
