package org.team4.project.domain.chat.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.team4.project.domain.chat.dto.MessageRequest;
import org.team4.project.domain.chat.dto.MessageResponse;
import org.team4.project.domain.chat.entity.ChatMessage;
import org.team4.project.domain.chat.entity.ChatRoom;
import org.team4.project.domain.chat.service.ChatMessageService;
import org.team4.project.domain.chat.service.ChatRoomService;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final ChatRoomService chatRoomService;
    private final ChatMessageService chatMessageService;
    private final SimpMessageSendingOperations messagingTemplate;

    @MessageMapping("/chats/sendMessage")
    public void sendMessage(MessageRequest messageRequest) {
        ChatRoom room = chatRoomService.getRoom(messageRequest.getRoomId());
        ChatMessage savedMessage = chatMessageService.saveMessage(room, messageRequest.getSender(), messageRequest.getContent());

        // Response DTO로 전송
        MessageResponse messageResponse = MessageResponse.from(savedMessage);
        messagingTemplate.convertAndSend("/topic/room/" + messageRequest.getRoomId(), messageResponse);
    }


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
                                   @RequestParam String sender,
                                   @RequestParam String content) {
        ChatRoom room = chatRoomService.getRoom(roomId);
        return chatMessageService.saveMessage(room, sender, content);
    }

    @GetMapping("/api/v1/chats/rooms/{roomId}/messages")
    @ResponseBody
    public List<ChatMessage> getMessages(@PathVariable Long roomId) {
        ChatRoom room = chatRoomService.getRoom(roomId);
        return chatMessageService.getMessages(roomId);
    }
}
