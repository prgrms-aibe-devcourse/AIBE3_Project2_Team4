export type FieldKey = "email" | "password" | "confirmPassword" | "nickname";
export type FieldErrors = Partial<Record<FieldKey, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(emailRaw: string): string {
  const email = emailRaw.trim();
  if (!email) return "이메일은 필수 입력입니다.";
  if (!EMAIL_REGEX.test(email)) return "이메일 형식이 올바르지 않습니다.";
  return "";
}

export function validatePassword(password: string): string {
  if (!password) return "비밀번호는 필수 입력입니다.";
  if (password.length < 8 || password.length > 20) {
    return "비밀번호는 8자 이상 20자 이하여야 합니다.";
  }
  return "";
}

export function validateConfirmPassword(password: string, confirmPassword: string): string {
  if (!confirmPassword) return "비밀번호 확인은 필수 입력입니다.";
  if (password !== confirmPassword) return "비밀번호가 일치하지 않습니다.";
  return "";
}

export function validateNickname(nicknameRaw: string): string {
  const nickname = nicknameRaw.trim();
  if (!nickname) return "닉네임은 필수 입력입니다.";
  if (nickname.length < 2 || nickname.length > 20) return "닉네임은 2자 이상 20자 이하여야 합니다.";
  return "";
}
