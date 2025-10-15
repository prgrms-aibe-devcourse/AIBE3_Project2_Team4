package org.team4.project.domain.member.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "비밀번호 재설정 검증 및 반영 DTO")
public class PasswordResetConfirmRequestDTO {

    @Schema(description = "비밀번호 재설정을 요청한 회원 이메일", example = "user@example.com")
    private String email;

    @Schema(description = "이메일로 받은 재설정 토큰", example = "550e8400-e29b-41d4-a716-446655440000")
    private String token;

    @Schema(description = "새로운 비밀번호 (8~20자)", example = "newPassword123", required = true)
    @NotBlank(message = "비밀번호는 필수 입력입니다.")
    @Size(min = 8, max = 20, message = "비밀번호는 8자 이상 20자 이하로 입력해야 합니다.")
    private String password;
}
