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
import org.team4.project.domain.member.exception.RegisterException;
import org.team4.project.domain.member.repository.MemberQueryRepository;
import org.team4.project.domain.member.repository.MemberRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final MemberQueryRepository memberQueryRepository;

    @Transactional
    public void signUp(MemberSignUpRequestDTO memberSignUpRequestDTO) {
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
    }

    public MemberProfileResponseDTO getProfile(String email) {
        Member member = memberRepository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("존재하지 않는 유저입니다."));
        return MemberProfileResponseDTO.of(member);
    }

    public List<PaymentHistoryResponseDTO> getPaymentHistories(String email) {
        return memberQueryRepository.getPaymentHistories(email);
    }
}
