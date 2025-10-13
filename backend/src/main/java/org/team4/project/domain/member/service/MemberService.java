package org.team4.project.domain.member.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.team4.project.domain.member.dto.MemberProfileResponseDTO;
import org.team4.project.domain.member.dto.MemberSignUpRequestDTO;
import org.team4.project.domain.member.dto.PaymentHistoryResponseDTO;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.member.entity.MemberRole;
import org.team4.project.domain.member.entity.Provider;
import org.team4.project.domain.member.exception.RegisterException;
import org.team4.project.domain.member.repository.MemberQueryRepository;
import org.team4.project.domain.member.repository.MemberRepository;
import org.team4.project.global.redis.RedisKeys;
import org.team4.project.global.redis.RedisRepository;

import java.time.Duration;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final MemberQueryRepository memberQueryRepository;
    private final RedisRepository redisRepository;

    @Transactional
    public void signUp(MemberSignUpRequestDTO memberSignUpRequestDTO) {
        if (!isSignupVerified(memberSignUpRequestDTO.getEmail())) {
            throw new RegisterException("인증되지 않은 이메일 입니다.");
        }

        if (memberRepository.existsByEmail(memberSignUpRequestDTO.getEmail())) {
            throw new RegisterException("이미 사용중인 이메일 입니다.");
        }

        if (memberRepository.existsByNickname(memberSignUpRequestDTO.getNickname())) {
            throw new RegisterException("이미 사용중인 닉네임 입니다.");
        }

        memberSignUpRequestDTO.setPassword(passwordEncoder.encode(memberSignUpRequestDTO.getPassword()));

        try {
            memberRepository.save(memberSignUpRequestDTO.toEntity());
        } catch (DataIntegrityViolationException e) {
            throw new RegisterException("이미 사용중인 이메일 또는 닉네임 입니다.");
        }

        redisRepository.deleteValue(RedisKeys.signupVerified(memberSignUpRequestDTO.getEmail()));
    }

    public int generateEmailVerificationCode(String email) {
        // 6자리 난수 (100000 ~ 999999)
        int code = new Random().nextInt(900000) + 100000;

        redisRepository.setValue(
                RedisKeys.signupCode(email),
                String.valueOf(code),
                Duration.ofMinutes(5)
        );

        return code;
    }

    public void verifyEmailCode(String email, int code) {
        String storedCode = redisRepository.getValue(RedisKeys.signupCode(email));

        if (storedCode == null) {
            throw new RegisterException("인증 코드가 만료되었거나 존재하지 않습니다.");
        }

        if (!storedCode.equals(String.valueOf(code))) {
            throw new RegisterException("인증 코드가 올바르지 않습니다.");
        }

        redisRepository.deleteValue(RedisKeys.signupCode(email));
        redisRepository.setValue(
                RedisKeys.signupVerified(email),
                "true",
                Duration.ofMinutes(10)
        );
    }

    private boolean isSignupVerified(String email) {
        return "true".equals(redisRepository.getValue(RedisKeys.signupVerified(email)));
    }

    public MemberProfileResponseDTO getProfile(String email) {
        Member member = memberRepository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("존재하지 않는 유저입니다."));
        return MemberProfileResponseDTO.from(member);
    }

    @Transactional
    public Member oauthRegister(String email, String registrationId) {
        Member member;
        if(memberRepository.existsByEmail(email)) {
            member = memberRepository.findByEmail(email).get();
            member.setProvider(registrationId);
        } else {
            member = Member.builder()
                    .email(email)
                    .password(null)
                    .memberRole(MemberRole.UNASSIGNED)
                    .nickname(generateRandomNickname(registrationId))
                    .provider(Provider.valueOf(registrationId))
                    .build();

            memberRepository.save(member);
        }
        return member;
    }

    @Transactional
    public MemberProfileResponseDTO setRole(String email, String role) {
        Member member = memberRepository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("존재하지 않는 유저입니다."));
        member.setMemberRole(role);
        return MemberProfileResponseDTO.from(member);
    }

    private String generateRandomNickname(String registrationId) {
        String nickname;

        do {
            String uuidPart = UUID.randomUUID()
                    .toString()
                    .replace("-", "")
                    .substring(0, 10);

            nickname = registrationId + uuidPart;
        } while (memberRepository.existsByNickname(nickname));

        return nickname;
    }

    public List<PaymentHistoryResponseDTO> getPaymentHistories(String email) {
        return memberQueryRepository.getPaymentHistories(email);
    }

    public Boolean checkNickname(String nickname) {
        return !memberRepository.existsByNickname(nickname);
    }
}
