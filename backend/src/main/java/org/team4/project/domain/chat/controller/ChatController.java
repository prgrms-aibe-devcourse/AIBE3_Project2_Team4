package org.team4.project.domain.chat.controller;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.team4.project.domain.chat.dto.ChatRoomResponseDto;
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

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/chats")
public class ChatController {

    private final ChatRoomService chatRoomService;
    private final ChatMessageService chatMessageService;
    private final MemberRepository memberRepository;

    @Getter
    @Setter
    public static class CreateRoomRequest {
        private Long freelancerId;
    }

    private Member getCurrentMember(CustomUserDetails currentUser) {
        if (currentUser == null) {
            throw new RuntimeException("인증된 사용자 정보가 없습니다.");
        }
        return memberRepository.findByEmail(currentUser.getEmail())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
    }

    @PostMapping("/rooms")
    public ChatRoom findOrCreateRoom(@AuthenticationPrincipal CustomUserDetails currentUser,
                                     @RequestBody CreateRoomRequest request){
        System.out.println("=== ChatController /rooms POST ===");
        System.out.println("Request freelancerId: " + request.getFreelancerId());
        System.out.println("CurrentUser: " + currentUser);

        if(currentUser == null){
            System.out.println("currentUser is null → 인증 실패!");
        }

        Member client = getCurrentMember(currentUser);
        System.out.println("Client member: " + client.getEmail());
        return chatRoomService.findOrCreateRoom(client, request.getFreelancerId());
    }

    @GetMapping("/rooms")
    public List<ChatRoomResponseDto> getRooms(@AuthenticationPrincipal CustomUserDetails currentUser) {
        Member member = getCurrentMember(currentUser);
        return chatRoomService.getRoomsForUser(member).stream()
                .map(ChatRoomResponseDto::from)
                .collect(Collectors.toList());
    }

    @PostMapping("/rooms/{roomId}/message")
    public ChatMessage sendMessage(@PathVariable Long roomId,
                                   @RequestParam Long memberId,
                                   @RequestBody String content) {
        ChatRoom room = chatRoomService.getRoom(roomId);
        Member member = memberRepository.getReferenceById(memberId);
        return chatMessageService.saveMessage(room, member, content);
    }

    @GetMapping("/rooms/{roomId}/messages")
    public List<MessageResponse> getMessages(@PathVariable Long roomId) {
        ChatRoom room = chatRoomService.getRoom(roomId);
        List<ChatMessage> messages = chatMessageService.getMessages(roomId);
        return messages.stream()
                .map(MessageResponse::from)
                .collect(Collectors.toList());
    }

    @DeleteMapping("/rooms/{roomId}/leave")
    public ResponseEntity<Void> leaveRoom(@PathVariable Long roomId, @AuthenticationPrincipal CustomUserDetails currentUser) {
        Member member = getCurrentMember(currentUser);
        chatRoomService.leaveRoom(roomId, member);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/rooms/{roomId}/block")
    public ResponseEntity<Void> blockUser(@PathVariable Long roomId, @AuthenticationPrincipal CustomUserDetails currentUser) {
        Member member = getCurrentMember(currentUser);
        chatRoomService.blockUser(roomId, member);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/rooms/{roomId}/report")
    public ResponseEntity<Void> reportRoom(@PathVariable Long roomId, @AuthenticationPrincipal CustomUserDetails currentUser) {
        Member member = getCurrentMember(currentUser);
        chatRoomService.reportRoom(roomId, member);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/rooms/{roomId}/request-payment")
    public ResponseEntity<Void> requestPayment(@PathVariable Long roomId, @AuthenticationPrincipal CustomUserDetails currentUser) {
        Member member = getCurrentMember(currentUser);
        // Add role check here if needed, e.g., if (member.getRole() != Role.FREELANCER) { ... }
        chatRoomService.requestPayment(roomId, member);
        return ResponseEntity.ok().build();
    }
}