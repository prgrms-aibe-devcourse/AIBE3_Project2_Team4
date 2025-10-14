package org.team4.project.domain.member.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "이메일 인증 코드 확인 DTO")
public class EmailVerificationConfirmRequestDTO {

    @NotBlank(message = "이메일은 필수 입력입니다.")
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    @Schema(description = "인증 대상 이메일 주소", example = "user@example.com", required = true)
    private String email;

    @NotBlank(message = "인증코드를 입력해 주세요.")
    @Size(min = 6, max = 6, message = "인증코드는 6자리여야 합니다.")
    @Schema(description = "이메일로 받은 6자리 인증 코드", example = "123456", required = true)
    private String code;
}
