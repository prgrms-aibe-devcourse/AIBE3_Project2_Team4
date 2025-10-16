package org.team4.project.domain.chat.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.team4.project.domain.chat.dto.MessageRequest;
import org.team4.project.domain.chat.entity.ChatMessage;
import org.team4.project.domain.chat.entity.ChatRoom;
import org.team4.project.domain.chat.repository.ChatMessageRepository;
import org.team4.project.domain.member.entity.Member;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;

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
}