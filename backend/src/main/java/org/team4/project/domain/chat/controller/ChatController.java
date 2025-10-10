package org.team4.project.domain.chat.controller;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.team4.project.domain.chat.dto.MessageResponse;
import org.team4.project.domain.chat.entity.ChatMessage;
import org.team4.project.domain.chat.entity.ChatRoom;
import org.team4.project.domain.chat.service.ChatMessageService;
import org.team4.project.domain.chat.service.ChatRoomService;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.member.repository.MemberRepository;
import org.team4.project.global.security.CustomUserDetails;

import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final ChatRoomService chatRoomService;
    private final ChatMessageService chatMessageService;
    private final MemberRepository memberRepository;

    @Getter
    @Setter
    public static class CreateRoomRequest {
        private Long freelancerId;
    }

    @PostMapping("/api/v1/chats/rooms")
    @ResponseBody
    public ChatRoom findOrCreateRoom(@AuthenticationPrincipal CustomUserDetails currentUser, @RequestBody CreateRoomRequest request){
        if(currentUser == null){
            throw new RuntimeException("인증된 사용자 정보가 없습니다.");
        }
        Member client = memberRepository.findByEmail(currentUser.getEmail())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        return chatRoomService.findOrCreateRoom(client, request.getFreelancerId());
    }

    @GetMapping("/api/v1/chats/rooms")
    @ResponseBody
    public List<ChatRoom> getRooms() {
        return chatRoomService.getAllRooms();
    }

    @PostMapping("/api/v1/chats/rooms/{roomId}/message")
    @ResponseBody
    public ChatMessage sendMessage(@PathVariable Long roomId,
                                   @RequestParam Long memberId,
                                   @RequestParam String content) {
        ChatRoom room = chatRoomService.getRoom(roomId);
        Member member = memberRepository.getReferenceById(memberId);
        return chatMessageService.saveMessage(room, member, content);
    }

    @GetMapping("/api/v1/chats/rooms/{roomId}/messages")
    @ResponseBody
    public List<MessageResponse> getMessages(@PathVariable Long roomId) {
        ChatRoom room = chatRoomService.getRoom(roomId);
        List<ChatMessage> messages = chatMessageService.getMessages(roomId);
        return messages.stream()
                .map(MessageResponse::from)
                .collect(Collectors.toList());
    }
}
