package org.team4.project.domain.chat.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.team4.project.domain.activeService.service.ActiveServiceService;
import org.team4.project.domain.chat.dto.MessageRequest;
import org.team4.project.domain.chat.entity.ChatMessage;
import org.team4.project.domain.chat.entity.ChatRoom;
import org.team4.project.domain.chat.repository.ChatMessageRepository;
import org.team4.project.domain.member.entity.Member;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ActiveServiceService activeServiceService;


    public ChatMessage saveMessage(ChatRoom room, Member member, String content) {
        ChatMessage message = ChatMessage.builder()
                .room(room)
                .member(member)
                .content(content)
                .messageType(ChatMessage.MessageType.TALK)
                .build();
        return chatMessageRepository.save(message);
    }

    public ChatMessage savePaymentRequest(ChatRoom room, Member member, MessageRequest messageRequest) {
        ChatMessage message = ChatMessage.builder()
                .room(room)
                .member(member)
                .content(messageRequest.getContent())
                .messageType(ChatMessage.MessageType.PAYMENT_REQUEST)
                .amount(messageRequest.getAmount())
                .memo(messageRequest.getMemo())
                .serviceId(messageRequest.getServiceId())
                .build();
        return chatMessageRepository.save(message);
    }

    public ChatMessage saveMeetingRequest(ChatRoom room, Member member, MessageRequest messageRequest) {
        ChatMessage message = ChatMessage.builder()
                .room(room)
                .member(member)
                .content(messageRequest.getContent())
                .messageType(ChatMessage.MessageType.MEETING_REQUEST)
                .memo(messageRequest.getMemo())
                .build();
        return chatMessageRepository.save(message);
    }

    public List<ChatMessage> getMessages(Long roomId) {
        return chatMessageRepository.findByRoomIdOrderByCreatedAtAsc(roomId);
    }

    public ChatMessage saveWorkCompleteRequest(ChatRoom room, Member member, MessageRequest messageRequest) {
        ChatMessage message = ChatMessage.builder()
                .room(room)
                .member(member)
                .content("작업이 완료되었습니다. 확인 요청드립니다!")
                .messageType(ChatMessage.MessageType.WORK_COMPLETE_REQUEST)
                .serviceId(messageRequest.getServiceId())
                .build();
        return chatMessageRepository.save(message);
    }

    @Transactional
    public ChatMessage confirmWorkComplete(ChatRoom room, Member member, Long serviceId) {
        // ActiveService의 상태 변경 로직을 ActiveServiceService를 통해 호출
        activeServiceService.updateActiveServiceStatus(serviceId, member.getEmail());

        ChatMessage message = ChatMessage.builder()
                .room(room)
                .member(null) // 시스템 메시지
                .content("작업이 최종 완료되었습니다.")
                .messageType(ChatMessage.MessageType.WORK_CONFIRMED)
                .build();
        return chatMessageRepository.save(message);
    }
}