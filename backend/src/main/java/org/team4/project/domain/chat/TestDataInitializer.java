package org.team4.project.domain.chat;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.team4.project.domain.chat.entity.ChatMessage;
import org.team4.project.domain.chat.entity.ChatRoom;
import org.team4.project.domain.chat.repository.ChatMessageRepository;
import org.team4.project.domain.chat.repository.ChatRoomRepository;

@Component
@Profile("test")  // test 환경에서만 실행
@RequiredArgsConstructor
public class TestDataInitializer implements CommandLineRunner {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    public static Long testRoomId;

    @Override
    public void run(String... args) {
        // 채팅방 생성
        ChatRoom room1 = new ChatRoom();
        room1.setName("테스트방1");
        chatRoomRepository.save(room1);

        testRoomId = room1.getId();

        ChatRoom room2 = new ChatRoom();
        room2.setName("테스트방2");
        chatRoomRepository.save(room2);

        // 메시지 생성
        ChatMessage msg1 = new ChatMessage();
        msg1.setRoom(room1);
        msg1.setSender("User1");
        msg1.setContent("안녕하세요!");
        chatMessageRepository.save(msg1);

        ChatMessage msg2 = new ChatMessage();
        msg2.setRoom(room1);
        msg2.setSender("User2");
        msg2.setContent("반갑습니다!");
        chatMessageRepository.save(msg2);
    }
}