package org.team4.project.domain.member.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class MemberRoleRequestDTO {

    @NotBlank(message = "역할(Role)은 필수 입력입니다.")
    @Pattern(regexp = "CLIENT|FREELANCER", message = "역할은 CLIENT, FREELANCER 중 하나여야 합니다.")
    String role;
}
