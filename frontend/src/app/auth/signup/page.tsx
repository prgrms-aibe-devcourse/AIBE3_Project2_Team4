"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FieldErrors } from "@/lib/validation/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Eye, EyeOff, User, Building } from "lucide-react";
import Logo from "@/components/logo";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateNickname,
} from "@/lib/validation/auth";

export default function SignupPage() {
  const router = useRouter();
  type SignupForm = {
    nickname: string;
    email: string;
    password: string;
    confirmPassword: string;
    userType: "client" | "freelancer";
  };

  const [formData, setFormData] = useState<SignupForm>({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "freelancer",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameAvailable, setNicknameAvailable] = useState<boolean | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const validateAll = (state: typeof formData): FieldErrors => ({
    email: validateEmail(state.email),
    password: validatePassword(state.password),
    confirmPassword: validateConfirmPassword(state.password, state.confirmPassword),
    nickname: validateNickname(state.nickname),
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>(() =>
    validateAll({
      email: "",
      password: "",
      confirmPassword: "",
      nickname: "",
      userType: "freelancer",
    }),
  );

  const isValid = Object.values(fieldErrors).every((v) => !v);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // 제출 시 최종 검증 (한 번 더 동기화)
    const latestErrors = validateAll(formData);
    setFieldErrors(latestErrors);
    const latestValid = Object.values(latestErrors).every((v) => !v);
    if (!latestValid) {
      setIsLoading(false);
      return;
    }

    if (!nicknameChecked || nicknameAvailable === false) {
      setError("닉네임 중복 확인이 필요합니다.");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        email: formData.email.trim(),
        password: formData.password,
        nickname: formData.nickname.trim(),
        role: formData.userType === "client" ? "CLIENT" : "FREELANCER",
      };

      const response = await fetch(`${baseUrl}/api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // 서버가 표준 에러 응답을 JSON으로 내려주는 경우 처리
        let message = "회원가입 중 오류가 발생했습니다.";
        try {
          const data = await response.json();
          // 가능한 필드들에서 메시지 추출 (message, error, errors[0].defaultMessage 등)
          if (data?.message) message = data.message;
          else if (data?.error) message = data.error;
          else if (Array.isArray(data?.errors) && data.errors.length > 0) {
            message = data.errors[0]?.defaultMessage || data.errors[0]?.message || message;
          }
        } catch (_) {
          // json 파싱 실패 시 기본 메시지 유지
        }
        throw new Error(message);
      }

      // 성공 시 로그인 페이지로 리다이렉트 (클라이언트 라우팅)
      router.replace("/auth/login");
    } catch (err) {
      const message = err instanceof Error ? err.message : "회원가입 중 오류가 발생했습니다.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      const nextErrors = validateAll(next);
      setFieldErrors(nextErrors);
      return next;
    });
  };

  const checkNickname = async () => {
    if (!formData.nickname.trim()) return;

    try {
      const response = await fetch(
        `${baseUrl}/api/v1/auth/check-nickname?nickname=${formData.nickname.trim()}`,
      );
      const available = await response.json(); // true / false 반환
      setNicknameAvailable(available);
      setNicknameChecked(true);

      if (available) {
        setError("");
      }
    } catch (err) {
      console.error(err);
      setNicknameAvailable(false);
      setNicknameChecked(true);
    }
  };

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <Logo />

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-foreground mb-2 text-3xl font-bold">회원가입</h1>
          <p className="text-muted-foreground">새 계정을 만들어 서비스를 시작하세요</p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl">계정 만들기</CardTitle>
            <CardDescription className="text-center">필요한 정보를 입력해주세요</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* 사용자 타입 선택 */}
              <div className="space-y-3">
                <Label>계정 유형</Label>
                <RadioGroup
                  value={formData.userType}
                  onValueChange={(value) => handleInputChange("userType", value)}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="freelancer" id="freelancer" />
                    <Label
                      htmlFor="freelancer"
                      className="flex cursor-pointer items-center space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <span>프리랜서</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="client" id="client" />
                    <Label htmlFor="client" className="flex cursor-pointer items-center space-x-2">
                      <Building className="h-4 w-4" />
                      <span>클라이언트</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nickname">닉네임</Label>
                <div className="flex">
                  <Input
                    id="nickname"
                    type="text"
                    placeholder="닉네임을 입력하세요"
                    value={formData.nickname}
                    onChange={(e) => {
                      handleInputChange("nickname", e.target.value);
                      // 입력이 바뀌면 중복 확인 초기화
                      setNicknameChecked(false);
                      setNicknameAvailable(null);
                    }}
                    className="bg-input border-border flex-1"
                  />
                  <Button type="button" onClick={checkNickname} className="ml-2">
                    중복 확인
                  </Button>
                </div>
                {fieldErrors.nickname && (
                  <p className="text-destructive mt-1 text-sm">{fieldErrors.nickname}</p>
                )}
                {nicknameChecked && nicknameAvailable !== null && (
                  <p
                    className={`mt-1 text-sm ${nicknameAvailable ? "text-green-500" : "text-red-500"}`}
                  >
                    {nicknameAvailable
                      ? "사용 가능한 닉네임입니다."
                      : "이미 사용중인 닉네임입니다."}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-input border-border"
                  autoComplete="email"
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
                    placeholder="8자 이상 입력하세요"
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
                    {showPassword ? (
                      <EyeOff className="text-muted-foreground h-4 w-4" />
                    ) : (
                      <Eye className="text-muted-foreground h-4 w-4" />
                    )}
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
                      <EyeOff className="text-muted-foreground h-4 w-4" />
                    ) : (
                      <Eye className="text-muted-foreground h-4 w-4" />
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
                {isLoading ? "가입 중..." : "회원가입"}
              </Button>
            </form>

            <div className="text-muted-foreground mt-6 text-center text-sm">
              이미 계정이 있으신가요?{" "}
              <Link
                href="/auth/login"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                로그인
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
