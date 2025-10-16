package org.team4.project.domain.chat.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.team4.project.domain.chat.dto.MessageRequest;
import org.team4.project.domain.chat.dto.MessageResponse;
import org.team4.project.domain.chat.entity.ChatMessage;
import org.team4.project.domain.chat.entity.ChatRoom;
import org.team4.project.domain.chat.service.ChatMessageService;
import org.team4.project.domain.chat.service.ChatRoomService;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.member.repository.MemberRepository;
import org.team4.project.global.security.CustomUserDetails;

import java.security.Principal;

//채팅 웹소켓을 위한 컨트롤러
@Controller
@RequiredArgsConstructor
public class ChatSocketController {

    private final ChatRoomService chatRoomService;
    private final ChatMessageService chatMessageService;
    private final SimpMessageSendingOperations messagingTemplate;
    private final MemberRepository memberRepository;

    private Member getMemberFromPrincipal(Principal principal) {
        if (principal == null) {
            throw new RuntimeException("사용자 인증 정보 없음");
        }
        CustomUserDetails customUserDetails = (CustomUserDetails) ((Authentication) principal).getPrincipal();
        return memberRepository.findByEmail(customUserDetails.getEmail())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + customUserDetails.getEmail()));
    }

    @MessageMapping("/chats/sendMessage")
    public void sendMessage(@Payload MessageRequest messageRequest, Principal principal) {
        Member member = getMemberFromPrincipal(principal);
        ChatRoom room = chatRoomService.getRoom(messageRequest.getRoomId());

        ChatMessage savedMessage = chatMessageService.saveMessage(room, member, messageRequest.getContent());

        MessageResponse messageResponse = MessageResponse.from(savedMessage);
        messagingTemplate.convertAndSend("/topic/rooms/" + messageRequest.getRoomId(), messageResponse);
    }

    @MessageMapping("/chats/sendPaymentRequest")
    public void sendPaymentRequest(@Payload MessageRequest messageRequest, Principal principal) {
        Member member = getMemberFromPrincipal(principal);
        ChatRoom room = chatRoomService.getRoom(messageRequest.getRoomId());

        ChatMessage savedMessage = chatMessageService.savePaymentRequest(room, member, messageRequest);

        MessageResponse messageResponse = MessageResponse.from(savedMessage);
        messagingTemplate.convertAndSend("/topic/rooms/" + messageRequest.getRoomId(), messageResponse);
    }

    @MessageMapping("/chats/sendMeetingRequest")
    public void sendMeetingRequest(@Payload MessageRequest messageRequest, Principal principal) {
        Member member = getMemberFromPrincipal(principal);
        ChatRoom room = chatRoomService.getRoom(messageRequest.getRoomId());

        ChatMessage savedMessage = chatMessageService.saveMeetingRequest(room, member, messageRequest);

        MessageResponse messageResponse = MessageResponse.from(savedMessage);
        messagingTemplate.convertAndSend("/topic/rooms/" + messageRequest.getRoomId(), messageResponse);
    }

    @MessageMapping("/chats/sendWorkCompleteRequest")
    public void sendWorkCompleteRequest(@Payload MessageRequest messageRequest, Principal principal) {
        Member member = getMemberFromPrincipal(principal);
        ChatRoom room = chatRoomService.getRoom(messageRequest.getRoomId());

        ChatMessage savedMessage = chatMessageService.saveWorkCompleteRequest(room, member, messageRequest);

        MessageResponse messageResponse = MessageResponse.from(savedMessage);
        messagingTemplate.convertAndSend("/topic/rooms/" + messageRequest.getRoomId(), messageResponse);
    }


    public void confirmWorkComplete(@Payload MessageRequest messageRequest, Principal principal) {
        Member member = getMemberFromPrincipal(principal);
        ChatRoom room = chatRoomService.getRoom(messageRequest.getRoomId());

        ChatMessage systemMessage = chatMessageService.confirmWorkComplete(room, member, messageRequest.getServiceId());

        MessageResponse messageResponse = MessageResponse.from(systemMessage);
        messagingTemplate.convertAndSend("/topic/rooms/" + messageRequest.getRoomId(), messageResponse);
    }
}