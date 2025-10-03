"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff } from "lucide-react";
import Logo from "@/components/logo";
import { validateEmail, validatePassword } from "@/lib/validation/auth";
import { setAccessToken, authorizedFetch } from "@/lib/api";
import { useLoginStore } from "@/store/useLoginStore";

export default function LoginPage() {
  const router = useRouter();
  type LoginForm = { email: string; password: string };

  const [formData, setFormData] = useState<LoginForm>({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState<LoginForm>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const setMember = useLoginStore((s) => s.setMember);

  const validateAll = (state: LoginForm): LoginForm => ({
    email: validateEmail(state.email),
    password: validatePassword(state.password),
  });

  const isValid = Object.values(fieldErrors).every((v) => !v);

  const handleInputChange = (field: keyof LoginForm, value: string) => {
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
      const resp = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: formData.email.trim(), password: formData.password }),
      });

      if (resp.status === 401) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
        return;
      }
      if (!resp.ok) {
        setError("로그인 중 오류가 발생했습니다.");
        return;
      }

      const authHeader = resp.headers.get("Authorization");
      const token = authHeader?.split(" ")[1] || authHeader || "";
      if (!token) throw new Error("로그인 중 오류가 발생했습니다.");
      setAccessToken(token);

      const meResp = await authorizedFetch("http://localhost:8080/api/v1/auth/me");
      if (!meResp.ok) throw new Error("프로필 조회 중 오류가 발생했습니다.");
      const me = await meResp.json();
      setMember({ email: me.email, nickname: me.nickname, role: me.role });
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <Logo />
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-foreground mb-2 text-3xl font-bold">로그인</h1>
          <p className="text-muted-foreground">계정에 로그인하여 서비스를 이용하세요</p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl">환영합니다</CardTitle>
            <CardDescription className="text-center">
              이메일과 비밀번호를 입력해주세요
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
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-input border-border"
                />
                {fieldErrors.email && (
                  <p className="text-destructive mt-1 text-sm">{fieldErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
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

              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 w-full"
                disabled={!isValid || isLoading}
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </Button>
            </form>

            <div className="mt-6 space-y-4 text-center text-sm">
              <div className="flex justify-between">
                <Link href="/auth/find-id" className="text-primary hover:text-primary/80">
                  아이디 찾기
                </Link>
                <Link href="/auth/find-password" className="text-primary hover:text-primary/80">
                  비밀번호 찾기
                </Link>
              </div>
              <div>
                계정이 없으신가요?{" "}
                <Link
                  href="/auth/signup"
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  회원가입
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
