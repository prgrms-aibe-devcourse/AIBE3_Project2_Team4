package org.team4.project.domain.member.dto;

import lombok.Data;

@Data
public class EmailVerificationConfirmRequestDTO {
    private String email;
    private int code;
}
