package org.team4.project.domain.member.dto.request;

import lombok.Data;

@Data
public class LoginRequestDTO {
    private String email;
    private String password;
}
