package org.team4.project.domain.member.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.team4.project.domain.member.entity.Member;

@Data
@AllArgsConstructor
@Schema(description = "간편 프로필 DTO")
public class MemberProfileResponseDTO {
    @Schema(description = "회원 이메일", example = "user@example.com")
    private String email;

    @Schema(description = "닉네임", example = "JohnDoe")
    private String nickname;

    @Schema(description = "프로필 이미지 URL", example = "https://example.com/images/profile.png")
    private String profileImage;

    @Schema(description = "회원 역할", example = "client")
    private String role;

    public static MemberProfileResponseDTO from(Member member) {
        String role = member.getMemberRole().name().toLowerCase();
        return new MemberProfileResponseDTO(member.getEmail(), member.getNickname(), member.getProfileImageUrl(), role);
    }
}
