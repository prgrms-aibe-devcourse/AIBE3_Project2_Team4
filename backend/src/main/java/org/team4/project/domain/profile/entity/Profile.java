package org.team4.project.domain.profile.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.team4.project.domain.member.entity.Member;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Inheritance(strategy = InheritanceType.JOINED) // 조인 전략 사용
@DiscriminatorColumn(name = "PROFILE_TYPE") // 타입 구분 컬럼 생성
public abstract class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    // 공통 필드
    private String nickname;
    private String introduction;
    private double averageRating = 0.0;

    public void updateProfile(String nickname, String introduction) {
        this.nickname = nickname;
        this.introduction = introduction;
    }

    public void setMember(Member member) {
        this.member = member;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }
}
