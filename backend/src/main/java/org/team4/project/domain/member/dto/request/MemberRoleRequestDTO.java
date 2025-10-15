package org.team4.project.domain.member.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class MemberRoleRequestDTO {

    @Schema(description = "설정할 역할 (CLIENT 또는 FREELANCER)", example = "CLIENT")
    @NotBlank(message = "역할(Role)은 필수 입력입니다.")
    @Pattern(regexp = "CLIENT|FREELANCER", message = "역할은 CLIENT, FREELANCER 중 하나여야 합니다.")
    private String role;
}
