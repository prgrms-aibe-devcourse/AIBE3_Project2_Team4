package org.team4.project.global.init;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.transaction.annotation.Transactional;
import org.team4.project.domain.member.dto.MemberSignUpRequestDTO;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.member.repository.MemberRepository;
import org.team4.project.domain.member.service.MemberService;
import org.team4.project.domain.service.dto.ServiceCreateRqBody;
import org.team4.project.domain.service.service.ServiceService;

@Configuration
public class BaseInitRunner {

    @Autowired
    ServiceService serviceService;

    @Autowired
    MemberService memberService;

    @Autowired
    MemberRepository memberRepository;

    @Autowired
    @Lazy
    BaseInitRunner self;

    @Bean
    public ApplicationRunner init(){
        return args -> {
            self.work1();
        };
    }

    @Transactional
    public void work1() {
        MemberSignUpRequestDTO memberSignUpRequestDTO = new MemberSignUpRequestDTO();
        memberSignUpRequestDTO.setEmail("qweqweqwe@gmail.com");
        memberSignUpRequestDTO.setPassword("qweqweqwe");
        memberSignUpRequestDTO.setNickname("qweqweqwe");
        memberSignUpRequestDTO.setRole("FREELANCER");
        memberService.signUp(memberSignUpRequestDTO);

        Member freelancer = memberRepository.findByEmail(memberSignUpRequestDTO.getEmail()).get();

        ServiceCreateRqBody scr1 = new ServiceCreateRqBody("서비스1", "서비스1의 내용입니다.", 36000);
        ServiceCreateRqBody scr2 = new ServiceCreateRqBody("서비스2", "서비스2의 내용입니다.", 40000);
        ServiceCreateRqBody scr3 = new ServiceCreateRqBody("서비스3", "서비스3의 내용입니다.", 3000);

        serviceService.createService(scr1, freelancer);
        serviceService.createService(scr2, freelancer);
        serviceService.createService(scr3, freelancer);
    }
}
