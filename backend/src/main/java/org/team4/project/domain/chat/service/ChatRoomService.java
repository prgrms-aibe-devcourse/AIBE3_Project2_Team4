package org.team4.project.domain.chat.service;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.team4.project.domain.chat.dto.ChatRoomResponseDto;
import org.team4.project.domain.chat.entity.ChatRoom;
import org.team4.project.domain.chat.repository.ChatRoomRepository;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.member.repository.MemberRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final MemberRepository memberRepository;
    private final SimpMessagingTemplate messagingTemplate; // 실시간 알림을 위한 SimpMessagingTemplate 주입

    @Transactional
    public ChatRoom findOrCreateRoom(Member client, Long freelancerId) {
        Member freelancer = memberRepository.findById(freelancerId)
                .orElseThrow(() -> new RuntimeException("채팅 상대를 찾을 수 없습니다. ID: " + freelancerId));

        // 기존에 방이 있는지 먼저 확인
        return chatRoomRepository.findByClientAndFreelancer(client, freelancer)
                .orElseGet(() -> {
                    // 방이 존재하지 않을 경우 새로 생성하고 알림.
                    ChatRoom newRoom = new ChatRoom();
                    newRoom.setClient(client);
                    newRoom.setFreelancer(freelancer);
                    newRoom.setName(client.getNickname() + "님과 " + freelancer.getNickname() + "님의 채팅방");
                    ChatRoom savedRoom = chatRoomRepository.save(newRoom);

                    ChatRoomResponseDto roomDto = ChatRoomResponseDto.from(savedRoom);

                    // 두 참여자 모두에게 각자의 개인 토픽으로 새 채팅방 정보를 실시간으로 전송
                    messagingTemplate.convertAndSend("/topic/user/" + client.getId() + "/rooms", roomDto);
                    messagingTemplate.convertAndSend("/topic/user/" + freelancer.getId() + "/rooms", roomDto);

                    return savedRoom;
                });
    }

    public List<ChatRoom> getRoomsForUser(Member currentUser) {
        return chatRoomRepository.findAllByParticipant(currentUser);
    }

    public ChatRoom getRoom(Long id) {
        return chatRoomRepository.findById(id).orElseThrow(() -> new RuntimeException("채팅방 없음"));
    }

    @Transactional
    public void leaveRoom(Long roomId, Member currentUser) {
        ChatRoom room = getRoom(roomId);

        // 사용자가 채팅방의 참여자인지 확인
        boolean isParticipant = room.getClient().getId().equals(currentUser.getId()) ||
                                room.getFreelancer().getId().equals(currentUser.getId());

        if (!isParticipant) {
            throw new SecurityException("채팅방을 나갈 권한이 없습니다.");
        }

        // 상대방에게 보낼 시스템 메시지 생성
        org.team4.project.domain.chat.dto.MessageResponse leaveMessage = org.team4.project.domain.chat.dto.MessageResponse.builder()
            .sender("System")
            .content(currentUser.getNickname() + "님이 대화방을 나가셨습니다.")
            .messageType(org.team4.project.domain.chat.entity.ChatMessage.MessageType.REVIEW_PROMPT) // 시스템 메시지 타입 재활용
            .createdAt(java.time.LocalDateTime.now())
            .build();

        // 채팅방 토픽으로 메시지 전송
        messagingTemplate.convertAndSend("/topic/rooms/" + roomId, leaveMessage);

        // 채팅방 삭제
        chatRoomRepository.delete(room);
    }

    @Transactional
    public void blockUser(Long roomId, Member currentUser) {
        ChatRoom room = getRoom(roomId);
        System.out.println("User " + currentUser.getEmail() + " initiated a block in room " + roomId);
    }

    @Transactional
    public void reportRoom(Long roomId, Member currentUser) {
        ChatRoom room = getRoom(roomId);
        System.out.println("User " + currentUser.getEmail() + " reported room " + roomId);
    }

    @Transactional
    public void requestPayment(Long roomId, Member currentUser) {
        ChatRoom room = getRoom(roomId);
        System.out.println("User " + currentUser.getEmail() + " requested payment in room " + roomId);
    }
}