package org.team4.project.domain.chat.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;
import org.team4.project.domain.chat.dto.MessageRequest;
import org.team4.project.domain.chat.dto.MessageResponse;
import org.team4.project.domain.chat.entity.ChatMessage;
import org.team4.project.domain.chat.entity.ChatRoom;
import org.team4.project.domain.chat.service.ChatMessageService;
import org.team4.project.domain.chat.service.ChatRoomService;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.member.repository.MemberRepository;

//채팅 웹소켓을 위한 컨트롤러
@Controller
@RequiredArgsConstructor
public class ChatSocketController {

    private final ChatRoomService chatRoomService;
    private final ChatMessageService chatMessageService;
    private final SimpMessageSendingOperations messagingTemplate;
    private final MemberRepository memberRepository;

    @MessageMapping("/chats/sendMessage")
    public void sendMessage(MessageRequest messageRequest) {
        ChatRoom room = chatRoomService.getRoom(messageRequest.getRoomId());
        Member member = memberRepository.getReferenceById(messageRequest.getMemberId());
        // TODO: 인증된 사용자 정보 사용하도록 수정 필요
        ChatMessage savedMessage = chatMessageService.saveMessage(room, member, messageRequest.getContent());

        MessageResponse messageResponse = MessageResponse.from(savedMessage);
        messagingTemplate.convertAndSend("/topic/rooms/" + messageRequest.getRoomId(), messageResponse);
    }
}
