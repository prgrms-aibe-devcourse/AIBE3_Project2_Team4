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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 실제 비밀번호 재설정 로직 구현
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 임시 딜레이
      setIsSuccess(true);
    } catch (err) {
      setError("등록된 이메일을 찾을 수 없습니다.");
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

            <div className="text-muted-foreground mt-6 text-center text-sm">
              아이디를 잊으셨나요?{" "}
              <Link
                href="/auth/find-id"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                아이디 찾기
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
