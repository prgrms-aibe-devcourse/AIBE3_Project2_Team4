package org.team4.project.global.init;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.transaction.annotation.Transactional;
import org.team4.project.domain.activeService.repository.ActiveServiceRepository;
import org.team4.project.domain.activeService.service.ActiveServiceService;
import org.team4.project.domain.chat.service.ChatRoomService;
import org.team4.project.domain.member.dto.request.MemberSignUpRequestDTO;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.member.repository.MemberRepository;
import org.team4.project.domain.member.service.MemberService;
import org.team4.project.domain.payment.entity.Payment;
import org.team4.project.domain.payment.entity.PaymentMethod;
import org.team4.project.domain.payment.entity.PaymentStatus;
import org.team4.project.domain.payment.repository.PaymentRepository;
import org.team4.project.domain.service.dto.ServiceCreateRqBody;
import org.team4.project.domain.service.entity.category.type.TagType;
import org.team4.project.domain.service.entity.service.ProjectService;
import org.team4.project.domain.service.repository.ServiceRepository;
import org.team4.project.domain.service.repository.TagRepository;
import org.team4.project.domain.service.service.ServiceService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class MyPageInitRunner {

    @Autowired
    ServiceService serviceService;
    @Autowired
    ServiceRepository serviceRepository;

    @Autowired
    MemberService memberService;

    @Autowired
    MemberRepository memberRepository;

    @Autowired
    TagRepository tagRepository;

    @Autowired
    PaymentRepository paymentRepository;

    @Autowired
    private ActiveServiceService activeServiceService;
    @Autowired
    ActiveServiceRepository activeServiceRepository;

    @Autowired
    ChatRoomService chatRoomService;

    @Autowired
    @Lazy
    BaseInitRunner self;

    @Bean
    public ApplicationRunner initMyPageData(){
        return args -> {
            //self.work1();
            //self.work2();
            //self.work3();
            //self.work4();
        };
    }

    @Transactional
    public void work1() {
        if (memberRepository.findByEmail("qweqweqwe1@gmail.com").isPresent()) return ;
        if (tagRepository.findByName(TagType.BACKEND).isEmpty()) return;

        MemberSignUpRequestDTO memberSignUpRequestDTO1 = new MemberSignUpRequestDTO();
        memberSignUpRequestDTO1.setEmail("qweqweqwe1@gmail.com");
        memberSignUpRequestDTO1.setPassword("qweqweqwe1");
        memberSignUpRequestDTO1.setNickname("qweqweqwe1");
        memberSignUpRequestDTO1.setRole("FREELANCER");
        memberService.signUp(memberSignUpRequestDTO1);

        MemberSignUpRequestDTO memberSignUpRequestDTO2 = new MemberSignUpRequestDTO();
        memberSignUpRequestDTO2.setEmail("qweqweqwe2@gmail.com");
        memberSignUpRequestDTO2.setPassword("qweqweqwe2");
        memberSignUpRequestDTO2.setNickname("qweqweqwe2");
        memberSignUpRequestDTO2.setRole("CLIENT");
        memberService.signUp(memberSignUpRequestDTO2);

        Member freelancer = memberRepository.findByEmail(memberSignUpRequestDTO1.getEmail()).get();

        ServiceCreateRqBody scr1 = new ServiceCreateRqBody("서비스1", "서비스1의 내용입니다.", 36000, new ArrayList<>(List.of(TagType.BACKEND)));
        ServiceCreateRqBody scr2 = new ServiceCreateRqBody("서비스2", "서비스2의 내용입니다.", 40000, new ArrayList<>(List.of(TagType.BACKEND)));
        ServiceCreateRqBody scr3 = new ServiceCreateRqBody("서비스3", "서비스3의 내용입니다.", 3000, new ArrayList<>(List.of(TagType.BACKEND)));

        ///serviceService.createService(scr1, freelancer);
        ///serviceService.createService(scr2, freelancer);
        ///serviceService.createService(scr3, freelancer);


    }

    @Transactional
    void work2 () {

        if (activeServiceRepository.findById(1L).isPresent()) return ;

        Member freelancer = memberRepository.findByEmail("qweqweqwe1@gmail.com").get();
        Member client = memberRepository.findByEmail("qweqweqwe2@gmail.com").get();

        ProjectService ps1 = serviceRepository.findById(1L).get();

        Payment payment1 = new Payment(
                "qweqweqweqweqweqwe1",
                client,
                ps1,
                "qweqweqweqweqweqwe11",
                360000,
                PaymentStatus.DONE,
                LocalDateTime.now(),
                PaymentMethod.BANK_TRANSFER,
                LocalDateTime.now(),
                "메모입니다1111111111111"
        );

        paymentRepository.save(payment1);

        Payment payment2 = new Payment(
                "qweqweqweqweqweqwe2",
                client,
                ps1,
                "qweqweqweqweqweqwe12",
                360000,
                PaymentStatus.DONE,
                LocalDateTime.now(),
                PaymentMethod.BANK_TRANSFER,
                LocalDateTime.now(),
                "메모입니다222222222222"
        );

        paymentRepository.save(payment2);


        activeServiceService.createActiveService("qweqweqweqweqweqwe1");
        activeServiceService.createActiveService("qweqweqweqweqweqwe2");

    }

    @Transactional
    void work3() {
        MemberSignUpRequestDTO memberSignUpRequestDTO3 = new MemberSignUpRequestDTO();
        memberSignUpRequestDTO3.setEmail("qweqweqwe3@gmail.com");
        memberSignUpRequestDTO3.setPassword("qweqweqwe3");
        memberSignUpRequestDTO3.setNickname("qweqweqwe3");
        memberSignUpRequestDTO3.setRole("FREELANCER");
        memberService.signUp(memberSignUpRequestDTO3);

        MemberSignUpRequestDTO memberSignUpRequestDTO4 = new MemberSignUpRequestDTO();
        memberSignUpRequestDTO4.setEmail("qweqweqwe4@gmail.com");
        memberSignUpRequestDTO4.setPassword("qweqweqwe4");
        memberSignUpRequestDTO4.setNickname("qweqweqwe4");
        memberSignUpRequestDTO4.setRole("FREELANCER");
        memberService.signUp(memberSignUpRequestDTO4);

        MemberSignUpRequestDTO memberSignUpRequestDTO5 = new MemberSignUpRequestDTO();
        memberSignUpRequestDTO5.setEmail("qweqweqwe5@gmail.com");
        memberSignUpRequestDTO5.setPassword("qweqweqwe5");
        memberSignUpRequestDTO5.setNickname("qweqweqwe5");
        memberSignUpRequestDTO5.setRole("CLIENT");
        memberService.signUp(memberSignUpRequestDTO5);
    }

    @Transactional
    void work4() {
        Member freelancer1 = memberRepository.findByEmail("qweqweqwe1@gmail.com").get();
        Member freelancer3 = memberRepository.findByEmail("qweqweqwe3@gmail.com").get();
        Member freelancer4 = memberRepository.findByEmail("qweqweqwe4@gmail.com").get();


        Member client2 = memberRepository.findByEmail("qweqweqwe2@gmail.com").get();
        Member client5 = memberRepository.findByEmail("qweqweqwe5@gmail.com").get();


        chatRoomService.findOrCreateRoom(client2, 1L);
        chatRoomService.findOrCreateRoom(client5, 1L);
        chatRoomService.findOrCreateRoom(client2, 252L);
    }
}
