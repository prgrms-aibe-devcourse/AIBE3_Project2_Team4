package org.team4.project.domain.member.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.team4.project.global.jpa.entity.BaseEntity;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Member extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    @Column(unique = true, nullable = false)
    private String nickname;

    @Enumerated(EnumType.STRING)
    private MemberRole memberRole;

    @Enumerated(EnumType.STRING)
    private Provider provider;

    public void setProvider(String provider) {
        this.provider = Provider.valueOf(provider);
    }

    public void setMemberRole(String role) {
        this.memberRole = MemberRole.valueOf(role.toUpperCase());
    }
}
