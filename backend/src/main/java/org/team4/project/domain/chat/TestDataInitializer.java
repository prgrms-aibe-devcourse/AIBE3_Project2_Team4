package org.team4.project.domain.chat;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.member.entity.MemberRole;
import org.team4.project.domain.member.repository.MemberRepository;

@Profile("local") // "local" 프로필이 활성화될 때만 실행됩니다.
@Component      // 이 클래스를 스프링이 관리하는 부품으로 등록합니다.
@RequiredArgsConstructor
public class TestDataInitializer implements CommandLineRunner {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // 1. 기존 회원 데이터 모두 삭제
        memberRepository.deleteAll();

        // 2. 새로운 테스트용 회원 2명 생성 및 저장
        Member user1 = Member.builder()
                .email("user1@test.com")
                .nickname("User1")
                .password(passwordEncoder.encode("testtest"))
                .memberRole(MemberRole.CLIENT)
                .build();

        Member user2 = Member.builder()
                .email("user2@test.com")
                .nickname("User2")
                .password(passwordEncoder.encode("testtest"))
                .memberRole(MemberRole.FREELANCER)
                .build();

        memberRepository.save(user1);
        memberRepository.save(user2);

        System.out.println("==========================================");
        System.out.println("테스트 유저(user1, user2) 생성을 완료했습니다.");
        System.out.println("==========================================");
    }
}