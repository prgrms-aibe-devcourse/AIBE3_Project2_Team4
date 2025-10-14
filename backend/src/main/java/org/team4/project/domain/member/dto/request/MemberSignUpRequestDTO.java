package org.team4.project.domain.member.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.member.entity.MemberRole;

@Data
public class MemberSignUpRequestDTO {

    @NotBlank(message = "이메일은 필수 입력입니다.")
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    private String email;

    @NotBlank(message = "비밀번호는 필수 입력입니다.")
    @Size(min = 8, max = 20, message = "비밀번호는 8자 이상 20자 이하로 입력해야 합니다.")
    private String password;

    @NotBlank(message = "닉네임은 필수 입력입니다.")
    @Size(min = 2, max = 20, message = "닉네임은 최대 20자까지 입력할 수 있습니다.")
    private String nickname;

    @NotBlank(message = "역할(Role)은 필수 입력입니다.")
    @Pattern(regexp = "CLIENT|FREELANCER", message = "역할은 CLIENT, FREELANCER 중 하나여야 합니다.")
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
