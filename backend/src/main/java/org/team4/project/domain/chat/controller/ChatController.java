package org.team4.project.domain.chat.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.team4.project.domain.chat.entity.ChatMessage;
import org.team4.project.domain.chat.entity.ChatRoom;
import org.team4.project.domain.chat.service.ChatMessageService;
import org.team4.project.domain.chat.service.ChatRoomService;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.member.repository.MemberRepository;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final ChatRoomService chatRoomService;
    private final ChatMessageService chatMessageService;
    private final SimpMessageSendingOperations messagingTemplate;
    private final MemberRepository memberRepository;

    @PostMapping("/api/v1/chats/rooms")
    @ResponseBody
    public ChatRoom createRoom(@RequestParam String name) {
        return chatRoomService.createRoom(name);
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
    public List<ChatMessage> getMessages(@PathVariable Long roomId) {
        ChatRoom room = chatRoomService.getRoom(roomId);
        return chatMessageService.getMessages(roomId);
    }
}
