package org.team4.project.domain.chat.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.team4.project.domain.chat.entity.ChatRoom;
import org.team4.project.domain.chat.repository.ChatRoomRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;

    public ChatRoom createRoom(String name) {
        ChatRoom room = new ChatRoom();
        room.setName(name);
        return chatRoomRepository.save(room);
    }

    public List<ChatRoom> getAllRooms() {
        return chatRoomRepository.findAll();
    }

    public ChatRoom getRoom(Long id) {
        return chatRoomRepository.findById(id).orElseThrow(() -> new RuntimeException("채팅방 없음"));
    }
}