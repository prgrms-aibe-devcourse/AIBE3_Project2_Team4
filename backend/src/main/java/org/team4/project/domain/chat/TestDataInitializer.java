//package org.team4.project.domain.chat;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.context.annotation.Profile;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Component;
//import org.team4.project.domain.chat.entity.ChatRoom;
//import org.team4.project.domain.chat.repository.ChatMessageRepository;
//import org.team4.project.domain.chat.repository.ChatRoomRepository;
//import org.team4.project.domain.member.entity.Member;
//import org.team4.project.domain.member.entity.MemberRole;
//import org.team4.project.domain.member.repository.MemberRepository;
//import org.team4.project.domain.service.dto.ServiceCreateRqBody;
//import org.team4.project.domain.service.entity.category.Category;
//import org.team4.project.domain.service.entity.category.Tag;
//import org.team4.project.domain.service.entity.category.type.CategoryType;
//import org.team4.project.domain.service.entity.category.type.TagType;
//import org.team4.project.domain.service.repository.CategoryRepository;
//import org.team4.project.domain.service.repository.ServiceRepository;
//import org.team4.project.domain.service.repository.TagRepository;
//import org.team4.project.domain.service.repository.TagServiceRepository;
//import org.team4.project.domain.service.service.ServiceService;
//import org.team4.project.global.security.CustomUserDetails;
//
//import java.util.List;
//
//@Profile("local") // "local" 프로필이 활성화될 때만 실행.
//@Component
//@RequiredArgsConstructor
//public class TestDataInitializer implements CommandLineRunner {
//
//    private final MemberRepository memberRepository;
//    private final PasswordEncoder passwordEncoder;
//    private final ChatRoomRepository chatRoomRepository;
//    private final ChatMessageRepository chatMessageRepository;
//    private final ServiceService serviceService;
//    private final ServiceRepository serviceRepository;
//    private final CategoryRepository categoryRepository;
//    private final TagRepository tagRepository;
//    private final TagServiceRepository tagServiceRepository;
//
//    @Override
//    public void run(String... args) {
//        // 1. 기존 데이터 모두 삭제 (자식 -> 부모 순서로)
//        chatMessageRepository.deleteAll();
//        chatRoomRepository.deleteAll();
//        tagServiceRepository.deleteAll(); // 서비스-태그 연결 정보 먼저 삭제
//        serviceRepository.deleteAll();
//        tagRepository.deleteAll();
//        categoryRepository.deleteAll();
//        memberRepository.deleteAll();
//
//        // 2. 새로운 테스트용 회원 생성 및 저장
//        Member user1 = Member.builder()
//                .email("user1@test.com")
//                .nickname("User1")
//                .password(passwordEncoder.encode("testtest"))
//                .memberRole(MemberRole.CLIENT)
//                .build();
//
//        Member user2 = Member.builder()
//                .email("user2@test.com")
//                .nickname("User2")
//                .password(passwordEncoder.encode("testtest"))
//                .memberRole(MemberRole.FREELANCER)
//                .build();
//
//        Member user3 = Member.builder()
//                .email("user3@test.com")
//                .nickname("User3")
//                .password(passwordEncoder.encode("testtest"))
//                .memberRole(MemberRole.CLIENT)
//                .build();
//
//        memberRepository.save(user1);
//        memberRepository.save(user2);
//        memberRepository.save(user3);
//
//        System.out.println("========================================== ");
//        System.out.println("테스트 유저 생성을 완료했습니다.");
//        System.out.println("User1 ID: " + user1.getId());
//        System.out.println("User2 ID: " + user2.getId());
//        System.out.println("User3 ID: " + user3.getId());
//        System.out.println("==========================================");
//
//        // 3. user1과 user2가 참여하는 채팅방 생성
//        ChatRoom chatRoom = new ChatRoom();
//        chatRoom.setClient(user1);
//        chatRoom.setFreelancer(user2);
//        chatRoom.setName(user1.getNickname() + "님과 " + user2.getNickname() + "님의 채팅방");
//        chatRoomRepository.save(chatRoom);
//
//        System.out.println("========================================== ");
//        System.out.println("테스트 채팅방(user1, user2) 생성을 완료했습니다.");
//        System.out.println("==========================================");
//
//        // 4. 테스트용 카테고리 및 태그 생성
//        Category webDevCategory = categoryRepository.save(new Category(CategoryType.WEB_DEVELOPMENT));
//        Category designCategory = categoryRepository.save(new Category(CategoryType.UIUX_DESIGN));
//
//        tagRepository.save(new Tag(webDevCategory, TagType.BACKEND));
//        tagRepository.save(new Tag(webDevCategory, TagType.FRONTEND));
//        tagRepository.save(new Tag(designCategory, TagType.UI_DESIGN));
//        tagRepository.save(new Tag(designCategory, TagType.PROTOTYPING));
//
//        // 5. user2(프리랜서)가 제공하는 서비스 2개 생성 (ServiceService 사용)
//        CustomUserDetails user2Details = new CustomUserDetails(user2);
//
//        ServiceCreateRqBody serviceRq1 = new ServiceCreateRqBody(
//                "(테스트)백엔드 API 개발",
//                "(테스트)Spring Boot를 이용한 RESTful API 서버를 구축해 드립니다.",
//                500000,
//                List.of(TagType.BACKEND)
//        );
//        serviceService.createService(serviceRq1, user2Details);
//
//        ServiceCreateRqBody serviceRq2 = new ServiceCreateRqBody(
//                "(테스트)UI/UX 프로토타이핑",
//                "(테스트)Figma를 활용하여 사용성 높은 프로토타입을 제작합니다.",
//                300000,
//                List.of(TagType.UI_DESIGN, TagType.PROTOTYPING)
//        );
//        serviceService.createService(serviceRq2, user2Details);
//
//
//        System.out.println("========================================== ");
//        System.out.println("테스트 서비스 2개 생성을 완료했습니다.");
//        System.out.println("==========================================");
//    }
//}