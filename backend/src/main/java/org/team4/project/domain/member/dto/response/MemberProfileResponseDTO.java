package org.team4.project.domain.member.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.team4.project.domain.member.entity.Member;

@Data
@AllArgsConstructor
public class MemberProfileResponseDTO {
    private String email;
    private String nickname;
    private String profileImage;
    private String role;

    public static MemberProfileResponseDTO from(Member member) {
        String role = member.getMemberRole().name().toLowerCase();
        return new MemberProfileResponseDTO(member.getEmail(), member.getNickname(), member.getProfileImageUrl(), role);
    }
}
