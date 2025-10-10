package org.team4.project.domain.chat;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.team4.project.domain.chat.entity.ChatMessage;
import org.team4.project.domain.chat.entity.ChatRoom;
import org.team4.project.domain.chat.repository.ChatMessageRepository;
import org.team4.project.domain.chat.repository.ChatRoomRepository;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.member.entity.MemberRole;
import org.team4.project.domain.member.repository.MemberRepository;

@Component
@RequiredArgsConstructor
public class TestDataInitializer implements CommandLineRunner {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final MemberRepository memberRepository; // Member 저장소 필요
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    public static Long testRoomId;


    @Override
    public void run(String... args) {
        // 1. 테스트용 회원 생성
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

        // 2. 채팅방 생성
        ChatRoom room1 = new ChatRoom();
        room1.setName("테스트방1");
        chatRoomRepository.save(room1);
        testRoomId = room1.getId();

        ChatRoom room2 = new ChatRoom();
        room2.setName("테스트방2");
        chatRoomRepository.save(room2);

        // 3. 메시지 생성
        ChatMessage msg1 = new ChatMessage();
        msg1.setRoom(room1);
        msg1.setMember(user1); // member로 변경
        msg1.setContent("안녕하세요!");
        chatMessageRepository.save(msg1);

        ChatMessage msg2 = new ChatMessage();
        msg2.setRoom(room1);
        msg2.setMember(user2); // member로 변경
        msg2.setContent("반갑습니다!");
        chatMessageRepository.save(msg2);
    }
}