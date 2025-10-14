package org.team4.project.domain.member.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class EmailVerificationConfirmRequestDTO {

    @NotBlank(message = "이메일은 필수 입력입니다.")
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    private String email;

    @NotBlank(message = "인증코드를 입력해 주세요.")
    @Size(min = 6, max = 6, message = "인증코드는 6자리여야 합니다.")
    private String code;
}
