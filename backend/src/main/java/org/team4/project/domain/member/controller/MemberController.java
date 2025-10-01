package org.team4.project.domain.member.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.team4.project.domain.member.dto.MemberSignUpRequestDTO;
import org.team4.project.domain.member.service.MemberService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/register")
    public void singUp(@Valid @RequestBody MemberSignUpRequestDTO memberSignUpRequestDTO) {
        memberService.signUp(memberSignUpRequestDTO);
    }
}
