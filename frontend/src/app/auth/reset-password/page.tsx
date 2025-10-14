"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Eye, EyeOff, CheckCircle } from "lucide-react";
import { validatePassword } from "@/lib/validation/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    token: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (!email || !token) {
      setError("잘못된 접근입니다. 이메일 링크를 통해 접근해주세요.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      email,
      token,
    }));
  }, [searchParams]);

  const validateAll = (state: typeof formData) => {
    const errors = {
      password: validatePassword(state.password),
      confirmPassword: "",
    };

    if (state.password && state.confirmPassword && state.password !== state.confirmPassword) {
      errors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    return errors;
  };

  const isValid =
    Object.values(fieldErrors).every((v) => !v) &&
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword;

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      setFieldErrors(validateAll(next));
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const latestErrors = validateAll(formData);
    setFieldErrors(latestErrors);
    if (Object.values(latestErrors).some(Boolean)) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/v1/auth/reset-password/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          token: formData.token,
          password: formData.password,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || "비밀번호 재설정 중 오류가 발생했습니다.";
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
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl">비밀번호 재설정 완료</CardTitle>
              <CardDescription>비밀번호가 성공적으로 재설정되었습니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-muted-foreground text-center text-sm">
                새로운 비밀번호로 로그인해주세요.
              </div>
              <Button asChild className="w-full">
                <Link href="/auth/login">로그인하기</Link>
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
          <h1 className="text-foreground mb-2 text-3xl font-bold">비밀번호 재설정</h1>
          <p className="text-muted-foreground">새로운 비밀번호를 입력해주세요</p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl">새 비밀번호</CardTitle>
            <CardDescription className="text-center">
              안전한 비밀번호로 변경해주세요
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
                <Label htmlFor="password">새 비밀번호</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="새 비밀번호를 입력하세요"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="bg-input border-border pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {fieldErrors.password && (
                  <p className="text-destructive mt-1 text-sm">{fieldErrors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="비밀번호를 다시 입력하세요"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="bg-input border-border pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="text-destructive mt-1 text-sm">{fieldErrors.confirmPassword}</p>
                )}
              </div>

              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 w-full"
                disabled={!isValid || isLoading}
              >
                {isLoading ? "재설정 중..." : "비밀번호 재설정"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
