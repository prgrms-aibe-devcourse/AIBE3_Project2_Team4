//package org.team4.project.global.init;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.ApplicationRunner;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.context.annotation.Lazy;
//
//@Configuration
//public class BaseInitRunner {
//    @Autowired
//    @Lazy
//    BaseInitRunner self;
//
//    @Bean
//    public ApplicationRunner init(){
//        return args -> {
//            //self.work1();
//        };
//    }
//
//    @Transactional
//    public void work1() {
//        if (memberRepository.findByEmail("qweqweqwe@gmail.com").isPresent()) return ;
//        if (tagRepository.findByName(TagType.BACKEND).isEmpty()) return;
//
//        MemberSignUpRequestDTO memberSignUpRequestDTO = new MemberSignUpRequestDTO();
//        memberSignUpRequestDTO.setEmail("qweqweqwe@gmail.com");
//        memberSignUpRequestDTO.setPassword("qweqweqwe");
//        memberSignUpRequestDTO.setNickname("qweqweqwe");
//        memberSignUpRequestDTO.setRole("FREELANCER");
//        memberService.signUp(memberSignUpRequestDTO);
//
//        Member freelancer = memberRepository.findByEmail(memberSignUpRequestDTO.getEmail()).get();
////
////        ServiceCreateRqBody scr1 = new ServiceCreateRqBody("서비스1", "서비스1의 내용입니다.", 36000, new ArrayList<>(List.of(TagType.BACKEND)));
////        ServiceCreateRqBody scr2 = new ServiceCreateRqBody("서비스2", "서비스2의 내용입니다.", 40000, new ArrayList<>(List.of(TagType.BACKEND)));
////        ServiceCreateRqBody scr3 = new ServiceCreateRqBody("서비스3", "서비스3의 내용입니다.", 3000, new ArrayList<>(List.of(TagType.BACKEND)));
//
//        //serviceService.createService(scr1, freelancer);
//        //serviceService.createService(scr2, freelancer);
//        //serviceService.createService(scr3, freelancer);
//
//        };
//    }
//}
