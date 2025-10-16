package org.team4.project.global.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.team4.project.domain.member.entity.Member;

import java.util.Collection;
import java.util.List;
import java.util.Map;

public class CustomOAuth2User implements OAuth2User {

    private final Member member;

    public CustomOAuth2User(Member member) {
        this.member = member;
    }

    public String getEmail() {
        return member.getEmail();
    }

    public String getRole() {
        return member.getMemberRole().name();
    }

    public Long getMemberId() {
        return member.getId();
    }

    @Override
    public Map<String, Object> getAttributes() {
        return Map.of("email", member.getEmail());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + member.getMemberRole().name()));
    }

    @Override
    public String getName() {
        return member.getEmail();
    }
}
