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

    @MessageMapping("/chats/confirmWorkComplete")
    public void confirmWorkComplete(@Payload MessageRequest messageRequest, Principal principal) {
        Member client = getMemberFromPrincipal(principal);
        ChatRoom room = chatRoomService.getRoom(messageRequest.getRoomId());

        // 1. 서비스 상태를 '완료'로 변경하는 비즈니스 로직 실행
        chatMessageService.confirmWorkComplete(client, messageRequest.getServiceId());

        // 2. 프리랜서가 보내는 감사 메시지를 생성하고 저장
        Member freelancer = room.getFreelancer();
        String content = "모든 프로젝트가 완료되었습니다.\n이용해주셔서 감사합니다.";
        ChatMessage thankYouMessage = chatMessageService.saveMessage(room, freelancer, content);

        // 3. 저장된 감사 메시지를 실시간으로 클라이언트에게 전송
        MessageResponse messageResponse = MessageResponse.from(thankYouMessage);
        messagingTemplate.convertAndSend("/topic/rooms/" + messageRequest.getRoomId(), messageResponse);
    }
}