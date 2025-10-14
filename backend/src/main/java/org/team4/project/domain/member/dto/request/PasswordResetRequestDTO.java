package org.team4.project.domain.member.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;


@Data
@Schema(description = "비밀번호 재설정 요청 DTO")
public class PasswordResetRequestDTO {

    @Schema(description = "비밀번호 재설정을 요청할 회원 이메일", example = "user@example.com", required = true)
    @NotBlank(message = "이메일은 필수 입력입니다.")
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    private String email;
}
