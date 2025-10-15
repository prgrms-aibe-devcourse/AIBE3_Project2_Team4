package org.team4.project.domain.member.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.member.entity.MemberRole;

@Data
@Schema(description = "회원가입 요청 DTO")
public class MemberSignUpRequestDTO {

    @NotBlank(message = "이메일은 필수 입력입니다.")
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    @Schema(description = "회원 이메일", example = "user@example.com", required = true)
    private String email;

    @NotBlank(message = "비밀번호는 필수 입력입니다.")
    @Size(min = 8, max = 20, message = "비밀번호는 8자 이상 20자 이하로 입력해야 합니다.")
    @Schema(description = "회원 비밀번호 (8~20자)", example = "password123", required = true)
    private String password;

    @NotBlank(message = "닉네임은 필수 입력입니다.")
    @Size(min = 2, max = 20, message = "닉네임은 최대 20자까지 입력할 수 있습니다.")
    @Schema(description = "닉네임", example = "JohnDoe", required = true)
    private String nickname;

    @NotBlank(message = "역할(Role)은 필수 입력입니다.")
    @Pattern(regexp = "CLIENT|FREELANCER", message = "역할은 CLIENT, FREELANCER 중 하나여야 합니다.")
    @Schema(description = "회원 역할: CLIENT 또는 FREELANCER", example = "CLIENT", required = true)
    private String role;

    public Member toEntity() {
        return Member.builder()
                .email(email)
                .password(password)
                .nickname(nickname)
                .memberRole(MemberRole.valueOf(role))
                .build();
    }
}
