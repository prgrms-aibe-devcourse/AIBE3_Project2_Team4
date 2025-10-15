package org.team4.project.domain.member.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "이메일 인증 코드 요청 DTO")
public class EmailVerificationRequestDTO {

    @NotBlank(message = "이메일은 필수 입력입니다.")
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    @Schema(description = "인증 코드를 받을 이메일 주소", example = "user@example.com", required = true)
    private String email;
}
