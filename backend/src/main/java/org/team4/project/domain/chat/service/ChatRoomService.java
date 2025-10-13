package org.team4.project.domain.chat.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.team4.project.domain.chat.entity.ChatRoom;
import org.team4.project.domain.chat.repository.ChatRoomRepository;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.member.repository.MemberRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public ChatRoom findOrCreateRoom(Member client, Long freelancerId) {
        Member freelancer = memberRepository.findById(freelancerId)
                .orElseThrow(() -> new RuntimeException("채팅 상대를 찾을 수 없습니다. ID: " + freelancerId));

        Optional<ChatRoom> existingRoom = chatRoomRepository.findByClientAndFreelancer(client, freelancer);

        return existingRoom.orElseGet(() -> {
            ChatRoom newRoom = new ChatRoom();
            newRoom.setClient(client);
            newRoom.setFreelancer(freelancer);
            return chatRoomRepository.save(newRoom);
        });
    }

    public List<ChatRoom> getAllRooms() {
        return chatRoomRepository.findAll();
    }

    public ChatRoom getRoom(Long id) {
        return chatRoomRepository.findById(id).orElseThrow(() -> new RuntimeException("채팅방 없음"));
    }
}